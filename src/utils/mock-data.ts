
import { Scholarship, ScholarshipStatus } from '@/types/dao';

// Mock data to use when Supabase connection fails
export const MOCK_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'mock-1',
    title: 'Computer Science Scholarship',
    description: 'For students pursuing a degree in computer science',
    amount: 0.5,
    creator_address: '0x388C818CA8B9251b393131C08a736A67ccB19297',
    recipient: null,
    status: 'pending' as ScholarshipStatus,
    votes: { for: 5, against: 1 },
    created_at: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,  // 30 days from now
    voters: [],
    applicants: [],
  },
  {
    id: 'mock-2',
    title: 'Engineering Excellence',
    description: 'Supporting future engineers in their academic journey',
    amount: 0.75,
    creator_address: '0x388C818CA8B9251b393131C08a736A67ccB19297',
    recipient: '0x388175a170a0d8fcb99ff8867c00860fcf95a7cc',
    status: 'approved' as ScholarshipStatus,
    votes: { for: 8, against: 2 },
    created_at: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
    deadline: Date.now() + 15 * 24 * 60 * 60 * 1000,  // 15 days from now
    voters: [],
    applicants: ['0x388175a170a0d8fcb99ff8867c00860fcf95a7cc'],
  },
  {
    id: 'mock-3',
    title: 'Blockchain Development',
    description: 'For students interested in blockchain technology',
    amount: 1.0,
    creator_address: '0x388C818CA8B9251b393131C08a736A67ccB19297',
    recipient: '0x388175a170a0d8fcb99ff8867c00860fcf95a7cc',
    status: 'completed' as ScholarshipStatus,
    votes: { for: 10, against: 0 },
    created_at: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
    deadline: Date.now() - 15 * 24 * 60 * 60 * 1000,  // 15 days ago
    voters: [],
    applicants: ['0x388175a170a0d8fcb99ff8867c00860fcf95a7cc'],
  }
];
