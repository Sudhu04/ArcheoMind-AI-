export type UserRole = 'viewer' | 'researcher' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  joinedAt: number;
  profileImage?: string;
  isHeadAdmin?: boolean;
  isVerified?: boolean;
  bio?: string;
  specialization?: string;
  affiliation?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  researchInterests?: string[];
  theme?: 'light' | 'dark';
  xp?: number;
  level?: number;
  badges?: {
    id: string;
    name: string;
    icon: string;
    earnedAt: number;
  }[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  text: string;
  timestamp: number;
  likes: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

export interface Exhibit {
  id: string;
  name: string;
  description: string;
  artifactIds: string[];
  createdBy: string;
  creatorName: string;
  timestamp: number;
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  targetId: string;
  targetName: string;
  timestamp: number;
}

export interface ResearchLab {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
  leadId: string;
  status: 'active' | 'archived';
  artifactCount: number;
}

export interface Artifact {
  id: string;
  userId: string; // Track who found it
  userName: string;
  name: string;
  type: string;
  rarityLevel: number;
  description: string;
  historicalContext: string;
  estimatedEra: string;
  civilization: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  region?: {
    continent: string;
    country: string;
    state?: string;
  };
  imageUrl: string;
  extraImages?: string[];
  timestamp: number;
  tags: string[];
  confidenceScore: number;
  reconstructionPrompt?: string;
  materialAnalysis?: string;
  culturalSignificance?: string;
  historicalUsage?: string;
  socialStructureInference?: string;
  stratigraphicContext?: {
    layer: string;
    environment: string;
    preservationState: string;
  };
  isVerified?: boolean; // Admin privilege
  embedding?: number[]; // Neural signature for visual search
  stratigraphy?: {
    depth: number; // meters
    layer: string;
    description: string;
  };
  provenanceChain?: {
    id: string;
    step: string;
    actor: string;
    timestamp: number;
    hash: string;
  }[];
  verificationLog?: {
    adminId: string;
    adminName: string;
    comment: string;
    timestamp: number;
    status: 'pending' | 'verified' | 'disputed';
  }[];
  neuralAnnotations?: {
    ocrTranscription?: string;
    provenancePrediction?: string;
    restorationDescription?: string;
  };
  mediaResources?: {
    type: 'audio' | 'video' | 'lidar';
    url: string;
    description: string;
  }[];
  comments?: Comment[];
  history?: {
    id: string;
    action: string;
    actor: string;
    timestamp: number;
    description: string;
  }[];
  aiInsights?: string;
}

export interface ResearchAlert {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  type: 'discovery' | 'update' | 'alert';
}

export interface NeuralLog {
  id: string;
  userId: string;
  action: string;
  details: any;
  timestamp: number;
}
