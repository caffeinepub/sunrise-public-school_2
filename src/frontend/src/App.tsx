import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import SplashScreen from "./components/SplashScreen";
import { Toaster } from "./components/ui/sonner";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import AdminPanel from "./pages/AdminPanel";
import AdmitCards from "./pages/AdmitCards";
import Attendance from "./pages/Attendance";
import Classes from "./pages/Classes";
import Dashboard from "./pages/Dashboard";
import Fees from "./pages/Fees";
import Login from "./pages/Login";
import Results from "./pages/Results";
import Settings from "./pages/Settings";
import Students from "./pages/Students";

function AppLayout() {
  const { identity, isInitializing } = useInternetIdentity();
  if (isInitializing)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "#6B7280",
        }}
      >
        Loading...
      </div>
    );
  if (!identity) return <Login />;
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

const rootRoute = createRootRoute({ component: AppLayout });
const dashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});
const classesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/classes",
  component: Classes,
});
const studentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/students",
  component: Students,
});
const attendanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/attendance",
  component: Attendance,
});
const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: Results,
});
const feesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fees",
  component: Fees,
});
const admitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admit-cards",
  component: AdmitCards,
});
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: Settings,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPanel,
});

const routeTree = rootRoute.addChildren([
  dashRoute,
  classesRoute,
  studentsRoute,
  attendanceRoute,
  resultsRoute,
  feesRoute,
  admitRoute,
  settingsRoute,
  adminRoute,
]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>
      {!showSplash && <RouterProvider router={router} />}
      <Toaster richColors position="top-right" />
    </>
  );
}
