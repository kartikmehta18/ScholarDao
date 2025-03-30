
import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Scholarship, DAOContextType } from '@/types/dao';
import { fetchScholarshipsData } from '@/utils/dao-utils';
import { useScholarshipActions } from '@/hooks/use-scholarship-actions';

const DAOContext = createContext<DAOContextType>({
  scholarships: [],
  createScholarship: async () => {},
  pendingScholarships: [],
  loading: false,
  approveScholarship: async () => {},
  fundScholarship: async () => {},
});

export const useDAO = () => useContext(DAOContext);

export const DAOProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(0);

  const fetchScholarships = async () => {
    // Don't refresh too frequently
    const now = Date.now();
    if (now - lastRefresh < 5000 && scholarships.length > 0) {
      return;
    }
    
    setLoading(true);
    try {
      const transformedScholarships = await fetchScholarshipsData();
      setScholarships(transformedScholarships);
      setLastRefresh(now);
      
      // Reset error state if successful
      if (hasError) {
        setHasError(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setHasError(true);
      
      if (!scholarships.length) {
        // Only show toast when we have no data to display
        toast({
          title: "Connection issue",
          description: "Using demo data for now. Connect your wallet to continue.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
    
    // Set up a refresh interval (every 30 seconds instead of 10 to reduce API calls)
    const intervalId = setInterval(() => {
      if (!hasError) {
        fetchScholarships();
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [hasError]);

  // Import the scholarship actions from the hook
  const { 
    createScholarship: createScholarshipAction, 
    approveScholarship: approveScholarshipAction,
    fundScholarship: fundScholarshipAction,
    loading: actionsLoading 
  } = useScholarshipActions(scholarships, fetchScholarships);

  // Wrap the imported actions
  const createScholarship = async (
    title: string,
    description: string,
    amount: number,
    deadline: number
  ) => {
    await createScholarshipAction(title, description, amount, deadline);
  };

  const approveScholarship = async (id: string, recipientAddress: string) => {
    await approveScholarshipAction(id, recipientAddress);
  };

  const fundScholarship = async (id: string, applicationId: string) => {
    await fundScholarshipAction(id, applicationId);
  };

  const pendingScholarships = scholarships.filter(
    (s) => s.status === 'pending' && s.deadline > Date.now()
  );

  // Use the combined loading state
  const isLoading = loading || actionsLoading;

  return (
    <DAOContext.Provider
      value={{
        scholarships,
        createScholarship,
        pendingScholarships,
        loading: isLoading,
        approveScholarship,
        fundScholarship,
      }}
    >
      {children}
    </DAOContext.Provider>
  );
};
