import { useMsal } from "@azure/msal-react";
import { Link, useLocation } from "react-router-dom";

export default function StudentPortalLayout({ children }) {
  const { accounts, instance } = useMsal();
  const account = instance.getActiveAccount() ?? accounts[0];
  const claims = account?.idTokenClaims ?? {};
  const email =
    claims.email ?? claims.preferred_username ?? account?.username ?? "";
  const isProfilePage = useLocation().pathname === "/profile";

  const handleSignOut = () =>
    instance.logoutRedirect({
      account,
      postLogoutRedirectUri: window.location.origin,
    });

  return (
    <div className="min-h-screen bg-white font-[Poppins,'Segoe_UI',system-ui,sans-serif] text-[#111827]">
      <header className="flex min-h-[100px] items-center justify-between gap-6 bg-[#fafafa] px-3 py-4">
        <div className="flex items-center gap-3 text-[#123b69]">
          <span className="text-[30px] font-bold leading-none tracking-tight">
            <span className="text-[#e31937]">S</span>USS
          </span>
          <span className="h-10 w-px bg-[#123b69]" />
          <span className="max-w-40 text-[12px] font-bold uppercase leading-[1.15]">
            C-Three
            <br />
            Counselling &amp;
            <br />
            Life Coaching
          </span>
        </div>
        <div className="flex items-start gap-2 text-right text-[#526174]">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="mt-0.5 h-4 w-4 fill-current"
          >
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
          </svg>
          <div className="max-w-[260px] text-sm">
            <div className="break-all">{email}</div>
            <div>Student</div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-100px)] flex-col md:flex-row">
        <aside className="w-full shrink-0 bg-[#fafafa] md:w-[280px]">
          <nav
            aria-label="Student portal"
            className="flex gap-1 overflow-x-auto px-3 py-3 md:flex-col md:gap-0 md:px-0 md:py-2"
          >
            <Link
              to="/profile"
              aria-current={isProfilePage ? "page" : undefined}
              className={`shrink-0 px-3 py-3 text-sm md:px-5 ${
                isProfilePage ? "text-red-600" : "text-[#111827]"
              }`}
            >
              Profile
            </Link>
            {[
              "Services",
              "Manage Bookings",
              "FAQ",
              "Instructions on how to book",
              "About",
            ].map((item) => (
              <span
                key={item}
                className="shrink-0 px-3 py-3 text-sm text-[#111827] md:px-5"
              >
                {item}
              </span>
            ))}
            <button
              type="button"
              onClick={handleSignOut}
              className="shrink-0 px-3 py-3 text-left text-sm text-[#111827] md:px-5"
            >
              Sign Out
            </button>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-10 pt-5 md:px-0">
          {children}
        </main>
      </div>
    </div>
  );
}
