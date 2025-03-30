
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { ArrowRight, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { AnonAadhaarLogin } from "@/components/AnonAadhaarLogin";
import { useAnonAadhaarContext } from "@/contexts/AnonAadhaarContext";

const Index = () => {
  const { isConnected } = useWallet();
  const { isVerified } = useAnonAadhaarContext();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
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
                    <Button size="lg" className="bg-edu-primary hover:bg-edu-primary/90">
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
                    <Users className="h-5 w-5 text-edu-secondary" />
                    <span className="text-gray-600">Community Governed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-edu-secondary" />
                    <span className="text-gray-600">Private & Secure</span>
                  </div>
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
                          <Button size="lg" className="bg-edu-primary hover:bg-edu-primary/90">
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
                          <Button size="lg" className="bg-edu-primary hover:bg-edu-primary/90">
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
      
      <footer className="bg-edu-dark text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-md bg-white p-1">
                  <div className="text-lg font-bold text-edu-primary">E</div>
                </div>
                <div className="font-bold text-lg text-white">
                  EduDAO
                </div>
              </div>
              <p className="text-gray-400">
                A decentralized autonomous organization for transparent student scholarships and grants.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/scholarships" className="text-gray-400 hover:text-white transition-colors">Scholarships</Link></li>
                <li><Link to="/my-dashboard" className="text-gray-400 hover:text-white transition-colors">My Dashboard</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">EDUChain</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Anon Aadhaar</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-700 text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} EduDAO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
