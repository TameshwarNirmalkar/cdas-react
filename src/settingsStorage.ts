export interface UserSettings {
  displayName: string;
  email: string;
  emailNotifications: boolean;
  defaultParallelApproval: boolean;
}

const STORAGE_KEY = 'cdas-user-settings';

export const defaultUserSettings = (): UserSettings => ({
  displayName: '',
  email: '',
  emailNotifications: true,
  defaultParallelApproval: false,
});

export const loadUserSettings = (): UserSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultUserSettings();
    return { ...defaultUserSettings(), ...JSON.parse(raw) };
  } catch {
    return defaultUserSettings();
  }
};

export const saveUserSettings = (settings: UserSettings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};
