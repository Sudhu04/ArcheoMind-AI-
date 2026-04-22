import { User, UserRole } from '../types';

const USERS_KEY = 'archeomind_users';
const SESSION_KEY = 'archeomind_session';

export const authService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  isHeadAdmin: (user: User | null): boolean => {
    return user?.email === 'kratosadmin@archeomind.ai' || user?.isHeadAdmin === true;
  },

  signup: async (email: string, name: string, password: string, role: UserRole = 'user'): Promise<User> => {
    const users = authService.getUsers();
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      password,
      role,
      joinedAt: Date.now()
    };
    
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    return newUser;
  },

  login: async (email: string, password: string): Promise<User> => {
    const users = authService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      // Check for default admin
      if (email === 'kratosadmin@archeomind.ai' && password === 'DragonBallSuper@143') {
        const admin: User = {
          id: 'admin-zeno',
          email: 'kratosadmin@archeomind.ai',
          name: 'Zeno',
          role: 'admin',
          joinedAt: Date.now(),
          isHeadAdmin: true
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(admin));
        return admin;
      }
      throw new Error('Invalid credentials');
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  updateUserRole: async (userId: string, role: UserRole): Promise<void> => {
    const users = authService.getUsers();
    const updated = users.map(u => u.id === userId ? { ...u, role } : u);
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
    
    const current = authService.getCurrentUser();
    if (current && current.id === userId) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...current, role }));
    }
  },

  updateUserProfile: async (userId: string, data: Partial<User>): Promise<void> => {
    const users = authService.getUsers();
    const updated = users.map(u => u.id === userId ? { ...u, ...data } : u);
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
    
    const current = authService.getCurrentUser();
    if (current && current.id === userId) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...current, ...data }));
    }
  }
};
