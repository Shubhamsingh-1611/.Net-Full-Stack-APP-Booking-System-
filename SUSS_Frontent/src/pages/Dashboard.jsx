import { useMsal } from "@azure/msal-react";


export default function Dashboard() {
  const { accounts, instance } = useMsal();
  const account = instance.getActiveAccount() ?? accounts[0];

  const handleLogout = () => {
    instance.logoutRedirect({
      account,
      postLogoutRedirectUri: window.location.origin,
    });
  };

  return (
    <div>
      <h1>Login Successful!</h1>
      <p>Account: {account?.username}</p>
      {/* <Test /> */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}