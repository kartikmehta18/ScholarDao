
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useDAO } from "@/contexts/DAOContext";
import { Scholarship } from "@/types/dao";
import { Award, Check, Users, FileText } from "lucide-react";
import { getSupabaseClient } from "@/integrations/supabase/client";

export function GovernmentDashboard() {
  const { scholarships, approveScholarship, loading } = useDAO();
  const [selectedScholarship, setSelectedScholarship] = useState<string | null>(null);
  const [applicationsData, setApplicationsData] = useState<any[]>([]);

  // Filter scholarships that are pending and have applicants
  const pendingScholarships = scholarships.filter(
    (s) => s.status === 'pending' && s.applicants.length > 0
  );

  const handleViewApplicants = async (scholarshipId: string) => {
    if (selectedScholarship === scholarshipId) {
      setSelectedScholarship(null);
      setApplicationsData([]);
      return;
    }

    try {
      const client = getSupabaseClient();
      // Fetch applications for this scholarship
      const { data, error } = await client
        .from('applications')
        .select('*')
        .eq('scholarship_id', scholarshipId)
        .eq('status', 'pending');

      if (error) throw error;

      setApplicationsData(data || []);
      setSelectedScholarship(scholarshipId);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleApprove = (scholarship: Scholarship, applicantAddress: string) => {
    approveScholarship(scholarship.id, applicantAddress);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <Award className="h-5 w-5 text-edu-primary" />
            Government Officer Dashboard
          </CardTitle>
          <CardDescription>
            Review and approve scholarship applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-edu-light rounded-md p-3">
              <p className="text-xs text-edu-dark/60">Pending Applications</p>
              <p className="text-xl font-bold text-edu-primary">{pendingScholarships.length}</p>
            </div>
            <div className="bg-edu-light rounded-md p-3">
              <p className="text-xs text-edu-dark/60">Total Scholarships</p>
              <p className="text-xl font-bold text-edu-primary">{scholarships.length}</p>
            </div>
            <div className="bg-edu-light rounded-md p-3">
              <p className="text-xs text-edu-dark/60">Approved</p>
              <p className="text-xl font-bold text-edu-primary">
                {scholarships.filter(s => s.status === 'approved' || s.status === 'completed').length}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-edu-primary" />
            Pending Applications
          </h3>

          {pendingScholarships.length === 0 ? (
            <div className="bg-gray-50 rounded-md p-6 text-center text-gray-500">
              No pending applications to review
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scholarship</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Applicants</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingScholarships.map((scholarship) => (
                    <TableRow key={scholarship.id}>
                      <TableCell className="font-medium">{scholarship.title}</TableCell>
                      <TableCell>{scholarship.amount} EDU</TableCell>
                      <TableCell>{scholarship.applicants.length}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewApplicants(scholarship.id)}
                        >
                          {selectedScholarship === scholarship.id ? "Hide Applicants" : "View Applicants"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {selectedScholarship && (
            <div className="mt-6 border rounded-md p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Applicants
              </h4>
              
              {applicationsData.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No pending applicants found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Address</TableHead>
                        <TableHead>Application Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applicationsData.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-mono text-sm">{application.applicant_address}</TableCell>
                          <TableCell>{new Date(application.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              className="bg-edu-accent hover:bg-edu-accent/90"
                              onClick={() => handleApprove(
                                scholarships.find(s => s.id === selectedScholarship)!,
                                application.applicant_address
                              )}
                              disabled={loading}
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
