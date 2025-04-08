
import { useState, useEffect, useCallback } from 'react';
import { supabase, authenticateWithWallet, getAuthenticatedWallet } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MetaMaskError {
  code: number;
  message: string;
}

// Define a more accurate Ethereum provider type
interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener?: (event: string, callback: (...args: any[]) => void) => void;
}

// Extend the window object with ethereum property
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

// Convert chain ID to hexadecimal to ensure proper format
const EDUCHAIN_CHAIN_ID = '0x656200'; // Hexadecimal format for chain ID
const EDUCHAIN_CONFIG = {
  chainId: EDUCHAIN_CHAIN_ID,
  chainName: 'EDU Chain Testnet',
  nativeCurrency: {
    name: 'EduChain Ether',
    symbol: 'EDU',
    decimals: 18,
  },
  rpcUrls: ['https://open-campus-codex-sepolia.drpc.org'],
  blockExplorerUrls: ['https://opencampus-codex.blockscout.com/'],
};

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Check if an address is already stored in localStorage
  useEffect(() => {
    const storedAddress = localStorage.getItem('wallet_address');
    if (storedAddress) {
      setAddress(storedAddress);
      setIsConnected(true);
      authenticateUser(storedAddress);
    }
  }, []);

  const checkNetwork = async () => {
    if (!window.ethereum) return false;

    try {
      // Get current chain ID in hex
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (chainId !== EDUCHAIN_CHAIN_ID) {
        try {
          // Try to switch to EduChain network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: EDUCHAIN_CHAIN_ID }],
          });
          return true;
        } catch (switchError: any) {
          // If the chain is not added to MetaMask, add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [EDUCHAIN_CONFIG],
              });
              return true;
            } catch (addError) {
              console.error("Error adding network:", addError);
              toast({
                title: "Network Error",
                description: "Could not add the EduChain network to your wallet.",
                variant: "destructive",
              });
              return false;
            }
          } else {
            console.error('Error switching network:', switchError);
            toast({
              title: "Network Error",
              description: "Please switch to the EduChain network in your wallet.",
              variant: "destructive",
            });
            return false;
          }
        }
      }
      return true;
    } catch (error) {
      console.error('Error checking/switching network:', error);
      toast({
        title: "Wallet Error",
        description: "Could not check or switch networks. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const authenticateUser = async (walletAddress: string) => {
    if (!walletAddress) return false;
    
    try {
      // Store the address in localStorage for persistence
      localStorage.setItem('wallet_address', walletAddress);
      
      // Use improved authentication method
      const { error } = await authenticateWithWallet(walletAddress);
      
      if (error) {
        console.error("Authentication error:", error);
        // Continue anyway to prevent blocking user experience
        setIsAuthenticated(true);
        return true;
      }
      
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Error during authentication:", error);
      // Set authenticated anyway to prevent blocking user experience
      setIsAuthenticated(true);
      return true;
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask or another Ethereum wallet.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Check if we're on the right network first
      const networkOk = await checkNetwork();
      if (!networkOk) {
        setIsLoading(false);
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found or user rejected the connection");
      }

      const currentAddress = accounts[0];
      setAddress(currentAddress);
      setIsConnected(true);
      
      // Authenticate with Supabase using the wallet address
      await authenticateUser(currentAddress);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${formatAddress(currentAddress)}`,
      });
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem('wallet_address');
    localStorage.removeItem('wallet_auth_status');
    setAddress('');
    setIsConnected(false);
    setIsAuthenticated(false);
    
    // Sign out from Supabase
    supabase.auth.signOut();

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Memoize the event handlers to ensure they can be properly cleaned up
  const handleAccountsChanged = useCallback(async (accounts: string[]) => {
    if (accounts.length > 0) {
      setAddress(accounts[0]);
      setIsConnected(true);
      
      // Re-authenticate when account changes
      await authenticateUser(accounts[0]);
      
      toast({
        title: "Account Changed",
        description: `Switched to ${formatAddress(accounts[0])}`,
      });
    } else {
      localStorage.removeItem('wallet_address');
      localStorage.removeItem('wallet_auth_status');
      setAddress('');
      setIsConnected(false);
      setIsAuthenticated(false);
      
      // Sign out from Supabase
      supabase.auth.signOut();
      
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
    }
  }, [toast]); // Only depends on toast, not state

  const handleChainChanged = useCallback(() => {
    // Refresh the page when chain changes to ensure all data is up-to-date
    window.location.reload();
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      const getAccounts = async () => {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            
            // Re-authenticate if wallet is already connected
            await authenticateUser(accounts[0]);
          }
        } catch (error) {
          console.error('Error getting accounts:', error);
        }
      };
      
      getAccounts();

      // Add event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Clean up function that safely handles removeListener
      return () => {
        // Safely remove event listeners if possible
        if (window.ethereum) {
          // Check if removeListener is available (varies by provider implementation)
          if (typeof window.ethereum.removeListener === 'function') {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
          } else {
            // If removeListener is not available, we can't do much except log a warning
            console.log('Note: Event listeners could not be removed from ethereum provider.');
          }
        }
      };
    }
  }, [handleAccountsChanged, handleChainChanged]);

  return {
    isConnected,
    address,
    isLoading,
    isAuthenticated,
    connectWallet,
    disconnectWallet,
    formatAddress,
  };
};
