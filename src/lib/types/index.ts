export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
}

export interface SSOApp {
  id: string;
  name: string;
  url: string;
  icon: string;
  status: 'active' | 'inactive';
  lastUsed?: Date;
  provider: 'google' | 'github' | 'microsoft' | 'custom';
  clientId?: string;
  clientSecret?: string;
  createdAt: Date;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  twoFactorEnabled: boolean;
}
