
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { AnonAadhaarProvider as AnonAadhaarReactProvider, useAnonAadhaar, type AnonAadhaarProof } from '@anon-aadhaar/react';

const NULLIFIER_SEED = 123456789; // Replace with crypto-secure value in production

type AnonAadhaarContextType = {
  anonAadhaar: ReturnType<typeof useAnonAadhaar>[0];
  isVerified: boolean;
  userDetails: {
    isAbove18?: boolean;
    state?: string;
    pinCode?: string;
    gender?: string;
  } | null;
};

const AnonAadhaarContext = createContext<AnonAadhaarContextType>({
  anonAadhaar: { status: 'logged-out' },
  isVerified: false,
  userDetails: null,
});

export const useAnonAadhaarContext = () => useContext(AnonAadhaarContext);

export const AnonAadhaarProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AnonAadhaarReactProvider _useTestAadhaar={true}>
      <AnonAadhaarContent>{children}</AnonAadhaarContent>
    </AnonAadhaarReactProvider>
  );
};

const AnonAadhaarContent = ({ children }: { children: ReactNode }) => {
  const [anonAadhaar] = useAnonAadhaar();
  const [isVerified, setIsVerified] = useState(false);
  const [userDetails, setUserDetails] = useState<AnonAadhaarContextType['userDetails']>(null);

  useEffect(() => {
    console.log("Anon Aadhaar status:", anonAadhaar.status);
    
    if (anonAadhaar.status === 'logged-in') {
      setIsVerified(true);
      
      if (anonAadhaar.proof) {
        const proof = anonAadhaar.proof as AnonAadhaarProof;
        setUserDetails({
          isAbove18: proof.ageAbove18 === "1",
          state: proof.state || undefined,
          pinCode: proof.pinCode || undefined,
          gender: proof.gender || undefined,
        });
      }
    } else {
      setIsVerified(false);
      setUserDetails(null);
    }
  }, [anonAadhaar]);

  return (
    <AnonAadhaarContext.Provider
      value={{
        anonAadhaar,
        isVerified,
        userDetails,
      }}
    >
      {children}
    </AnonAadhaarContext.Provider>
  );
};
