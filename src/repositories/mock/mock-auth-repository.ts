import type { AuthRepository, AuthSession } from "@/repositories/interfaces";
import type { Profile } from "@/types";
import { mockProfile, mockUser } from "@/lib/constants/mock-data";

const SESSION_KEY = "habitsmith.session";

let inMemorySession: AuthSession | null = null;

function makeSession(): AuthSession {
  return { token: "mock-token", user: mockUser };
}

export class MockAuthRepository implements AuthRepository {
  async login(_email: string, _password: string): Promise<AuthSession> {
    const session = makeSession();
    inMemorySession = session;
    await this.updateSession(session);
    return session;
  }

  async signup(_email: string, _password: string): Promise<AuthSession> {
    const session = makeSession();
    inMemorySession = session;
    await this.updateSession(session);
    return session;
  }

  async logout(): Promise<void> {
    inMemorySession = null;
    await this.updateSession(null);
  }

  async forgotPassword(_email: string): Promise<void> {
    return Promise.resolve();
  }

  async getSession(): Promise<AuthSession | null> {
    if (typeof window === "undefined") return inMemorySession;

    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      return null;
    }
  }

  async updateSession(session: AuthSession | null): Promise<void> {
    if (typeof window === "undefined") return;

    if (!session) {
      window.localStorage.removeItem(SESSION_KEY);
      return;
    }

    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  async completeOnboarding(_userId: string, updates: Partial<Profile>): Promise<void> {
    mockProfile.onboardingComplete = true;
    Object.assign(mockProfile, updates);
  }
}
