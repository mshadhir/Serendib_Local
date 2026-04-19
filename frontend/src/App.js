import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import PackageDetail from "@/pages/PackageDetail";
import Admin from "@/pages/Admin";
import Deposit from "@/pages/Deposit";
import CarAndDriverPage from "@/pages/CarAndDriverPage";
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
              <Route path="/packages/:slug" element={<PackageDetail />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/deposit/:slug" element={<Deposit />} />
              <Route path="/car-and-driver" element={<CarAndDriverPage />} />
            </Routes>
          </BrowserRouter>
          <Toaster position="bottom-center" richColors />
        </CurrencyProvider>
      </LangProvider>
    </div>
  );
}

export default App;
