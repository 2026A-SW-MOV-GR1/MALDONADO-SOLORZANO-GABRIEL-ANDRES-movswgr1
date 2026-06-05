export type SecretStorage =
  | "shared-preferences"
  | "datastore"
  | "encrypted-sharedpref";

export interface Secret {
  key: string;
  storage: SecretStorage;
  timestamp: number;
}

export interface SecretResponse {
  success: boolean;
  value?: string;
  error?: string;
  storage?: SecretStorage;
}

export const STORAGE_OPTIONS: { label: string; value: SecretStorage }[] = [
  { label: "Shared Preferences", value: "shared-preferences" },
  { label: "Jetpack DataStore", value: "datastore" },
  { label: "Encrypted SharedPref", value: "encrypted-sharedpref" },
];
