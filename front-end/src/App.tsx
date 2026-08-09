import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
// import { GeistSans } from "geist/font/sans";

const App = () => {
  return (
    <div className={`w-full`}>
      <Outlet />
      <Toaster />
    </div>
  );
};

export default App;
