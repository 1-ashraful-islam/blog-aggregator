import { useAuth } from "../components/AuthContext";
import NewUserForm from "../components/NewUserForm";

export default function LoginPage() {
  const { isLoggedIn, handleLogout, apiKey } = useAuth();

  return (
    <>
      {!isLoggedIn ? (
        <div style={{ margin: "20px auto", textAlign: "center" }}>
          <h3>
            Create an account to get the API key to see posts from your curated
            list
          </h3>
          <NewUserForm />
        </div>
      ) : (
        <div>
          You are already logged in.{" "}
          <p>
            {" "}
            Your API Key is: <code>{apiKey}</code>
          </p>
          <p>
            {" "}
            Please copy it and keep it safe, you will not be able to retrieve
            this key later
          </p>
          <button onClick={handleLogout}>Log out</button>
        </div>
      )}
    </>
  );
}
