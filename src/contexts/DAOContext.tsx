
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
  fetchScholarships: async () => {},
});

export const useDAO = () => useContext(DAOContext);

export const DAOProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(0);

  const fetchScholarships = async () => {
    const now = Date.now();
    // Force refresh when manually called, otherwise respect throttling
    const shouldRefresh = now - lastRefresh >= 5000 || scholarships.length === 0;
    
    if (shouldRefresh) {
      setLoading(true);
      try {
        const transformedScholarships = await fetchScholarshipsData();
        setScholarships(transformedScholarships);
        setLastRefresh(now);
        
       
        if (hasError) {
          setHasError(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setHasError(true);
        
        if (!scholarships.length) {
          
          toast({
            title: "Connection issue",
            description: "Using demo data for now. Connect your wallet to continue.",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchScholarships();
    
    const intervalId = setInterval(() => {
      if (!hasError) {
        fetchScholarships();
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [hasError]);

  const { 
    createScholarship: createScholarshipAction, 
    approveScholarship: approveScholarshipAction,
    fundScholarship: fundScholarshipAction,
    loading: actionsLoading 
  } = useScholarshipActions(scholarships, fetchScholarships);

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
    // Refresh data after funding a scholarship
    await fetchScholarships();
  };

  const pendingScholarships = scholarships.filter(
    (s) => s.status === 'pending' && s.deadline > Date.now()
  );

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
        fetchScholarships,
      }}
    >
      {children}
    </DAOContext.Provider>
  );
};
