
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { User, Lock, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { OCAuthSandbox, OCAuthLive } from '@opencampus/ocid-connect-js';

// Initialize the auth SDK based on environment
const getAuthSdk = () => {
  const opts = {
    redirectUri: "https://acehack-scholardao.vercel.app/", // Redirect back to our app
    // redirectUri: window.location.origin, // Redirect back to our app
    referralCode: 'SCHOLARDAO', // Unique identifier for our app
  };

  // Use sandbox mode for development and testing
  // In production, you would use OCAuthLive with a valid client ID
  return new OCAuthSandbox(opts);
  
  // When you have a valid client ID for production, uncomment this:
  /*
  if (process.env.NODE_ENV === 'production') {
    return new OCAuthLive({
      ...opts,
      clientId: 'YOUR_VALID_CLIENT_ID_HERE', // Replace with your actual client ID
    });
  } else {
    return new OCAuthSandbox(opts);
  }
  */
};

export function ConnectOCID() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [ocidConnected, setOcidConnected] = useState(false);
  const [ocidProfile, setOcidProfile] = useState(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      // Check if we're returning from an OCID authentication flow
      if (window.location.search.includes('code=')) {
        setIsConnecting(true);
        try {
          const authSdk = getAuthSdk();
          const authState = await authSdk.handleLoginRedirect();

          if (authState && authState.idToken) {
            const profile = {
              name: authState.profile?.name,
              email: authState.profile?.email,
              picture: authState.profile?.picture,
              preferred_username: authState.profile?.preferred_username,
              ocid: authState.OCId, // From SDK documentation
              eth_address: authState.ethAddress // From SDK documentation
            };

            setOcidProfile(profile);
            setOcidConnected(true);

            // Store OCID in localStorage for persistence
            localStorage.setItem('ocid_profile', JSON.stringify(profile));

            toast({
              title: "OCID Connected",
              description: `Welcome, ${profile.name || 'User'}!`,
            });
          }
        } catch (error) {
          console.error('OCID connection error:', error);
          toast({
            title: "Connection Failed",
            description: "Could not connect to Open Campus ID",
            variant: "destructive",
          });
        } finally {
          setIsConnecting(false);

          // Clean up the URL params
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    // Check for stored profile
    const storedProfile = localStorage.getItem('ocid_profile');
    if (storedProfile) {
      try {
        setOcidProfile(JSON.parse(storedProfile));
        setOcidConnected(true);
      } catch (e) {
        localStorage.removeItem('ocid_profile');
      }
    }

    checkAuth();
  }, [toast]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const authSdk = getAuthSdk();

      // Pass state parameter as documented
      await authSdk.signInWithRedirect({
        state: 'opencampus',
      });
    } catch (error) {
      console.error('Failed to initiate OCID login:', error);
      setIsConnecting(false);
      toast({
        title: "Connection Failed",
        description: "Could not connect to Open Campus ID",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      const authSdk = getAuthSdk();
      await authSdk.logout({ returnTo: window.location.origin });
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('ocid_profile');
    setOcidConnected(false);
    setOcidProfile(null);
    setShowProfileDialog(false);
    toast({
      title: "OCID Disconnected",
      description: "Your Open Campus ID has been disconnected",
    });
  };

  const handleShowProfile = () => {
    setShowProfileDialog(true);
  };

  if (ocidConnected && ocidProfile) {
    return (
      <>
        <Button 
          variant="outline" 
          onClick={handleShowProfile}
          className="bg-amber-50 text-green-700 border-green-300 hover:bg-green-100"
        >
          <User className="mr-2 h-4 w-4" />
          <span>
            {ocidProfile.name || ocidProfile.preferred_username || 'OCID Connected'}
          </span>
        </Button>

        <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>OCID Profile</DialogTitle>
              <DialogDescription>
                Your Open Campus ID profile information
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {ocidProfile.picture && (
                <div className="flex justify-center mb-4">
                  <img 
                    src={ocidProfile.picture} 
                    alt="Profile" 
                    className="rounded-full w-20 h-20 object-cover border-2 border-green-300"
                  />
                </div>
              )}

              <div className="space-y-2">
                {/* <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-500">Name:</span>
                  <span className="font-semibold">{ocidProfile.name || 'Not provided'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-500">Email:</span>
                  <span className="font-semibold">{ocidProfile.email || 'Not provided'}</span>
                </div> */}

                {ocidProfile.ocid && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-500">OCID:</span>
                    <span className="font-semibold">{ocidProfile.ocid}</span>
                  </div>
                )}

                {ocidProfile.eth_address && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-500">ETH Address:</span>
                    <span className="font-semibold text-sm">{ocidProfile.eth_address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                variant="destructive" 
                onClick={handleDisconnect}
              >
                Disconnect OCID
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Button 
      onClick={handleConnect} 
      disabled={isConnecting}
      className="bg-[#141BEB] hover:bg-black text-white"
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          {/* <Lock className="mr-2 h-4 w-4" /> */}
          <img src="/edu.png" className="mr-2 h-6 w-6" alt="OCID Logo" />
          Connect with OCID
        </>
      )}
    </Button>
  );
}
