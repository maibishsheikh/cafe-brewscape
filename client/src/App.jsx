import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import BookTable from "./pages/BookTable";
import Order from "./pages/Order";
import OwnerLogin from "./pages/OwnerLogin";
import Dashboard from "./pages/Dashboard";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/book" element={<BookTable />} />
            <Route path="/order" element={<Order />} />
            <Route path="/owner/login" element={<OwnerLogin />} />
            <Route path="/owner" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
