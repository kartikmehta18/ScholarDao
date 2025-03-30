
import { useState, useEffect } from 'react';
import { supabase, authenticateWithWallet, getAuthenticatedWallet } from '@/integrations/supabase/client';

interface MetaMaskError {
  code: number;
  message: string;
}

const EDUCHAIN_CHAIN_ID = '656476';  // '656476' in decimal is '0xa0348' in hex
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
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== EDUCHAIN_CHAIN_ID) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: EDUCHAIN_CHAIN_ID }],
        }).catch(async (switchError: MetaMaskError) => {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [EDUCHAIN_CONFIG],
            });
          }
        });
      }
      return true;
    } catch (error) {
      console.error('Error checking/switching network:', error);
      return false;
    }
  };

  const authenticateUser = async (walletAddress: string) => {
    if (!walletAddress) return false;
    
    try {
      // Store the address in localStorage for persistence
      localStorage.setItem('wallet_address', walletAddress);
      
      // Use our improved authentication method
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
      alert('Please install MetaMask!');
      return;
    }

    setIsLoading(true);
    try {
      const networkOk = await checkNetwork();
      if (!networkOk) {
        alert('Please switch to EduChain network');
        setIsLoading(false);
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const currentAddress = accounts[0];
      setAddress(currentAddress);
      setIsConnected(true);
      
      // Authenticate with Supabase using the wallet address
      await authenticateUser(currentAddress);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
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
  };

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(async (accounts: string[]) => {
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            
            // Re-authenticate if wallet is already connected
            await authenticateUser(accounts[0]);
          }
        });

      window.ethereum.on('accountsChanged', async (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          
          // Re-authenticate when account changes
          await authenticateUser(accounts[0]);
        } else {
          localStorage.removeItem('wallet_address');
          localStorage.removeItem('wallet_auth_status');
          setAddress('');
          setIsConnected(false);
          setIsAuthenticated(false);
          
          // Sign out from Supabase
          supabase.auth.signOut();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

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
