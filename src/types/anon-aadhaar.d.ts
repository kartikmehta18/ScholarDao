
declare module '@anon-aadhaar/react' {
  import { ReactNode } from 'react';
  
  export type AnonAadhaarProof = {
    ageAbove18?: string;
    state?: string;
    pinCode?: string;
    gender?: string;
    [key: string]: any;
  };
  
  export type AnonAadhaarStatus = 'logged-out' | 'logging-in' | 'logged-in';
  
  export type AnonAadhaarResult = {
    status: AnonAadhaarStatus;
    proof?: AnonAadhaarProof;
  };
  
  export type FieldKey = 'revealAgeAbove18' | 'revealState' | 'revealPinCode' | 'revealGender';
  
  export function useAnonAadhaar(): [AnonAadhaarResult];
  
  export interface LogInWithAnonAadhaarProps {
    nullifierSeed: number;
    fieldsToReveal?: FieldKey[];
    signal?: string;
  }
  
  export function LogInWithAnonAadhaar(props: LogInWithAnonAadhaarProps): JSX.Element;
  
  export interface AnonAadhaarProviderProps {
    children: ReactNode;
    _useTestAadhaar?: boolean;
    _fetchArtifactsFromServer?: boolean;
    _artifactslinks?: {
      zkey_url: string;
      vkey_url: string;
      wasm_url: string;
    };
  }
  
  export function AnonAadhaarProvider(props: AnonAadhaarProviderProps): JSX.Element;
}
