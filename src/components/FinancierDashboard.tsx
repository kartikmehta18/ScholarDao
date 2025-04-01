import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useDAO } from "@/contexts/DAOContext";
import { Banknote, FileText, Calendar, Check } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { getSupabaseClient } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers"; // Import ethers

export function FinancierDashboard() {
  const { scholarships, fundScholarship, loading } = useDAO();
  const { address, isAuthenticated, connectWallet } = useWallet();
  const { toast } = useToast();
  const [fundingInProgress, setFundingInProgress] = useState<string | null>(null);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [approvedScholarships, setApprovedScholarships] = useState(
    scholarships.filter((s) => s.status === "approved")
  );

  // Update approved scholarships when scholarships change
  useEffect(() => {
    setApprovedScholarships(
      scholarships.filter((s) => s.status === "approved")
    );
  }, [scholarships]);

  const handleFund = async (scholarshipId: string) => {
    if (loading || fundingInProgress) return;

    setFundingInProgress(scholarshipId);
    setLoadingApplications(true);
    const client = getSupabaseClient();

    try {
      // Find the approved application for this scholarship
      const { data: applications, error } = await client
        .from("applications")
        .select("*")
        .eq("scholarship_id", scholarshipId)
        .eq("status", "approved");

      setLoadingApplications(false);

      if (error) {
        throw error;
      }

      let applicationsToUse = applications;

      if (!applicationsToUse || applicationsToUse.length === 0) {
        // Try to find any application for this scholarship
        const { data: allApplications, error: allAppsError } = await client
          .from("applications")
          .select("*")
          .eq("scholarship_id", scholarshipId)
          .limit(1);

        if (allAppsError || !allApplications || allApplications.length === 0) {
          throw new Error("No application found for this scholarship");
        }

        // Use the first application we find
        applicationsToUse = allApplications;
      }

      // Payment logic using ethers
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const scholarship = scholarships.find((s) => s.id === scholarshipId);
        if (!scholarship) {
          throw new Error("Scholarship not found");
        }

        const tx = {
          to: applicationsToUse[0].applicant_address,
          value: ethers.utils.parseEther(scholarship.amount.toString()),
        };

        // Estimate gas
        const gasEstimate = await signer.estimateGas(tx);

        // Send transaction with estimated gas
        const transaction = await signer.sendTransaction({
          ...tx,
          gasLimit: gasEstimate.mul(120).div(100), // Add 20% buffer to gas estimate
        });

        toast({
          title: "Payment successful",
          description: `${scholarship.amount} EDU sent to student successfully`,
        });

        // Wait for transaction to be mined
        await transaction.wait();

        // Update scholarship status
        await fundScholarship(scholarshipId, applicationsToUse[0].id);
      } else {
        toast({
          title: "MetaMask not found",
          description: "Please install MetaMask to process payments",
          variant: "destructive",
        });
        throw new Error("MetaMask not installed");
      }
    } catch (error) {
      console.error("Funding error:", error);
      toast({
        title: "Error processing funding",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setFundingInProgress(null);
    }
  };

  // Calculate total funded amount
  const totalFunded = scholarships
    .filter((s) => s.status === "completed")
    .reduce((total, s) => total + s.amount, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <Banknote className="h-5 w-5 text-edu-primary" />
            Financier Dashboard
          </CardTitle>
          <CardDescription>
            Fund approved scholarships and track financial distributions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-edu-light rounded-md p-3">
              <p className="text-xs text-edu-dark/60">Awaiting Funding</p>
              <p className="text-xl font-bold text-edu-primary">
                {approvedScholarships.length}
              </p>
            </div>
            <div className="bg-edu-light rounded-md p-3">
              <p className="text-xs text-edu-dark/60">Total Funded</p>
              <p className="text-xl font-bold text-edu-primary">
                {scholarships.filter((s) => s.status === "completed").length}
              </p>
            </div>
            <div className="bg-edu-light rounded-md p-3">
              <p className="text-xs text-edu-dark/60">Total Amount</p>
              <p className="text-xl font-bold text-edu-primary">
                {totalFunded.toFixed(3)} EDU
              </p>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-edu-primary" />
            Approved Scholarships to Fund
          </h3>

          {approvedScholarships.length === 0 ? (
            <div className="bg-gray-50 rounded-md p-6 text-center text-gray-500">
              No scholarships awaiting funding
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scholarship</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Date Approved</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedScholarships.map((scholarship) => (
                    <TableRow key={scholarship.id}>
                      <TableCell className="font-medium">
                        {scholarship.title}
                      </TableCell>
                      <TableCell>{scholarship.amount.toFixed(3)} EDU</TableCell>
                      <TableCell className="font-mono text-xs">
                        {scholarship.recipient
                          ? `${scholarship.recipient.slice(
                              0,
                              6
                            )}...${scholarship.recipient.slice(-4)}`
                          : "Not assigned"}
                      </TableCell>
                      <TableCell>
                        {new Date(scholarship.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          className="bg-edu-accent hover:bg-edu-accent/70"
                          onClick={() => handleFund(scholarship.id)}
                          disabled={
                            loading ||
                            fundingInProgress === scholarship.id ||
                            loadingApplications
                          }
                        >
                          <Banknote className="mr-1 h-4 w-4" />
                          {fundingInProgress === scholarship.id
                            ? "Processing..."
                            : "Pay Now"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <h3 className="text-lg font-medium mt-8 mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-edu-primary" />
            Funding History
          </h3>

          {scholarships.filter((s) => s.status === "completed").length === 0 ? (
            <div className="bg-gray-50 rounded-md p-6 text-center text-gray-500">
              No funding history yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scholarship</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Date Funded</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scholarships
                    .filter((s) => s.status === "completed")
                    .map((scholarship) => (
                      <TableRow key={scholarship.id}>
                        <TableCell className="font-medium">
                          {scholarship.title}
                        </TableCell>
                        <TableCell>
                          {scholarship.amount.toFixed(3)} EDU
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {scholarship.recipient
                            ? `${scholarship.recipient.slice(
                                0,
                                6
                              )}...${scholarship.recipient.slice(-4)}`
                            : "Not assigned"}
                        </TableCell>
                        <TableCell>
                          {new Date(
                            scholarship.created_at
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check className="mr-1 h-3 w-3" />
                            Completed
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}