export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  password?: string;
  role: UserRole;
  name: string;
  joinedAt: number;
  isHeadAdmin?: boolean;
  phoneNumber?: string;
  profileImage?: string;
}

export interface Artifact {
  id: string;
  userId: string; // Track who found it
  userName: string;
  name: string;
  description: string;
  historicalContext: string;
  estimatedEra: string;
  civilization: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  imageUrl: string;
  extraImages?: string[];
  timestamp: number;
  tags: string[];
  confidenceScore: number;
  reconstructionPrompt?: string;
  materialAnalysis?: string;
  culturalSignificance?: string;
  isVerified?: boolean; // Admin privilege
}

export interface ResearchAlert {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  type: 'discovery' | 'update' | 'alert';
}
