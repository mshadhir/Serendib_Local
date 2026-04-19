import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import BookingConfirmed from "@/pages/BookingConfirmed";
import { Toaster } from "@/components/ui/sonner";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { LangProvider } from "@/context/LangContext";

function App() {
  return (
    <div className="App">
      <LangProvider>
        <CurrencyProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/booking-confirmed" element={<BookingConfirmed />} />
            </Routes>
          </BrowserRouter>
          <Toaster position="bottom-center" richColors />
        </CurrencyProvider>
      </LangProvider>
    </div>
  );
}

export default App;
