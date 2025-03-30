
import { Header } from "@/components/Header";
import { AnonAadhaarLogin } from "@/components/AnonAadhaarLogin";
import { useDAO } from "@/contexts/DAOContext";
import { useAnonAadhaarContext } from "@/contexts/AnonAadhaarContext";
import { useWallet } from "@/hooks/use-wallet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, ArrowRight, User, Shield } from "lucide-react";
import { GovernmentDashboard } from "@/components/GovernmentDashboard";
import { FinancierDashboard } from "@/components/FinancierDashboard";
import { StudentDashboard } from "@/components/StudentDashboard";
import { CreateScholarshipForm } from "@/components/CreateScholarshipForm";
import { GOVERNMENT_ADDRESS, FINANCIER_ADDRESS } from "@/constants/dao";

const MyDashboard = () => {
  const { scholarships } = useDAO();
  const { isVerified, userDetails } = useAnonAadhaarContext();
  const { isConnected, address, formatAddress, connectWallet } = useWallet();

  // Determine user role
  const userRole = !address 
    ? 'regular'
    : address.toLowerCase() === GOVERNMENT_ADDRESS.toLowerCase()
    ? 'government'
    : address.toLowerCase() === FINANCIER_ADDRESS.toLowerCase()
    ? 'financier'
    : 'student';

  // Render the appropriate dashboard based on the user's role
  const renderDashboard = () => {
    switch (userRole) {
      case 'government':
        return <GovernmentDashboard />;
      case 'financier':
        return <FinancierDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return (
          <div className="grid md:grid-cols-1 gap-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Regular User Account</CardTitle>
                <CardDescription>You're logged in as a regular user</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-50 p-4 rounded-lg mb-6 flex items-start gap-3 text-yellow-800">
                  <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Limited Access</p>
                    <p className="mt-1 text-sm">
                      Regular users can browse and apply for scholarships. Only government officers can create scholarships.
                    </p>
                  </div>
                </div>
                
                <Button
                  className="bg-edu-primary hover:bg-edu-primary/90 w-full"
                  asChild
                >
                  <a href="/scholarships">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Browse Scholarships
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold text-edu-dark mb-8">My Dashboard</h1>
        
        {!isConnected ? (
          <div className="max-w-md mx-auto my-8 text-center">
            <div className="bg-yellow-50 p-6 rounded-lg mb-6">
              <User className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
              <h2 className="text-xl font-bold text-edu-dark mb-2">Connect Your Wallet</h2>
              <p className="text-gray-600 mb-6">
                You need to connect your wallet to view your dashboard.
              </p>
              <Button 
                className="bg-edu-primary hover:bg-edu-primary/90"
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            </div>
          </div>
        ) : (userRole === 'student' && !isVerified) ? (
          <div className="max-w-md mx-auto my-8">
            <div className="bg-yellow-50 p-4 rounded-lg mb-6 flex items-start gap-3 text-yellow-800">
              <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Verification Required</p>
                <p className="mt-1 text-sm">
                  Students need to verify their identity with Aadhaar to access the dashboard.
                </p>
              </div>
            </div>
            <AnonAadhaarLogin />
          </div>
        ) : (
          <div className="grid gap-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-edu-primary" />
                  <span className="font-medium text-lg">
                    {userRole === 'government' 
                      ? 'Government Officer Account' 
                      : userRole === 'financier' 
                        ? 'Financier Account' 
                        : 'Student Account'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {userRole === 'government' 
                    ? 'You can review and approve scholarship applications and create new scholarships' 
                    : userRole === 'financier' 
                      ? 'You can fund approved scholarships' 
                      : 'Apply for scholarships and track your applications'}
                </p>
              </div>
              
              {userRole === 'government' && <CreateScholarshipForm />}
            </div>
            
            {renderDashboard()}
          </div>
        )}
      </main>
      
      <footer className="bg-edu-dark text-white py-6 px-4 mt-12">
        <div className="container mx-auto max-w-6xl">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} EduDAO. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MyDashboard;
