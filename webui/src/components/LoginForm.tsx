import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const { setApiKey, LoginError, setLoginError } = useAuth();
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    toast.success("Login was successful!", {
      position: "top-center",
      autoClose: 3000,
    });
    navigate("/");
  };

  const handleSignUp = () => {
    navigate("/signup");
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
      await setApiKey(apiKeyInput); // Update the global API key
      handleLoginSuccess();
    } catch (error) {
      console.error("Error logging in", error);
      handleLoginError();
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleApikeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKeyInput(event.target.value);
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
        label="API Key"
        variant="outlined"
        onChange={handleApikeyChange}
        error={LoginError ? true : false}
        name="apikey"
        margin="normal"
        type={showPassword ? "text" : "password"}
        required={true}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {LoginError && <p style={{ color: "red" }}>{LoginError}</p>}
      <button className="login-button" type="submit">
        Log In
      </button>

      <hr style={{ margin: "16px 0" }} />
      <button className="signup-button" type="button" onClick={handleSignUp}>
        Create new account
      </button>
    </form>
  );
}
