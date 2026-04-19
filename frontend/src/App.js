import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import BookingConfirmed from "@/pages/BookingConfirmed";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/sonner";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { LangProvider } from "@/context/LangContext";
import { ContentProvider } from "@/context/ContentContext";

function App() {
  return (
    <HelmetProvider>
      <div className="App">
        <ContentProvider>
          <LangProvider>
            <CurrencyProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/booking-confirmed" element={<BookingConfirmed />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              <Toaster position="bottom-center" richColors />
            </CurrencyProvider>
          </LangProvider>
        </ContentProvider>
      </div>
    </HelmetProvider>
  );
}

export default App;
