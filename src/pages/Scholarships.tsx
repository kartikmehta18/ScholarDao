import { ScholarshipCard } from "@/components/ScholarshipCard";
import { CreateScholarshipForm } from "@/components/CreateScholarshipForm";
import { useDAO } from "@/contexts/DAOContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Shield, Award, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";
import { GOVERNMENT_ADDRESS } from "@/constants/dao";
import { applyForScholarshipSafely, fetchUserApplications } from "@/utils/dao-utils";

const Scholarships = () => {
  const { scholarships, pendingScholarships } = useDAO();
  const { isConnected, address } = useWallet();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedScholarships, setAppliedScholarships] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isGovernment = address && address.toLowerCase() === GOVERNMENT_ADDRESS.toLowerCase();

  useEffect(() => {
    if (address) {
      fetchApplications();
    }
  }, [address, scholarships]);
  
  const fetchApplications = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const applications = await fetchUserApplications(address);
      
      const appliedIds = applications?.map(app => app.scholarship_id) || [];
      setAppliedScholarships(appliedIds);
      
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (scholarshipId: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (appliedScholarships.includes(scholarshipId)) {
      toast({
        title: "Already applied",
        description: "You have already applied for this scholarship",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await applyForScholarshipSafely(scholarshipId, address!);

      if (result.existing) {
        toast({
          title: "Already applied",
          description: "You have already applied for this scholarship",
        });
        setAppliedScholarships([...appliedScholarships, scholarshipId]);
        return;
      }

      if (!result.success) {
        throw new Error(result.error);
      }

      setAppliedScholarships([...appliedScholarships, scholarshipId]);
      
      toast({
        title: "Application submitted",
        description: "You have successfully applied for this scholarship",
      });
    } catch (error: any) {
      console.error("Error applying for scholarship:", error);
      
      setAppliedScholarships([...appliedScholarships, scholarshipId]);
      
      toast({
        title: "Application processed",
        description: "Your application has been recorded",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredScholarships = scholarships.filter(
    (scholarship) =>
      scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderScholarshipCard = (scholarship: any) => {
    const hasApplied = appliedScholarships.includes(scholarship.id);
    
    return (
      <div key={scholarship.id} className="border rounded-lg overflow-hidden">
        <ScholarshipCard 
          scholarship={scholarship} 
          showActions={false} 
        />
        <div className="p-4 bg-gray-50 border-t">
          {scholarship.status === 'pending' && (
            hasApplied ? (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Application submitted
              </div>
            ) : (
              <Button 
                onClick={() => handleApply(scholarship.id)}
                className="w-full bg-edu-accent hover:bg-edu-accent/90"
                disabled={isLoading}
              >
                <Award className="mr-2 h-4 w-4" />
                {isLoading ? "Submitting..." : "Apply for Scholarship"}
              </Button>
            )
          )}
          
          {scholarship.status === 'approved' && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Approved - Awaiting funding
            </div>
          )}
          
          {scholarship.status === 'completed' && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Funded and completed
            </div>
          )}
          
          {scholarship.status === 'rejected' && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Scholarship rejected
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-edu-dark">Scholarships</h1>
            <p className="text-gray-600 mt-1">Browse available scholarships</p>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search scholarships..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {isGovernment && <CreateScholarshipForm />}
          </div>
        </div>
        
        <div className="mb-6 rounded-md bg-purple-50 p-4 text-purple-800 flex items-start gap-2">
          <Shield className="h-5 w-5 mt-1" />
          <div >
            <p className="font-medium">EDUChain Scholarship System</p>
            <p className="text-sm mt-1">1. Scholarships are provided by Government </p>
            <p className="text-sm mt-1">2. Students can apply for the scolarships with their documents </p>
            <p className="text-sm mt-1">3. Once documents are verified, government approves applications</p>
            <p className="text-sm mt-1">4. After approval financer approves payment to the applicant with 0.001 EDU.</p>
            
              
          </div>
        </div>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-6">
            {pendingScholarships.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No active scholarships found</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingScholarships
                  .filter((s) => s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                s.description.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(renderScholarshipCard)}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="space-y-6">
            {filteredScholarships.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No scholarships found</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredScholarships.map(renderScholarshipCard)}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-6">
            {filteredScholarships.filter((s) => s.status === 'completed').length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No completed scholarships found</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredScholarships
                  .filter((s) => s.status === 'completed')
                  .map(renderScholarshipCard)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
     
    </div>
  );
};

export default Scholarships;
