
import { useState } from 'react';
import { LogInWithAnonAadhaar, type FieldKey } from "@anon-aadhaar/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnonAadhaarContext } from '@/contexts/AnonAadhaarContext';
import { Shield, Info, Check } from 'lucide-react';

// A secure nullifier seed should be generated server-side in production
const NULLIFIER_SEED = 123456789;

export function AnonAadhaarLogin() {
  const { anonAadhaar, isVerified, userDetails } = useAnonAadhaarContext();
  const [showInfo, setShowInfo] = useState(false);

  const fieldsToReveal: FieldKey[] = ["revealAgeAbove18", "revealState", "revealPinCode"];

  if (isVerified) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Aadhaar Verified
          </CardTitle>
          <CardDescription>Your identity has been anonymously verified</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 flex items-start gap-2">
            <Check className="h-5 w-5 mt-0.5" />
            <div>
              <p className="font-medium">Verification successful</p>
              <p className="mt-1 text-green-600">
                Your identity has been verified while keeping your personal information private.
              </p>
              {userDetails && (
                <div className="mt-2 border-t border-green-200 pt-2">
                  <p>Shared Details:</p>
                  <ul className="list-disc list-inside mt-1">
                    {userDetails.isAbove18 !== undefined && (
                      <li>Age: {userDetails.isAbove18 ? 'Above 18' : 'Below 18'}</li>
                    )}
                    {userDetails.state && <li>State: {userDetails.state}</li>}
                    {userDetails.pinCode && <li>PIN Code: {userDetails.pinCode}</li>}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Verify with Aadhaar
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto h-8 w-8 p-0" 
            onClick={() => setShowInfo(!showInfo)}
          >
            <Info className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription>
          Verify your identity anonymously using Anon Aadhaar
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showInfo && (
          <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
            <p className="font-medium">What is Anon Aadhaar?</p>
            <p className="mt-1">
              Anon Aadhaar allows you to prove you have a valid Aadhaar card without revealing your personal information.
              It uses zero-knowledge proofs to verify your identity while maintaining your privacy.
            </p>
          </div>
        )}
        
        <div className="flex justify-center py-3">
          <LogInWithAnonAadhaar
            nullifierSeed={NULLIFIER_SEED}
            fieldsToReveal={fieldsToReveal}
          />
        </div>
        
        <div className="text-sm text-gray-500 mt-2">
          <p>Status: {anonAadhaar?.status}</p>
        </div>
      </CardContent>
    </Card>
  );
}
