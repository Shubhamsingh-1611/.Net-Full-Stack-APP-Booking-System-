import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { InteractionStatus } from "@azure/msal-browser";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { setTokenProvider } from "./services/api.js";
import { RoleGuard } from "./auth/RoleGuard.jsx"; // Adjust this path to match your folder structure
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import { useEffect } from "react";
import { apiScope } from "./auth/msalConfig.js";

// A quick helper component to determine where a user goes when they land on "/"
function RootRedirect() {
  const { inProgress, accounts, instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  if (inProgress !== InteractionStatus.None) {
    return <p role="status">Completing sign-in...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const account = instance.getActiveAccount() ?? accounts[0];
  const userRoles = account?.idTokenClaims?.roles ?? [];
  const destination = userRoles.some((role) => ["Staff", "Admin"].includes(role))
    ? "/dashboard"
    : "/form-d1";

  return <Navigate to={destination} replace />;
}

export default function App() {
const { instance, accounts } = useMsal();

  useEffect(() => {
  setTokenProvider(async () => {
    const result = await instance.acquireTokenSilent({
      scopes: [apiScope],  // from Azure app registration
      account: accounts[0],
    });
    return result.accessToken;
  });
}, [instance, accounts]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing/Entry Redirection */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public Login Route (Presented just as it is) */}
        <Route path="/login" element={<Login />} />

        {/* Secure Home Page: Accessible by Client, Staff, and Admin */}
        <Route
          path="/form-d1"
          element={
            <RoleGuard allowedRoles={["Client", "Staff", "Admin"]}>
              <Home />
            </RoleGuard>
          }
        />

        {/* Secure Management Dashboard: Strictly restricted to Staff and Admin */}
        <Route
          path="/dashboard"
          element={
            <RoleGuard allowedRoles={["Staff", "Admin"]}>
              <Dashboard />
            </RoleGuard>
          }
        />

        <Route
          path="/profile"
          element={
            <RoleGuard allowedRoles={["Client", "Staff", "Admin"]}>
              <Profile />
            </RoleGuard>
          }
        />

        {/* Catch-all fallback: Redirects any unknown URL back to the entry logic */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
