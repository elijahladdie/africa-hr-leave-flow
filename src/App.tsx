import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LeaveApplication from "./pages/LeaveApplication";
import LeaveHistory from "./pages/LeaveHistory";
import ApprovalDashboard from "./pages/ApprovalDashboard";
import TeamCalendarPage from "./pages/TeamCalendarPage";
import AdminSettings from "./pages/AdminSettings";
import Team from "./pages/Team";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import ProfileSetup from "./pages/ProfileSetup";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import UserProfilePage from "./pages/Profile";
import AuthCallback from "./components/auth/auth-callback";
import ExternalLoginFailure from "./components/auth/profile-setup";
import { StoreProvider } from "./providers/StoreProvider";
import store from "./store";
import ErrorBoundary from "./components/ErrorBoundary";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// AuthController component to handle redirects based on authentication state
const AuthController = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (
      ((isAuthenticated || user) && location.pathname === "/login") ||
      (user?.teams?.length > 0 && location.pathname === "/auth/callback")
    ) {
      navigate(from, { replace: true });

      return;
    }

    // If user is not authenticated and not on login page, redirect to login
    // if (!isAuthenticated && location.pathname == '/login') {
    //   navigate('/');
    //   return;
    // }

    // If the user is authenticated but hasn't completed profile setup
    // and isn't already on the profile setup page
    // if (isAuthenticated &&
    //     user &&
    //     !user.hasCompletedProfile &&
    //     location.pathname !== '/profile-setup' &&
    //     location.pathname !== '/login') {
    //   navigate('/profile-setup');
    //   return;
    // }

    // If authenticated and on login page, redirect to home
    // if (isAuthenticated && location.pathname === '/login') {
    //   navigate('/');
    //   return;
    // }
  }, [isAuthenticated, user, navigate, location.pathname]);

  return <>{children}</>;
};

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ErrorBoundary>
            <TooltipProvider>
              <StoreProvider>
                <BrowserRouter>
                  <Toaster />
                  <Sonner />
                  <AuthController>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/auth/callback" element={<AuthCallback />} />
                      <Route
                        path="/auth/error"
                        element={<ExternalLoginFailure />}
                      />
                      <Route path="/" element={<ProtectedRoute />}>
                        <Route index element={<Index />} />

                        <Route
                          path="/profile-setup"
                          element={<ProfileSetup />}
                        />

                        <Route path="/apply" element={<LeaveApplication />} />

                        <Route path="/my-requests" element={<LeaveHistory />} />

                        <Route
                          path="/approvals"
                          element={<ApprovalDashboard />}
                        />

                        <Route
                          path="/team-calendar"
                          element={<TeamCalendarPage />}
                        />

                        <Route path="/team" element={<Team />} />

                        <Route path="/reports" element={<Reports />} />
                        <Route path="/profile" element={<UserProfilePage />} />

                        <Route path="/settings" element={<AdminSettings />} />
                      </Route>

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AuthController>
                </BrowserRouter>
              </StoreProvider>
            </TooltipProvider>
          </ErrorBoundary>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
