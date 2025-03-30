
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole, Scholarship } from '@/types/dao';
import { useState } from 'react';
import { GOVERNMENT_ADDRESS, FINANCIER_ADDRESS } from '@/constants/dao';
import { useWallet } from '@/hooks/use-wallet';

export const useScholarshipActions = (scholarships: Scholarship[], fetchScholarships: () => Promise<void>) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { address, isAuthenticated } = useWallet();

  const userRole: UserRole = !address 
    ? 'regular'
    : address.toLowerCase() === GOVERNMENT_ADDRESS.toLowerCase()
    ? 'government'
    : address.toLowerCase() === FINANCIER_ADDRESS.toLowerCase()
    ? 'financier'
    : 'student';

  const createScholarship = async (
    title: string,
    description: string,
    amount: number,
    deadline: number
  ) => {
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please authenticate with your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (userRole !== 'government') {
      toast({
        title: "Not authorized",
        description: "Only government officers can create scholarships",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scholarships')
        .insert({
          title,
          description,
          amount,
          creator_address: address,
          deadline: new Date(deadline).toISOString(),
        })
        .select();

      if (error) throw error;

      toast({
        title: "Scholarship created",
        description: "Your scholarship proposal has been submitted",
      });

      fetchScholarships();
    } catch (error) {
      console.error("Error creating scholarship:", error);
      toast({
        title: "Error",
        description: "Failed to create scholarship",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const voteOnScholarship = async (id: string, voteFor: boolean) => {
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please authenticate with your wallet first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: existingVote, error: checkError } = await supabase
        .from('votes')
        .select('*')
        .eq('scholarship_id', id)
        .eq('voter_address', address);

      if (checkError) throw checkError;

      if (existingVote && existingVote.length > 0) {
        toast({
          title: "Already voted",
          description: "You have already voted on this scholarship",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('votes')
        .insert({
          scholarship_id: id,
          voter_address: address,
          vote_type: voteFor,
        });

      if (error) throw error;

      const scholarshipToUpdate = scholarships.find(s => s.id === id);
      if (scholarshipToUpdate) {
        const votesFor = voteFor ? scholarshipToUpdate.votes.for + 1 : scholarshipToUpdate.votes.for;
        const votesAgainst = voteFor ? scholarshipToUpdate.votes.against : scholarshipToUpdate.votes.against + 1;

        const { error: updateError } = await supabase
          .from('scholarships')
          .update({
            votes_for: votesFor,
            votes_against: votesAgainst,
          })
          .eq('id', id);

        if (updateError) throw updateError;
      }

      toast({
        title: "Vote submitted",
        description: `You voted ${voteFor ? "for" : "against"} the scholarship`,
      });

      fetchScholarships();
    } catch (error) {
      console.error("Error voting on scholarship:", error);
      toast({
        title: "Error",
        description: "Failed to submit vote",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyForScholarship = async (id: string) => {
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please authenticate with your wallet first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: existingApplication, error: checkError } = await supabase
        .from('applications')
        .select('*')
        .eq('scholarship_id', id)
        .eq('applicant_address', address);

      if (checkError) throw checkError;

      if (existingApplication && existingApplication.length > 0) {
        toast({
          title: "Already applied",
          description: "You have already applied for this scholarship",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('applications')
        .insert({
          scholarship_id: id,
          applicant_address: address,
        });

      if (error) throw error;

      toast({
        title: "Application submitted",
        description: "You have applied for this scholarship",
      });

      fetchScholarships();
    } catch (error) {
      console.error("Error applying for scholarship:", error);
      toast({
        title: "Error",
        description: "Failed to apply for scholarship",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const approveScholarship = async (id: string, recipientAddress: string) => {
    if (!address || address.toLowerCase() !== GOVERNMENT_ADDRESS.toLowerCase()) {
      toast({
        title: "Not authorized",
        description: "Only government officers can approve scholarships",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please authenticate with your wallet first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: applications, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('scholarship_id', id)
        .eq('applicant_address', recipientAddress);

      if (appError) throw appError;

      if (!applications || applications.length === 0) {
        toast({
          title: "Error",
          description: "Application not found",
          variant: "destructive",
        });
        return;
      }

      const { error: updateAppError } = await supabase
        .from('applications')
        .update({ status: 'approved' })
        .eq('id', applications[0].id);

      if (updateAppError) throw updateAppError;

      const { error: updateScholarshipError } = await supabase
        .from('scholarships')
        .update({ status: 'approved' })
        .eq('id', id);

      if (updateScholarshipError) throw updateScholarshipError;

      toast({
        title: "Scholarship approved",
        description: "The scholarship has been approved",
      });

      fetchScholarships();
    } catch (error) {
      console.error("Error approving scholarship:", error);
      toast({
        title: "Error",
        description: "Failed to approve scholarship",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fundScholarship = async (id: string, applicationId: string) => {
    if (!address || address.toLowerCase() !== FINANCIER_ADDRESS.toLowerCase()) {
      toast({
        title: "Not authorized",
        description: "Only financiers can fund scholarships",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please authenticate with your wallet first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: applications, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .eq('status', 'approved');

      if (appError) throw appError;

      if (!applications || applications.length === 0) {
        toast({
          title: "Error",
          description: "Approved application not found",
          variant: "destructive",
        });
        return;
      }

      const { data: scholarshipData, error: scholarshipError } = await supabase
        .from('scholarships')
        .select('*')
        .eq('id', id)
        .eq('status', 'approved');

      if (scholarshipError) throw scholarshipError;

      if (!scholarshipData || scholarshipData.length === 0) {
        toast({
          title: "Error",
          description: "Approved scholarship not found",
          variant: "destructive",
        });
        return;
      }

      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          scholarship_id: id,
          application_id: applicationId,
          financier_address: address,
          recipient_address: applications[0].applicant_address,
          amount: scholarshipData[0].amount,
        });

      if (transactionError) throw transactionError;

      const { error: updateError } = await supabase
        .from('scholarships')
        .update({ status: 'completed' })
        .eq('id', id);

      if (updateError) throw updateError;

      toast({
        title: "Scholarship funded",
        description: "The scholarship has been funded and completed",
      });

      fetchScholarships();
    } catch (error) {
      console.error("Error funding scholarship:", error);
      toast({
        title: "Error",
        description: "Failed to fund scholarship",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    createScholarship,
    voteOnScholarship,
    applyForScholarship,
    approveScholarship,
    fundScholarship,
    loading,
    userRole
  };
};
