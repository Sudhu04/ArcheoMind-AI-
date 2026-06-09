import { Artifact, ChatMessage, Exhibit, ResearchLab, AuditLog, User } from '../types';
import { db, auth } from '../lib/firebase';
import { SEED_ARTIFACTS } from '../constants/seedArtifacts';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  serverTimestamp,
  orderBy,
  limitToLast,
  writeBatch
} from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper to mirror to local server for "code editor access"
const mirrorToLocal = async (data: any, type: 'ARTIFACT' | 'LOG') => {
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

export const storage = {
  seedArchives: async (currentUser: User) => {
    try {
      const q = query(collection(db, 'artifacts'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) return; // Already seeded

      const batch = writeBatch(db);
      for (const item of SEED_ARTIFACTS) {
        const docRef = doc(collection(db, 'artifacts'));
        batch.set(docRef, {
          ...item,
          userId: currentUser.id,
          userName: currentUser.name,
          timestamp: Date.now(),
          createdAt: serverTimestamp()
        });
      }
      await batch.commit();
      console.log("Archives seeded successfully.");
    } catch (error) {
      console.error("Seeding failed", error);
    }
  },

  getArtifacts: async (): Promise<Artifact[]> => {
    try {
      const q = query(collection(db, 'artifacts'));
      const snapshot = await getDocs(q);
      const artifacts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Artifact));
      return artifacts;
    } catch (error) {
      console.warn("Firestore getArtifacts failed, falling back to local REST API", error);
      try {
        const res = await fetch('/api/artifacts');
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.error("REST fallback for artifacts failed:", err);
      }
      return [];
    }
  },
  
  subscribeToArtifacts: (callback: (artifacts: Artifact[]) => void) => {
    let unsubscribe: (() => void) | null = null;
    let fallbackInterval: any = null;
    let isFallbackActive = false;

    try {
      const q = query(collection(db, 'artifacts'));
      unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const artifacts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Artifact));
          callback(artifacts);
        },
        async (error) => {
          console.log("ℹ️ Firestore subscription transitioned to local/REST polling.");
          if (unsubscribe) {
            try { unsubscribe(); } catch(e) {}
            unsubscribe = null;
          }
          activatePollingFallback();
        }
      );
    } catch (err) {
      console.log("ℹ️ Firestore subscription transitioned to local/REST polling.");
      activatePollingFallback();
    }

    async function activatePollingFallback() {
      if (isFallbackActive) return;
      isFallbackActive = true;
      
      const poll = async () => {
        try {
          const res = await fetch('/api/artifacts');
          if (res.ok) {
            const data = await res.json();
            callback(data);
          }
        } catch (e: any) {
          // Avoid triggering error warnings for transient browser network polling during dev server restarts
          if (e?.message?.includes('Failed to fetch') || e?.message?.includes('Fetch failed') || e?.toString().includes('Failed to fetch')) {
            console.log("ℹ️ Polling artifacts fallback: server transient status update.");
          } else {
            console.log("ℹ️ Polling artifacts fallback: status update.", e?.message || e);
          }
        }
      };
      
      await poll();
      fallbackInterval = setInterval(poll, 4000);
    }

    return () => {
      if (unsubscribe) {
        try { unsubscribe(); } catch(e) {}
      }
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
      }
    };
  },

  saveArtifact: async (artifact: Artifact) => {
    try {
      const { id, ...data } = artifact;
      if (id && id.length > 5) { // Check if it's an existing ID
        const docRef = doc(db, 'artifacts', id);
        await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        await mirrorToLocal({ ...artifact, updatedAt: Date.now() }, 'ARTIFACT');
      } else {
        const docRef = await addDoc(collection(db, 'artifacts'), { 
          ...data, 
          timestamp: Date.now(),
          createdAt: serverTimestamp() 
        });
        await mirrorToLocal({ ...artifact, id: docRef.id, timestamp: Date.now() }, 'ARTIFACT');
      }
    } catch (error) {
      console.warn("Firestore saveArtifact failed, falling back to REST API:", error);
      try {
        const res = await fetch('/api/artifacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(artifact)
        });
        if (!res.ok) {
          throw new Error("HTTP " + res.status);
        }
      } catch (err) {
        console.error("REST fallback saveArtifact fail:", err);
        handleFirestoreError(error, OperationType.WRITE, 'artifacts');
      }
    }
  },

  deleteArtifact: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'artifacts', id));
      await mirrorToLocal({ id, deleted: true }, 'LOG');
    } catch (error) {
      console.warn("Firestore deleteArtifact failed, falling back to REST API:", error);
      try {
        const res = await fetch(`/api/artifacts/${id}`, {
          method: 'DELETE'
        });
        if (!res.ok) {
          throw new Error("HTTP " + res.status);
        }
      } catch (err) {
        console.error("REST fallback deleteArtifact fail:", err);
        handleFirestoreError(error, OperationType.DELETE, `artifacts/${id}`);
      }
    }
  },

  verifyArtifact: async (id: string) => {
    try {
      const docRef = doc(db, 'artifacts', id);
      await updateDoc(docRef, { isVerified: true, verifiedAt: serverTimestamp() });
      await mirrorToLocal({ id, isVerified: true }, 'ARTIFACT');
    } catch (error) {
      console.warn("Firestore verifyArtifact failed, falling back to REST API:", error);
      try {
        const resList = await fetch('/api/artifacts');
        if (resList.ok) {
          const artifacts = await resList.json();
          const match = artifacts.find((a: any) => a.id === id);
          if (match) {
            match.isVerified = true;
            match.verifiedAt = Date.now();
            await fetch('/api/artifacts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(match)
            });
          }
        }
      } catch (err) {
        console.error("REST fallback verifyArtifact fail:", err);
        handleFirestoreError(error, OperationType.UPDATE, `artifacts/${id}`);
      }
    }
  },

  searchArtifacts: async (keywords: string): Promise<Artifact[]> => {
    try {
      const q = query(
        collection(db, 'artifacts'),
        where('tags', 'array-contains-any', keywords.toLowerCase().split(/\s+/).slice(0, 10))
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Artifact));
    } catch (error) {
      console.warn("Firestore searchArtifacts failed, falling back to local filtration:", error);
      try {
        const res = await fetch('/api/artifacts');
        if (res.ok) {
          const artifacts = await res.json() as Artifact[];
          const kw = keywords.toLowerCase();
          return artifacts.filter(a => 
            (a.name && a.name.toLowerCase().includes(kw)) || 
            (a.civilization && a.civilization.toLowerCase().includes(kw)) ||
            (a.tags && a.tags.some(t => t.toLowerCase().includes(kw))) ||
            (a.description && a.description.toLowerCase().includes(kw))
          );
        }
      } catch (err) {}
      
      try {
        const q = query(collection(db, 'artifacts'), limitToLast(100));
        const snapshot = await getDocs(q);
        const artifacts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Artifact));
        return artifacts.filter(a => 
          (a.name || '').toLowerCase().includes((keywords || '').toLowerCase()) || 
          (a.civilization || '').toLowerCase().includes((keywords || '').toLowerCase())
        );
      } catch (fallbackErr) {
        return [];
      }
    }
  },

  unverifyArtifact: async (id: string) => {
    try {
      const docRef = doc(db, 'artifacts', id);
      await updateDoc(docRef, { isVerified: false, unverifiedAt: serverTimestamp() });
      await mirrorToLocal({ id, isVerified: false }, 'ARTIFACT');
    } catch (error) {
      console.warn("Firestore unverifyArtifact failed, falling back to REST API:", error);
      try {
        const resList = await fetch('/api/artifacts');
        if (resList.ok) {
          const artifacts = await resList.json();
          const match = artifacts.find((a: any) => a.id === id);
          if (match) {
            match.isVerified = false;
            match.unverifiedAt = Date.now();
            await fetch('/api/artifacts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(match)
            });
          }
        }
      } catch (err) {
        console.error("REST fallback unverifyArtifact fail:", err);
        handleFirestoreError(error, OperationType.UPDATE, `artifacts/${id}`);
      }
    }
  },
  
  // Real-time Chat
  sendChatMessage: async (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    try {
      const chatRef = collection(db, 'chat');
      await addDoc(chatRef, {
        ...message,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.warn("Firestore sendChatMessage failed, falling back to REST API:", error);
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message)
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
      } catch (err) {
        console.error("REST fallback sendChatMessage fail:", err);
        handleFirestoreError(error, OperationType.WRITE, 'chat');
      }
    }
  },

  subscribeToChat: (callback: (messages: ChatMessage[]) => void) => {
    let unsubscribe: (() => void) | null = null;
    let fallbackInterval: any = null;
    let isFallbackActive = false;

    try {
      const q = query(collection(db, 'chat'), orderBy('timestamp', 'asc'), limitToLast(50));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
        callback(messages);
      }, (error) => {
        console.warn("Firestore chat subscription failed, activating local REST polling fallback:", error);
        if (unsubscribe) {
          try { unsubscribe(); } catch(e) {}
          unsubscribe = null;
        }
        activatePolling();
      });
    } catch (err) {
      console.warn("Firestore chat subscription setup failed, activating local REST polling fallback:", err);
      activatePolling();
    }

    async function activatePolling() {
      if (isFallbackActive) return;
      isFallbackActive = true;
      const poll = async () => {
        try {
          const res = await fetch('/api/chat');
          if (res.ok) {
            const data = await res.json();
            data.sort((a: any, b: any) => (a.timestamp || 0) - (b.timestamp || 0));
            callback(data);
          }
        } catch (e) {
          console.error("Polling chat error:", e);
        }
      };
      await poll();
      fallbackInterval = setInterval(poll, 3000);
    }

    return () => {
      if (unsubscribe) {
        try { unsubscribe(); } catch(e) {}
      }
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
      }
    };
  },

  // Exhibits
  saveExhibit: async (exhibit: Omit<Exhibit, 'id' | 'timestamp'>) => {
    try {
      const exhibitRef = collection(db, 'exhibits');
      await addDoc(exhibitRef, {
        ...exhibit,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.warn("Firestore saveExhibit failed, falling back to REST API:", error);
      try {
        const res = await fetch('/api/exhibits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(exhibit)
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
      } catch (err) {
        console.error("REST fallback saveExhibit fail:", err);
        handleFirestoreError(error, OperationType.WRITE, 'exhibits');
      }
    }
  },

  getExhibits: async (): Promise<Exhibit[]> => {
    try {
      const q = query(collection(db, 'exhibits'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exhibit));
    } catch (error) {
      console.warn("Firestore getExhibits failed, falling back to REST API:", error);
      try {
        const res = await fetch('/api/exhibits');
        if (res.ok) {
          const data = await res.json();
          data.sort((a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0));
          return data;
        }
      } catch (err) {}
      return [];
    }
  },

  // Research Labs
  saveLab: async (lab: Omit<ResearchLab, 'id'>) => {
    try {
      const labRef = collection(db, 'labs');
      return await addDoc(labRef, {
        ...lab,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.warn("Firestore saveLab failed, falling back to REST API:", error);
      try {
        const res = await fetch('/api/labs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lab)
        });
        if (res.ok) {
          return await res.json();
        }
        throw new Error("HTTP " + res.status);
      } catch (err) {
        console.error("REST fallback saveLab fail:", err);
        handleFirestoreError(error, OperationType.WRITE, 'labs');
      }
    }
  },

  getLabs: async (): Promise<ResearchLab[]> => {
    try {
      const q = query(collection(db, 'labs'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ResearchLab));
    } catch (error) {
      console.warn("Firestore getLabs failed, falling back to REST API:", error);
      try {
        const res = await fetch('/api/labs');
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {}
      return [];
    }
  },

  subscribeToLabs: (callback: (labs: ResearchLab[]) => void) => {
    let unsubscribe: (() => void) | null = null;
    let fallbackInterval: any = null;
    let isFallbackActive = false;

    try {
      const q = query(collection(db, 'labs'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const labs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ResearchLab));
        callback(labs);
      }, (error) => {
        console.warn("Firestore labs subscription failed, falling back to local polling:", error);
        if (unsubscribe) {
          try { unsubscribe(); } catch(e) {}
          unsubscribe = null;
        }
        activatePolling();
      });
    } catch (err) {
      console.warn("Firestore labs subscription setup failed, falling back to local polling:", err);
      activatePolling();
    }

    async function activatePolling() {
      if (isFallbackActive) return;
      isFallbackActive = true;
      const poll = async () => {
        try {
          const res = await fetch('/api/labs');
          if (res.ok) {
            const data = await res.json();
            callback(data);
          }
        } catch (e) {
          console.error("Polling labs error:", e);
        }
      };
      await poll();
      fallbackInterval = setInterval(poll, 4000);
    }

    return () => {
      if (unsubscribe) {
        try { unsubscribe(); } catch(e) {}
      }
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
      }
    };
  },

  updateLab: async (id: string, updates: Partial<ResearchLab>) => {
    try {
      const labRef = doc(db, 'labs', id);
      await updateDoc(labRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.warn("Firestore updateLab failed, falling back to REST API:", error);
      try {
        const res = await fetch(`/api/labs/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
      } catch (err) {
        console.error("REST fallback updateLab fail:", err);
        handleFirestoreError(error, OperationType.UPDATE, `labs/${id}`);
      }
    }
  },

  // Audit Logs
  logAction: async (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    try {
      const logRef = collection(db, 'audit_logs');
      await addDoc(logRef, {
        ...log,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.warn('Firestore Audit Log failed, falling back to REST api Logging:', error);
      try {
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: log.userId,
            action: log.action,
            details: log
          })
        });
      } catch (err) {
        console.error('REST fallback audit log fail:', err);
      }
    }
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    try {
      const q = query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'), limitToLast(100));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data() as any;
        return { 
          id: doc.id, 
          ...data,
          timestamp: data.timestamp?.toMillis ? data.timestamp.toMillis() : (data.timestamp || Date.now())
        } as AuditLog;
      });
    } catch (error) {
      console.warn("Firestore getAuditLogs failed, falling back to REST API:", error);
      try {
        const res = await fetch('/api/logs');
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {}
      return [];
    }
  },

  subscribeToAuditLogs: (callback: (logs: AuditLog[]) => void) => {
    let unsubscribe: (() => void) | null = null;
    let fallbackInterval: any = null;
    let isFallbackActive = false;

    try {
      const q = query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'), limitToLast(100));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const logs = snapshot.docs.map(doc => {
          const data = doc.data() as any;
          return { 
            id: doc.id, 
            ...data,
            timestamp: data.timestamp?.toMillis ? data.timestamp.toMillis() : (data.timestamp || Date.now())
          } as AuditLog;
        });
        callback(logs);
      }, (error) => {
        console.warn("Firestore audit logs subscription failed, falling back to local polling:", error);
        if (unsubscribe) {
          try { unsubscribe(); } catch(e) {}
          unsubscribe = null;
        }
        activatePolling();
      });
    } catch (err) {
      console.warn("Firestore audit logs subscription setup failed, falling back to local polling:", err);
      activatePolling();
    }

    async function activatePolling() {
      if (isFallbackActive) return;
      isFallbackActive = true;
      const poll = async () => {
        try {
          const res = await fetch('/api/logs');
          if (res.ok) {
            const data = await res.json();
            callback(data);
          }
        } catch (e) {
          console.error("Polling audit logs error:", e);
        }
      };
      await poll();
      fallbackInterval = setInterval(poll, 4000);
    }

    return () => {
      if (unsubscribe) {
        try { unsubscribe(); } catch(e) {}
      }
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
      }
    };
  }
};
