import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import { ToastProvider } from "./components/Toast";
import Shell from "./components/Shell";
import LoginScreen from "./screens/LoginScreen";
import RemoveMailingScreen from "./screens/RemoveMailingScreen";
import HomeScreen from "./screens/HomeScreen";
import AgentsScreen from "./screens/AgentsScreen";
import CampaignsScreen from "./screens/CampaignsScreen";
import EmployeesScreen from "./screens/EmployeesScreen";
import ManagersScreen from "./screens/ManagersScreen";
import UsersScreen from "./screens/UsersScreen";
import ActivityScreen from "./screens/ActivityScreen";
import NotFoundScreen from "./screens/NotFoundScreen";

// Heavy screens (Excel parser, rich-text editor) load on demand.
const SendStatusScreen = lazy(() => import("./screens/SendStatusScreen"));
const ManagerReportScreen = lazy(() => import("./screens/ManagerReportScreen"));
const MailingScreen = lazy(() => import("./screens/MailingScreen"));

function Protected({ admin, children }) {
  const { status, user } = useAuth();
  const location = useLocation();
  if (status === "checking") return null;
  if (status === "out") return <Navigate to="/login" replace state={{ from: location }} />;
  if (admin && !user?.isAdmin) return <Navigate to="/" replace />;
  return children;
}

function LoginRoute() {
  const { status } = useAuth();
  const location = useLocation();
  if (status === "checking") return null;
  if (status === "in") return <Navigate to={location.state?.from?.pathname || "/"} replace />;
  return <LoginScreen />;
}

function LogoutRoute() {
  const { logout, status } = useAuth();
  useEffect(() => {
    if (status === "in") logout();
  }, [status, logout]);
  return status === "out" ? <Navigate to="/login" replace /> : null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Suspense fallback={null}>
            <Routes>
              {/* Public: linked from every mailing email */}
              <Route path="/agents/remove-mailing" element={<RemoveMailingScreen />} />
              <Route path="/login" element={<LoginRoute />} />
              <Route path="/logout" element={<LogoutRoute />} />

              <Route
                element={
                  <Protected>
                    <Shell />
                  </Protected>
                }
              >
                <Route index element={<HomeScreen />} />
                <Route path="send-mail" element={<SendStatusScreen />} />
                <Route path="mailing" element={<MailingScreen />} />

                <Route path="agents" element={<AgentsScreen />} />
                <Route path="agents/add" element={<Navigate to="/agents?new=1" replace />} />
                <Route path="agents/per-week" element={<Navigate to="/agents?filter=weekly" replace />} />
                <Route path="agents/confirmed-mailing" element={<Navigate to="/agents?filter=mailing" replace />} />

                <Route path="campaigns" element={<CampaignsScreen />} />
                <Route path="campaigns/add" element={<Navigate to="/campaigns?new=1" replace />} />
                <Route path="employees" element={<EmployeesScreen />} />
                <Route path="employees/add" element={<Navigate to="/employees?new=1" replace />} />

                <Route path="business-managers" element={<ManagersScreen />} />
                <Route path="business-managers/add" element={<Navigate to="/business-managers?new=1" replace />} />
                <Route path="business-managers/report" element={<ManagerReportScreen />} />

                <Route
                  path="users"
                  element={
                    <Protected admin>
                      <UsersScreen />
                    </Protected>
                  }
                />
                <Route path="users/add" element={<Navigate to="/users?new=1" replace />} />
                <Route
                  path="users/history"
                  element={
                    <Protected admin>
                      <ActivityScreen />
                    </Protected>
                  }
                />
                <Route path="*" element={<NotFoundScreen />} />
              </Route>
            </Routes>
          </Suspense>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
