import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

export default function LoginForm() {
  const [userNameInput, setUserNameInput] = useState("");
  const { setApiKey, LoginError, setLoginError } = useAuth();

  const handleLoginSuccess = () => {
    toast.success("Login was successful!", {
      position: "top-center",
      autoClose: 3000,
    });
    // navigate("/");
  };

  const handleLoginError = () => {
    toast.error(LoginError, {
      position: "top-center",
      autoClose: 3000,
    });
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      //call the users endpoint to get the user's API key, payload must be a JSON object with a name key
      const response = await fetch("http://localhost:8080/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: userNameInput }),
      });

      if (response.status !== 201) {
        throw new Error(
          "User not created" + response.status + response.statusText
        );
      }
      const data = await response.json();

      console.log(data);

      const apiKey = data.api_key;

      await setApiKey(apiKey); // Update the global API key
      handleLoginSuccess();
    } catch (error) {
      console.error("Error logging in", error);
      handleLoginError();
    }
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserNameInput(event.target.value);
    //clear the error message when the user starts typing
    if (LoginError) {
      setLoginError("");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "10px",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <TextField
        label="username"
        variant="outlined"
        onChange={handleUsernameChange}
        error={LoginError ? true : false}
        name="username"
        margin="normal"
        required={true}
        fullWidth
      />
      {LoginError && <p style={{ color: "red" }}>{LoginError}</p>}
      <button className="signup-button" type="submit">
        Create new account
      </button>
    </form>
  );
}
