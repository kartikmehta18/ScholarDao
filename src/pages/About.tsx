
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-edu-dark mb-6">About EduDAO</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              EduDAO is a decentralized autonomous organization (DAO) built on the EDUChain network, designed to make student scholarships and grants more transparent, accessible, and secure.
            </p>
            
            <div className="my-12 grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-edu-light flex items-center justify-center">
                      <Users className="h-5 w-5 text-edu-primary" />
                    </div>
                    <CardTitle>Community Governed</CardTitle>
                  </div>
                  <CardDescription>Transparent decision making</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    All scholarship decisions are made through community voting. Anyone with a verified identity can participate in the governance process, ensuring fair distribution of funds.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-edu-light flex items-center justify-center">
                      <Shield className="h-5 w-5 text-edu-primary" />
                    </div>
                    <CardTitle>Privacy Preserved</CardTitle>
                  </div>
                  <CardDescription>Zero-knowledge verification</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Using Anon Aadhaar technology, we verify user identities without exposing personal information. Your privacy is protected while ensuring only valid users participate.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <h2 className="text-2xl font-bold text-edu-dark mt-12 mb-6">How It Works</h2>
            
            <ol className="space-y-6 mb-12">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-edu-primary text-white flex items-center justify-center flex-shrink-0 mt-1">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-edu-dark">Connect Your Wallet</h3>
                  <p className="text-gray-600 mt-1">
                    Start by connecting your EDUChain wallet to the platform. This will allow you to interact with the DAO and participate in governance.
                  </p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-edu-primary text-white flex items-center justify-center flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-edu-dark">Verify Your Identity</h3>
                  <p className="text-gray-600 mt-1">
                    Verify your identity using Anon Aadhaar's zero-knowledge proof system. This ensures your privacy while confirming your eligibility.
                  </p>
                </div>
              </li>
              
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-edu-primary text-white flex items-center justify-center flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-edu-dark">Participate in the DAO</h3>
                  <p className="text-gray-600 mt-1">
                    Create scholarship proposals, apply for funding, or vote on existing proposals. All activities are recorded on the blockchain for transparency.
                  </p>
                </div>
              </li>
            </ol>
            
            <h2 className="text-2xl font-bold text-edu-dark mt-12 mb-6">Our Technology</h2>
            
            <div className="space-y-6 mb-12">
              <div>
                <h3 className="text-xl font-bold text-edu-dark">EDUChain</h3>
                <p className="text-gray-600 mt-1">
                  We utilize the EDUChain testnet for all blockchain transactions, providing a fast, secure, and education-focused network for our DAO operations.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-edu-dark">Anon Aadhaar</h3>
                <p className="text-gray-600 mt-1">
                  Our identity verification system uses Anon Aadhaar, a zero-knowledge protocol that allows Aadhaar ID owners to prove their identity without revealing personal information.
                </p>
              </div>
            </div>
            
            <div className="bg-edu-light rounded-lg p-8 my-12 text-center">
              <h2 className="text-2xl font-bold text-edu-dark mb-4">Ready to Get Started?</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Join EduDAO today and be part of a revolutionary approach to educational funding and scholarships.
              </p>
              <Link to="/scholarships">
                <Button size="lg" className="bg-edu-primary hover:bg-edu-primary/90">
                  Explore Scholarships
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-edu-dark text-white py-6 px-4 mt-auto">
        <div className="container mx-auto max-w-6xl">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} EduDAO. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
