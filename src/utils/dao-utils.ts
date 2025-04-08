
import { Scholarship, ScholarshipStatus } from '@/types/dao';
import { getSupabaseClient } from '@/integrations/supabase/client';
import { MOCK_SCHOLARSHIPS } from './mock-data';
import { executeQuery, executeInsert, executeUpdate } from './supabase-client';

export const fetchScholarshipsData = async (): Promise<Scholarship[]> => {
  try {
    console.log("Fetching scholarships data...");
    const client = getSupabaseClient();
    
    // Fetch scholarships
    let scholarshipsData;
    try {
      const { data, error } = await executeQuery(client, 'scholarships');
      
      if (error) {
        console.error("Error fetching scholarships:", error);
        return MOCK_SCHOLARSHIPS;
      }
      scholarshipsData = data;
    } catch (error) {
      console.error("Error in Supabase call:", error);
      return MOCK_SCHOLARSHIPS;
    }
    
    // If no data returned, use mock data
    if (!scholarshipsData || scholarshipsData.length === 0) {
      console.log("No scholarships found, using mock data");
      return MOCK_SCHOLARSHIPS;
    }

    // Fetch applications
    let applicationsData = [];
    try {
      const { data, error } = await executeQuery(client, 'applications');
      
      if (error) {
        console.error("Error fetching applications:", error);
      } else {
        applicationsData = data || [];
      }
    } catch (error) {
      console.error("Error in Supabase applications call:", error);
    }
    
    // Fetch votes
    let votesData = [];
    try {
      const { data, error } = await executeQuery(client, 'votes');
      
      if (error) {
        console.error("Error fetching votes:", error);
      } else {
        votesData = data || [];
      }
    } catch (error) {
      console.error("Error in Supabase votes call:", error);
    }

    const transformedScholarships: Scholarship[] = scholarshipsData.map((scholarship: any) => {
      const scholarshipApplications = applicationsData.filter(
        (app: any) => app.scholarship_id === scholarship.id
      );
      
      const scholarshipVotes = votesData.filter(
        (vote: any) => vote.scholarship_id === scholarship.id
      );
      
      const applicants = scholarshipApplications.map((app: any) => app.applicant_address);
      const voters = scholarshipVotes.map((vote: any) => vote.voter_address);
      
      const votesFor = scholarshipVotes.filter((vote: any) => vote.vote_type).length;
      const votesAgainst = scholarshipVotes.filter((vote: any) => !vote.vote_type).length;

      return {
        id: scholarship.id,
        title: scholarship.title,
        description: scholarship.description,
        amount: Number(scholarship.amount),
        creator_address: scholarship.creator_address,
        recipient: scholarshipApplications.find((app: any) => app.status === 'approved')?.applicant_address,
        status: scholarship.status as ScholarshipStatus,
        votes: {
          for: votesFor,
          against: votesAgainst,
        },
        created_at: new Date(scholarship.created_at).getTime(),
        deadline: new Date(scholarship.deadline).getTime(),
        voters,
        applicants,
      };
    });

    return transformedScholarships;
  } catch (e) {
    console.error("Error in fetchScholarshipsData:", e);
    return MOCK_SCHOLARSHIPS; // Return mock data on any error
  }
};

// Helper function to safely fetch applications
export const fetchUserApplications = async (address: string): Promise<any[]> => {
  if (!address) return [];
  
  try {
    const client = getSupabaseClient();
    
    try {
      const { data, error } = await executeQuery(client, 'applications');
      
      if (error) {
        console.error("Error fetching applications:", error);
        return [];
      }
      
      // Filter applications by applicant address
      return (data || []).filter((app: any) => app.applicant_address === address);
    } catch (error) {
      console.error("Error in Supabase call:", error);
      return [];
    }
  } catch (error) {
    console.error("Error in fetchUserApplications:", error);
    return [];
  }
};

// Helper function to safely apply for scholarship
export const applyForScholarshipSafely = async (scholarshipId: string, address: string): Promise<{ success: boolean; error: string | null; existing?: boolean }> => {
  if (!address || !scholarshipId) {
    return { success: false, error: "Missing required information" };
  }
  
  try {
    const client = getSupabaseClient();
    
    // Fetch all applications
    let existingApps = [];
    try {
      const { data, error } = await executeQuery(client, 'applications');
      
      if (error) {
        console.error("Error checking existing applications:", error);
        // If we can't check, assume no existing application and try to create one
      } else {
        // Filter applications locally
        existingApps = (data || []).filter(
          (app: any) => app.scholarship_id === scholarshipId && app.applicant_address === address
        );
        
        if (existingApps && existingApps.length > 0) {
          return { success: true, error: null, existing: true };
        }
      }
    } catch (error) {
      console.error("Error in Supabase check:", error);
      // Continue to try insert
    }
    
    // Insert new application
    try {
      const { error } = await executeInsert(client, 'applications', {
        scholarship_id: scholarshipId,
        applicant_address: address,
      });
      
      if (error) {
        console.error("Error applying for scholarship:", error);
        return { success: false, error: error.message || "Failed to apply" };
      }
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error in Supabase insert:", error);
      return { success: false, error: error.message };
    }
  } catch (error: any) {
    console.error("Error in applyForScholarshipSafely:", error);
    return { success: false, error: error.message };
  }
};
