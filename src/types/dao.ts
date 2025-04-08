
export type ScholarshipStatus = 'pending' | 'approved' | 'rejected' | 'completed';
export type UserRole = 'student' | 'government' | 'financier' | 'regular';

export type Scholarship = {
  id: string;
  title: string;
  description: string;
  amount: number;
  creator_address: string;
  recipient?: string;
  status: ScholarshipStatus;
  votes: {
    for: number;
    against: number;
  };
  created_at: number;
  deadline: number;
  voters: string[];
  applicants: string[];
};

export interface Application {
  id: string;
  scholarship_id: string;
  applicant_address: string;
  status: string;
  created_at?: string;
}

export interface DAOContextType {
  scholarships: Scholarship[];
  createScholarship: (title: string, description: string, amount: number, deadline: number) => Promise<void>;
  pendingScholarships: Scholarship[];
  loading: boolean;
  approveScholarship: (id: string, recipientAddress: string) => Promise<void>;
  fundScholarship: (id: string, applicationId: string) => Promise<void>;
  fetchScholarships: () => Promise<void>;
}
