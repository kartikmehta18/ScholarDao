
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDAO } from "@/contexts/DAOContext";
import { ScholarshipCard } from "@/components/ScholarshipCard";
import { Button } from "@/components/ui/button";
import { Check, FileText, Award } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/hooks/use-wallet";
import { getSupabaseClient } from "@/integrations/supabase/client";

export function StudentDashboard() {
  const { address } = useWallet();
  const { scholarships, pendingScholarships } = useDAO();
  const [appliedScholarships, setAppliedScholarships] = useState<string[]>([]);
  const [receivedScholarships, setReceivedScholarships] = useState<string[]>([]);
  
  useEffect(() => {
    if (address) {
      fetchApplications();
    }
  }, [address, scholarships]);
  
  const fetchApplications = async () => {
    if (!address) return;
    
    try {
      const client = getSupabaseClient();
      // Fetch all applications by this user
      const { data: applications, error } = await client
        .from('applications')
        .select('*')
        .eq('applicant_address', address);
      
      if (error) throw error;
      
      // Get IDs of scholarships user has applied to
      const appliedIds = applications?.map(app => app.scholarship_id) || [];
      setAppliedScholarships(appliedIds);
      
      // Get IDs of scholarships user has been approved for
      const approvedApps = applications?.filter(app => app.status === 'approved') || [];
      const approvedIds = approvedApps.map(app => app.scholarship_id);
      setReceivedScholarships(approvedIds);
      
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };
  
  // Filter scholarships that user has applied for
  const myAppliedScholarships = scholarships.filter(s => 
    appliedScholarships.includes(s.id)
  );
  
  // Filter scholarships that user has been approved for
  const myReceivedScholarships = scholarships.filter(s => 
    receivedScholarships.includes(s.id)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <Award className="h-5 w-5 text-edu-primary" />
            Student Dashboard
          </CardTitle>
          <CardDescription>
            Apply for scholarships and track your applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-edu-light rounded-md p-3">
              <p className="text-xs text-edu-dark/60">Applied</p>
              <p className="text-xl font-bold text-edu-primary">{myAppliedScholarships.length}</p>
            </div>
            <div className="bg-edu-light rounded-md p-3">
              <p className="text-xs text-edu-dark/60">Received</p>
              <p className="text-xl font-bold text-edu-primary">{myReceivedScholarships.length}</p>
            </div>
            <div className="bg-edu-light rounded-md p-3">
              <p className="text-xs text-edu-dark/60">Total Available</p>
              <p className="text-xl font-bold text-edu-primary">{pendingScholarships.length}</p>
            </div>
          </div>

          <Tabs defaultValue="applications">
            <TabsList className="w-full max-w-md mb-6">
              <TabsTrigger value="applications" className="flex-1">My Applications</TabsTrigger>
              <TabsTrigger value="received" className="flex-1">Received Scholarships</TabsTrigger>
            </TabsList>
            
            <TabsContent value="applications" className="space-y-6">
              {myAppliedScholarships.length === 0 ? (
                <div className="bg-gray-50 rounded-md p-6 text-center text-gray-500">
                  <p>You haven't applied for any scholarships yet</p>
                  <Button 
                    className="mt-4 bg-edu-primary hover:bg-edu-primary/90"
                    size="sm"
                    asChild
                  >
                    <a href="/scholarships">
                      <FileText className="mr-2 h-4 w-4" />
                      Browse Scholarships
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myAppliedScholarships.map(scholarship => (
                    <ScholarshipCard 
                      key={scholarship.id} 
                      scholarship={scholarship}
                      isApplied
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="received" className="space-y-6">
              {myReceivedScholarships.length === 0 ? (
                <div className="bg-gray-50 rounded-md p-6 text-center text-gray-500">
                  <p>You haven't received any scholarships yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myReceivedScholarships.map(scholarship => (
                    <div key={scholarship.id} className="relative">
                      <div className="absolute top-2 right-2 z-10 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="mr-1 h-3 w-3" />
                        {scholarship.status === 'completed' ? 'Funded' : 'Approved'}
                      </div>
                      <ScholarshipCard 
                        scholarship={scholarship}
                        showActions={false}
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
