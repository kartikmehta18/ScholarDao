
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Scholarships from "./pages/Scholarships";
import MyDashboard from "./pages/MyDashboard";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { AnonAadhaarProvider } from "./contexts/AnonAadhaarContext";
import { DAOProvider } from "./contexts/DAOContext";
import Footer from "./components/Footer";
import { Header } from "./components/Header";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AnonAadhaarProvider>
        <DAOProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/scholarships" element={<Scholarships />} />
              <Route path="/my-dashboard" element={<MyDashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          <Footer />
          </BrowserRouter>
        </DAOProvider>
      </AnonAadhaarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
