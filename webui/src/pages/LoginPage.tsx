import { useAuth } from "../components/AuthContext";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  const { isLoggedIn, handleLogout } = useAuth();

  return (
    <>
      {!isLoggedIn ? (
        <div style={{ margin: "20px auto", textAlign: "center" }}>
          <h3>Log in with your API key to see posts from your curated list</h3>
          <LoginForm />
        </div>
      ) : (
        <div>
          You are already logged in.{" "}
          <button onClick={handleLogout}>Log out</button>
        </div>
      )}
    </>
  );
}
