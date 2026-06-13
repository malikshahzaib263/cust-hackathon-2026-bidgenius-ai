import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Navbar />
        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </div>
  );
}
