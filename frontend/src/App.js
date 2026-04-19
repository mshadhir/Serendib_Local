import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import PackageDetail from "@/pages/PackageDetail";
import { Toaster } from "@/components/ui/sonner";
import { CurrencyProvider } from "@/context/CurrencyContext";

function App() {
  return (
    <div className="App">
      <CurrencyProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/packages/:slug" element={<PackageDetail />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-center" richColors />
      </CurrencyProvider>
    </div>
  );
}

export default App;
