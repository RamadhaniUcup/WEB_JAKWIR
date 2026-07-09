import { Outlet } from "react-router-dom";
import Footer from "../components/common/footer.tsx";
import Header from "../components/common/header.tsx";

export default function MainLayout() {
  return (
    <div className="text-slate-200 min-h-screen relative overflow-x-hidden selection:bg-indigo-500 selection:text-white flex flex-col">
      
      {/* Decorative Ambient Glows dari desain CrediMatch */}
      <div className="fixed top-[-10%] left-[-10%] w-125 h-125 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed top-[30%] right-[-10%] w-150 h-150 rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[10%] left-[5%] w-100 h-100 rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none -z-10"></div>

      {/* Header Area */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      <main className="grow w-full flex flex-col pt-20 z-0 bg-slate-800">
        <Outlet />
      </main>

      {/* Footer Area */}
      <Footer />
      
    </div>
  );
}