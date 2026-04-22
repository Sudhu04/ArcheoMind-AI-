import { Artifact } from '../types';

const STORAGE_KEY = 'archeomind_artifacts';

export const storage = {
  getArtifacts: async (): Promise<Artifact[]> => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveArtifact: async (artifact: Artifact) => {
    const all = await storage.getArtifacts();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...all, artifact]));
  },
  deleteArtifact: async (id: string) => {
    const all = await storage.getArtifacts();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all.filter(a => a.id !== id)));
  },
  verifyArtifact: async (id: string) => {
    const all = await storage.getArtifacts();
    const updated = all.map(a => a.id === id ? { ...a, isVerified: true } : a);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};
