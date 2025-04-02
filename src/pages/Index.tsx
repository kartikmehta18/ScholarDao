
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { ArrowRight, Shield, SquareCode, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { AnonAadhaarLogin } from "@/components/AnonAadhaarLogin";
import { useAnonAadhaarContext } from "@/contexts/AnonAadhaarContext";
import { HeroVideoDialogDemo } from "@/components/VideoBox";

const Index = () => {
  const { isConnected } = useWallet();
  const { isVerified } = useAnonAadhaarContext();

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1">
        {/* Hero Section */}
{/* <section className="border border-red-500 h-screen px-4 bg-white flex justify-center w-full">
  <img src="/heroBg.png" alt="heroBg" />
</section> */}
        <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-edu-light via-white to-edu-light/50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-edu-dark leading-tight">
                  Transparent Scholarships on the Blockchain
                </h1>
                <p className="text-xl text-gray-600">
                  A decentralized autonomous organization (DAO) for transparent student scholarships and grants.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link to="/scholarships">
                    <Button size="lg" className="bg-purple-700 hover:bg-purple-700/90">
                      Browse Scholarships
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="outline" size="lg">
                      Learn More
                    </Button>
                  </Link>
                </div>
                
                <div className="flex gap-6 pt-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="text-gray-600">Community Governed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <span className="text-gray-600">Private & Secure</span>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                <SquareCode  className="h-5 w-5 text-purple-600"/>
                  <span className="text-gray-600">Built on</span>
                  <img src="/educhainLogo.png" alt="educhainLogo" height={180} width={180} />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
                <div className="space-y-6">
                  {!isConnected ? (
                    <div className="text-center space-y-4 py-8">
                      <h2 className="text-2xl font-bold text-edu-dark">Get Started</h2>
                      <p className="text-gray-600">
                        Connect your wallet to interact with the EDUChain scholarship platform
                      </p>
                      <div className="flex justify-center pt-4">
                        <Link to="/scholarships">
                          <Button size="lg" className="bg-green-600 hover:bg-green-600/90">
                            Connect & Explore
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : !isVerified ? (
                    <div>
                      <h2 className="text-2xl font-bold text-edu-dark mb-4">Verify Your Identity</h2>
                      <AnonAadhaarLogin />
                    </div>
                  ) : (
                    <div className="text-center space-y-4 py-8">
                      <h2 className="text-2xl font-bold text-edu-dark">You're All Set!</h2>
                      <p className="text-green-600 font-medium">
                        Wallet connected and identity verified
                      </p>
                      <div className="flex justify-center pt-4">
                        <Link to="/my-dashboard">
                          <Button size="lg" className="bg-green-600 hover:bg-green-600/90">
                            Go to Your Dashboard
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="  bg-white flex justify-center">
        
        <img src="mainBg.png" alt="mainBg" height={1400} width={1400} />
        </section>
        <section className="my-10 py-16 px-4 bg-white flex justify-center">
        
        <HeroVideoDialogDemo />
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-edu-dark">How It Works</h2>
              <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
                Our platform combines blockchain transparency with privacy-preserving identity verification
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-edu-light rounded-lg p-6">
                <div className="w-12 h-12 bg-edu-primary rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-edu-dark mb-2">Connect & Verify</h3>
                <p className="text-gray-600">
                  Connect your wallet and verify your identity using Anon Aadhaar's privacy-preserving technology.
                </p>
              </div>
              
              <div className="bg-edu-light rounded-lg p-6">
                <div className="w-12 h-12 bg-edu-primary rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-edu-dark mb-2">Apply or Create</h3>
                <p className="text-gray-600">
                  Browse and apply for existing scholarships or create your own proposals for the community to fund.
                </p>
              </div>
              
              <div className="bg-edu-light rounded-lg p-6">
                <div className="w-12 h-12 bg-edu-primary rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-edu-dark mb-2">Vote & Govern</h3>
                <p className="text-gray-600">
                  Participate in DAO governance by voting on scholarship proposals and helping to determine funding.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
     
    </div>
  );
};

export default Index;
