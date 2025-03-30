
import { ConnectWallet } from "./ConnectWallet";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
      scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
    }`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-md bg-edu-primary p-1">
              <div className="text-2xl font-bold text-white">E</div>
            </div>
            <div className="font-bold text-xl text-edu-dark">
              EduDAO
            </div>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-edu-dark hover:text-edu-primary transition-colors">
              Home
            </Link>
            <Link to="/scholarships" className="text-edu-dark hover:text-edu-primary transition-colors">
              Scholarships
            </Link>
            <Link to="/my-dashboard" className="text-edu-dark hover:text-edu-primary transition-colors">
              My Dashboard
            </Link>
            <Link to="/about" className="text-edu-dark hover:text-edu-primary transition-colors">
              About
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}
