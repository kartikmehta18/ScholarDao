import React from 'react'
import { Link } from "react-router-dom";


function Footer() {
  return (
    <div>
         <footer className="bg-edu-dark text-white py-12 px-4">
                <div className="container mx-auto max-w-6xl">
                  <div className="grid md:grid-cols-4 gap-8">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="rounded-md bg-white p-1">
                          <div className="text-lg font-bold text-edu-primary">S</div>
                        </div>
                        <div className="font-bold text-lg text-white">
                          ScholarDAO
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
                        <li><a href="https://www.opencampus.xyz/" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                        <li><a href="https://www.opencampus.xyz/" className="text-gray-400 hover:text-white transition-colors">EDUChain</a></li>
                        <li><a href="https://documentation.anon-aadhaar.pse.dev/docs/intro" className="text-gray-400 hover:text-white transition-colors">Anon Aadhaar</a></li>
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
                  
                  <div className="mt-12 pt-6 border-t border-gray-700 text-gray-400 text-sm text-center">
                    <p>© {new Date().getFullYear()} ScholarDAO. All rights reserved. | Made with ❤️ & ☕ by Team Pull Stackers at ACE HACK 4.0</p>
                  </div>
                </div>
              </footer>
    </div>
  )
}

export default Footer