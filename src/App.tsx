import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import CaseStudies from "./pages/CaseStudies";
import Clients from "./pages/Clients";
import About from "./pages/About";
import Certificates from "./pages/Certificates";
import Tools from "./pages/Tools";
import { TOOL1_ROUTE, LEVELING_ROUTE } from "./components/Tools/Constants";
import ResumeAndCoverLetterTool from "./components/Tools/ResumeAndCoverLetterTool";
import LevelingTool from "./components/Tools/Leveling/LevelingTool";
import NotFound from "./pages/NotFound";
import { store, persistor } from "./data/store/index";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};

const App = () => (
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen bg-background text-foreground">
              <Navigation />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/case-studies" element={<CaseStudies />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/about" element={<About />} />
                <Route path="/certificates" element={<Certificates />} />
                <Route path="/tools" element={<Tools />}>
                  <Route path={TOOL1_ROUTE.path} element={<ResumeAndCoverLetterTool />} />
                  <Route path={LEVELING_ROUTE.path} element={<LevelingTool />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);

export default App;
