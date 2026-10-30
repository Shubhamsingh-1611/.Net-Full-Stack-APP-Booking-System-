import { useState } from "react";
import { InteractionStatus } from "@azure/msal-browser";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { Navigate } from "react-router-dom";
import { loginRequest } from "../auth/msalConfig.js";

export default function Login() {
  const [loginError, setLoginError] = useState("");
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const account = instance.getActiveAccount() ?? accounts[0];
  const userRoles = account?.idTokenClaims?.roles ?? [];
  const destination = userRoles.some((role) => ["Staff", "Admin"].includes(role))
    ? "/dashboard"
    : "/form-d1";

  if (inProgress !== InteractionStatus.None) {
    return <p role="status">Completing sign-in...</p>;
  }

  if (isAuthenticated) {
    return <Navigate to={destination} replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Sign-in failed:", error);
      setLoginError("Sign-in could not be started. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-sans text-[#333]">
      {}
      <header className="w-full px-6 py-4 flex items-center bg-white border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <span className="text-[#002B49] font-black text-3xl tracking-tight">SUSS</span>
            <div className="flex space-x-0.5 ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]"></span>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-[#E31B23] mx-2"></div>
          <div className="flex flex-col">
            <span className="text-[#002B49] font-extrabold text-xs tracking-wider uppercase leading-none">C-THREE</span>
            <span className="text-[#002B49] font-extrabold text-xs tracking-wider uppercase leading-tight mt-0.5">COUNSELLING &amp;</span>
            <span className="text-[#002B49] font-extrabold text-xs tracking-wider uppercase leading-tight">LIFE COACHING</span>
          </div>
        </div>
      </header>

      {}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-[#FAFAFA] border border-gray-100 rounded-sm shadow-sm p-10 max-w-lg w-full text-center">
          <h1 className="text-2xl font-semibold text-[#4A4A4A] mb-3">Sign In</h1>
          <p className="text-sm text-[#666666] mb-8">Secure Sign-in to the Central Hub</p>
          <form onSubmit={handleLogin}>
            <button
              type="submit"
              className="w-full bg-[#002B49] hover:bg-[#001d33] text-white font-medium py-3 px-4 rounded-sm transition duration-200 tracking-wider text-sm uppercase"
            >
              LOGIN
            </button>
          </form>
          {loginError && <p role="alert" className="mt-4 text-sm text-red-700">{loginError}</p>}
        </div>
      </main>

      {}
      <section className="px-6 md:px-16 py-6 max-w-6xl mx-auto text-xs text-[#555555] italic">
        <p className="font-bold not-italic mb-1 text-[#444]">Privacy Notice:</p>
        <p className="mb-2 leading-relaxed">
          Your privacy is important to us. Our sessions are confidential. In exceptional circumstances, our counsellors are legally and professionally required to disclose information when:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>There is potential danger to you, and/or the community,</li>
          <li>Required by SUSS regulations, or the law.</li>
        </ul>
      </section>

      {}
      <footer className="w-full">
        <div className="w-full h-[3px] bg-[#002B49]"></div>
        <div className="px-6 md:px-16 py-8 flex flex-col md:flex-row justify-between items-start md:items-center bg-white gap-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <span className="text-[#002B49] font-black text-2xl tracking-tight">SUSS</span>
              <div className="flex space-x-0.5 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]"></span>
              </div>
            </div>
            <div className="text-[10px] text-gray-500 tracking-wider font-semibold uppercase leading-tight border-l pl-3 border-gray-300">
              SINGAPORE UNIVERSITY<br />OF SOCIAL SCIENCES
            </div>
          </div>
          <div className="text-xs text-[#444444] text-left md:text-right space-y-0.5 leading-relaxed">
            <p className="font-semibold text-gray-700">SINGAPORE UNIVERSITY OF SOCIAL SCIENCES</p>
            <p>C-three (Counselling &amp; Life Coaching)</p>
            <p>535 Clementi Road</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
