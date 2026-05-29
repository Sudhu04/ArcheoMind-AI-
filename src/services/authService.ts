import { User, UserRole, NeuralLog } from '../types';
import { auth, db } from '../lib/firebase';
import { storage } from './storageService';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  browserSessionPersistence,
  setPersistence
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';

// Helper to generate a capitalized name from the email
const nameFromEmail = (email: string): string => {
  if (!email) return 'User';
  const part = email.split('@')[0];
  return part.charAt(0).toUpperCase() + part.slice(1);
};

// Helper to mirror to local server for "code editor access"
const mirrorToLocal = async (data: any, type: 'USER' | 'LOG') => {
  try {
    await fetch('/api/mirror', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data })
    });
  } catch (e) {
    console.warn("Mirroring failed", e);
  }
};

export const authService = {
  isHeadAdmin: (user: User | null): boolean => {
    return user?.email === 'sudhanvams7@gmail.com' || user?.email === 'kratosadmin@archeomind.ai' || user?.role === 'admin';
  },

  signup: async (email: string, name: string, password: string, role: UserRole = 'researcher'): Promise<User> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Auto-assign admin for whitelisted emails
      let finalRole = role;
      if (email === 'sudhanvams7@gmail.com' || email === 'kratosadmin@archeomind.ai') {
        finalRole = 'admin';
      }

      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || email,
        name,
        role: finalRole,
        joinedAt: Date.now()
      };

      await storage.logAction({
        action: 'NEURAL_SIGNUP',
        userId: userData.id,
        userName: userData.name,
        targetId: userData.id,
        targetName: `Account Created: ${userData.email}`
      });

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        createdAt: serverTimestamp()
      });

      await mirrorToLocal(userData, 'USER');
      return userData;
    } catch (error: any) {
      console.error("Signup error:", error);
      throw new Error(error.message || 'Signup failed');
    }
  },

  login: async (email: string, password: string): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      let userData: User | null = null;
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          userData = userDoc.data() as User;
        }
      } catch (err) {
        console.warn("Firestore error during login doc load, falling back to local list lookup:", err);
      }

      if (!userData) {
        try {
          const res = await fetch('/api/users');
          if (res.ok) {
            const list = await res.json() as User[];
            const match = list.find(u => u.id === firebaseUser.uid || u.email === (firebaseUser.email || email));
            if (match) userData = match;
          }
        } catch (e) {
          console.error("Local user list lookup fallback failed", e);
        }
      }

      if (!userData) {
        // Safe, default instant fallback for whitelisted/authorised credentials
        userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email || email,
          name: nameFromEmail(firebaseUser.email || email),
          role: (email === 'sudhanvams7@gmail.com' || email === 'kratosadmin@archeomind.ai') ? 'admin' : 'researcher',
          joinedAt: Date.now()
        };
      }
      
      // Auto-upgrade whitelisted emails during login
      if ((email === 'sudhanvams7@gmail.com' || email === 'kratosadmin@archeomind.ai') && userData.role !== 'admin') {
        try {
          await updateDoc(doc(db, 'users', firebaseUser.uid), { role: 'admin' });
        } catch(e) {}
        userData.role = 'admin';
      }
      
      await mirrorToLocal(userData, 'USER');

      await storage.logAction({
        action: 'NEURAL_LOGIN',
        userId: userData.id,
        userName: userData.name,
        targetId: userData.id,
        targetName: `Session Initiated: ${userData.email}`
      });

      return userData;
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || 'Login failed');
    }
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem('archeo_user');
    return stored ? JSON.parse(stored) : null;
  },

  onAuthChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let userData: User | null = null;
        try {
          let userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            userData = userDoc.data() as User;
          }
        } catch (err) {
          console.warn("Firestore error in onAuthChange, executing resilient fallbacks:", err);
        }
        
        if (!userData) {
          const stored = localStorage.getItem('archeo_user');
          if (stored) {
            try {
              userData = JSON.parse(stored);
            } catch(e) {}
          }
        }

        if (!userData) {
          try {
            const res = await fetch('/api/users');
            if (res.ok) {
              const list = await res.json() as User[];
              const match = list.find(u => u.id === firebaseUser.uid || u.email === firebaseUser.email);
              if (match) userData = match;
            }
          } catch (e) {}
        }

        if (!userData && firebaseUser) {
          const email = firebaseUser.email || '';
          userData = {
            id: firebaseUser.uid,
            email,
            name: nameFromEmail(email),
            role: (email === 'sudhanvams7@gmail.com' || email === 'kratosadmin@archeomind.ai') ? 'admin' : 'researcher',
            joinedAt: Date.now()
          };
        }

        if (userData) {
          // Auto-upgrade whitelisted emails
          if ((userData.email === 'sudhanvams7@gmail.com' || userData.email === 'kratosadmin@archeomind.ai') && userData.role !== 'admin') {
            try {
              await updateDoc(doc(db, 'users', firebaseUser.uid), { role: 'admin' });
            } catch(e) {}
            userData.role = 'admin';
          }

          localStorage.setItem('archeo_user', JSON.stringify(userData));
          callback(userData);
        } else {
          callback(null);
        }
      } else {
        localStorage.removeItem('archeo_user');
        callback(null);
      }
    });
  },

  getUsers: async (): Promise<User[]> => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      return snapshot.docs.map(d => d.data() as User);
    } catch (error) {
      console.warn("Fetch users error via Firestore, attempting local REST API fallback:", error);
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          return await res.json() as User[];
        }
      } catch (err) {
        console.error("Local REST API fallback for users failed:", err);
      }
      return [];
    }
  },

  getLogs: async (): Promise<NeuralLog[]> => {
    try {
      const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'), limit(100));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as NeuralLog));
    } catch (error) {
      console.warn("Fetch logs error via Firestore, attempting local REST API fallback:", error);
      try {
        const res = await fetch('/api/logs');
        if (res.ok) {
          return await res.json() as NeuralLog[];
        }
      } catch (err) {
        console.error("Local REST API fallback for logs failed:", err);
      }
      return [];
    }
  },

  logout: async () => {
    const user = authService.getCurrentUser();
    if (user) {
      await storage.logAction({
        action: 'NEURAL_LOGOUT',
        userId: user.id,
        userName: user.name,
        targetId: user.id,
        targetName: `Session Terminated: ${user.email}`
      });
    }
    await signOut(auth);
    localStorage.removeItem('archeo_user');
  },

  updateUserRole: async (userId: string, role: UserRole): Promise<void> => {
    try {
      await updateDoc(doc(db, 'users', userId), { role });
      await mirrorToLocal({ id: userId, role }, 'USER');
    } catch (error) {
      console.warn("Firestore updateUserRole failed, using local REST API:", error);
      try {
        const res = await fetch(`/api/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role })
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
      } catch (err) {
        console.error("REST update user role failed:", err);
        throw new Error('Role update failed');
      }
    }
  },

  updateUserProfile: async (userId: string, data: Partial<User>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'users', userId), { ...data, updatedAt: serverTimestamp() });
      await mirrorToLocal({ id: userId, ...data }, 'USER');
    } catch (error) {
      console.warn("Firestore updateUserProfile failed, using local REST API:", error);
      try {
        const res = await fetch(`/api/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
      } catch (err) {
        console.error("REST update user profile failed:", err);
        throw new Error('Profile update failed');
      }
    }
  },

  deleteUser: async (userId: string): Promise<void> => {
    try {
      const { deleteDoc, doc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'users', userId));
      await mirrorToLocal({ id: userId, deleted: true }, 'USER');
    } catch (error) {
      console.warn("Firestore deleteUser failed, using local REST API:", error);
      try {
        const res = await fetch(`/api/users/${userId}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
      } catch (err) {
        console.error("REST delete user failed:", err);
        throw new Error('User deletion failed');
      }
    }
  },

  updateUserVerification: async (userId: string, isVerified: boolean): Promise<void> => {
    try {
      await updateDoc(doc(db, 'users', userId), { isVerified });
      await mirrorToLocal({ id: userId, isVerified }, 'USER');
    } catch (error) {
      console.warn("Firestore updateUserVerification failed, using local REST API:", error);
      try {
        const res = await fetch(`/api/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isVerified })
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
      } catch (err) {
        console.error("REST update user verification failed:", err);
        throw new Error('Verification update failed');
      }
    }
  },

  addXP: async (userId: string, amount: number): Promise<void> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return;
      const userData = userDoc.data() as User;
      const newXP = (userData.xp || 0) + amount;
      // Simple leveling logic: level = floor(sqrt(xp/100))
      const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
      
      const updateData: Partial<User> = {
        xp: newXP,
        level: newLevel
      };

      // Check for milestones/badges
      if (newLevel > (userData.level || 1)) {
        const newBadge = {
          id: Math.random().toString(36).substring(7),
          name: `Neural Level ${newLevel}`,
          icon: 'Sparkles',
          earnedAt: Date.now()
        };
        updateData.badges = [...(userData.badges || []), newBadge];
      }

      await updateDoc(doc(db, 'users', userId), updateData);
      await mirrorToLocal({ id: userId, ...updateData }, 'USER');
    } catch (error) {
      console.warn("Firestore addXP failed, trying local REST API:", error);
      try {
        const resGet = await fetch('/api/users');
        if (resGet.ok) {
          const list = await resGet.json() as User[];
          const u = list.find(user => user.id === userId);
          if (u) {
            const newXP = (u.xp || 0) + amount;
            const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
            const updateData: Partial<User> = {
              xp: newXP,
              level: newLevel
            };
            if (newLevel > (u.level || 1)) {
              const newBadge = {
                id: Math.random().toString(16).substring(7),
                name: `Neural Level ${newLevel}`,
                icon: 'Sparkles',
                earnedAt: Date.now()
              };
              updateData.badges = [...(u.badges || []), newBadge];
            }
            await fetch(`/api/users/${userId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updateData)
            });
          }
        }
      } catch (err) {
        console.error("Local addXP fallback failed:", err);
      }
    }
  },

  loginAsDummy: async (userData: User): Promise<User> => {
    // In a real app, this would be a secure token exchange.
    // Here, we simulate a successful authentication for dummy research accounts.
    localStorage.setItem('archeo_user', JSON.stringify(userData));
    await mirrorToLocal(userData, 'USER');

    await storage.logAction({
      action: 'DUMMY_NEURAL_LINK',
      userId: userData.id,
      userName: userData.name,
      targetId: userData.id,
      targetName: `Simulated Link: ${userData.email}`
    });

    return userData;
  }
};
