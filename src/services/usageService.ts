
export interface UsageSnapshot {
  timestamp: string;
  geminiTokens: number;
  openRouterTokens: number;
  nvidiaTokens: number;
  geminiSpend: number;
  openRouterSpend: number;
  nvidiaSpend: number;
}

export interface ApiUsage {
  gemini: {
    requests: number;
    tokens: number;
    spend: number;
    limit: number;
    maxTokens: number;
    resetTime: string;
  };
  openRouter: {
    requests: number;
    tokens: number;
    spend: number;
    limit: number;
    maxTokens: number;
    resetTime: string;
  };
  nvidia: {
    requests: number;
    tokens: number;
    spend: number;
    limit: number;
    maxTokens: number;
    resetTime: string;
  };
  history: UsageSnapshot[];
}

const STORAGE_KEY = 'archeomind_api_usage';

const INITIAL_USAGE: ApiUsage = {
  gemini: {
    requests: 0,
    tokens: 0,
    spend: 0,
    limit: 1500, // requests per day
    maxTokens: 1000000,
    resetTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
  },
  openRouter: {
    requests: 0,
    tokens: 0,
    spend: 0,
    limit: 1000,
    maxTokens: 500000,
    resetTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
  },
  nvidia: {
    requests: 0,
    tokens: 0,
    spend: 0,
    limit: 2000,
    maxTokens: 800000,
    resetTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
  },
  history: []
};

class UsageService {
  private usage: ApiUsage;
  private listeners: (() => void)[] = [];

  constructor() {
    this.usage = this.loadUsage();
    this.checkReset();
  }

  private loadUsage(): ApiUsage {
    if (typeof window === 'undefined') return JSON.parse(JSON.stringify(INITIAL_USAGE));
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return JSON.parse(JSON.stringify(INITIAL_USAGE));
    try {
      const parsed = JSON.parse(stored);
      // Ensure history exists for older storage
      if (!parsed.history) parsed.history = [];
      if (!parsed.nvidia) {
        parsed.nvidia = { ...INITIAL_USAGE.nvidia };
      }
      return parsed;
    } catch {
      return JSON.parse(JSON.stringify(INITIAL_USAGE));
    }
  }

  private checkReset() {
    const now = new Date();
    const reset = new Date(this.usage.gemini.resetTime);
    if (now > reset) {
      this.usage = { ...JSON.parse(JSON.stringify(INITIAL_USAGE)), history: (this.usage.history || []).slice(-50) }; // Keep some history
      this.save();
    }
  }

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.usage));
    this.listeners.forEach(l => l());
  }

  private addSnapshot() {
    const snapshot: UsageSnapshot = {
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      geminiTokens: this.usage?.gemini?.tokens || 0,
      openRouterTokens: this.usage?.openRouter?.tokens || 0,
      nvidiaTokens: this.usage?.nvidia?.tokens || 0,
      geminiSpend: this.usage?.gemini?.spend || 0,
      openRouterSpend: this.usage?.openRouter?.spend || 0,
      nvidiaSpend: this.usage?.nvidia?.spend || 0
    };
    
    // Copy the history array dynamically to prevent "Cannot add property, object is not extensible" errors
    const historyCopy = [...(this.usage.history || [])];
    historyCopy.push(snapshot);
    if (historyCopy.length > 30) historyCopy.shift(); // Keep last 30 data points
    this.usage.history = historyCopy;
  }

  recordGemini(tokens: number = 500) {
    this.usage = {
      ...this.usage,
      gemini: {
        ...this.usage.gemini,
        requests: (this.usage?.gemini?.requests || 0) + 1,
        tokens: (this.usage?.gemini?.tokens || 0) + tokens,
        spend: (this.usage?.gemini?.spend || 0) + (tokens / 1000) * 0.0001
      }
    };
    this.addSnapshot();
    this.save();
  }

  recordOpenRouter(tokens: number = 800) {
    this.usage = {
      ...this.usage,
      openRouter: {
        ...this.usage.openRouter,
        requests: (this.usage?.openRouter?.requests || 0) + 1,
        tokens: (this.usage?.openRouter?.tokens || 0) + tokens,
        spend: (this.usage?.openRouter?.spend || 0) + (tokens / 1000) * 0.0002
      }
    };
    this.addSnapshot();
    this.save();
  }

  recordNvidia(tokens: number = 600) {
    this.usage = {
      ...this.usage,
      nvidia: {
        ...this.usage.nvidia,
        requests: (this.usage?.nvidia?.requests || 0) + 1,
        tokens: (this.usage?.nvidia?.tokens || 0) + tokens,
        spend: (this.usage?.nvidia?.spend || 0) + (tokens / 1000) * 0.00015
      }
    };
    this.addSnapshot();
    this.save();
  }

  getUsage(): ApiUsage {
    return { ...this.usage };
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

export const usageService = new UsageService();
