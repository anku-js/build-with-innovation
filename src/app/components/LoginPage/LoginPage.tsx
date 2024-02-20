"use client";
import "./LoginPage.css";
import { useState, ChangeEvent, FormEvent } from "react";
import Cookies from "js-cookie";
import { RxCrossCircled } from "react-icons/rx";
import { useRouter } from "next/navigation";

const initialUserCredentials = {
  username: "",
  password: "",
};

const initialApiResponse = {
  status: "",
  message: "",
};

export default function LoginPage() {
  const router = useRouter();
  const [credentialsByUser, setCredentialsByUser] = useState(
    initialUserCredentials
  );
  const [apiResponse, setApiResponse] = useState(initialApiResponse);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setCredentialsByUser((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  }

  const validateInputs = () => {
    if (credentialsByUser.username && credentialsByUser.password) {
      return true;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAuthenticating(true);
    const areInputsValid = validateInputs();
    if (areInputsValid) {
      const { username, password } = credentialsByUser;

      const loginRequest = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const response = await loginRequest.json();

      if (!!response.message) {
        setApiResponse({
          status: "Fail",
          message: response.message,
        });
        setIsAuthenticating(false);
      } else if (!!response.token) {
        const token = response.token;
        Cookies.set("Auth_token", token, { expires: 3600, secure: true });
        router.push("/home");
      }
    }
  };
  return (
    <div className="form-container">
      <div id="userform">
        <div className="login-tab">
          <h2 className="loginText">Login</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            {apiResponse.message ? (
              <div className="invalidCredentials">
                <RxCrossCircled />
                <p>{apiResponse.message}</p>
              </div>
            ) : (
              ""
            )}
            <div className="form-group">
              <input
                onChange={handleInputChange}
                placeholder="username *"
                className="form-control"
                id="username"
                required
                data-validation-required-message="Please enter your username."
                name="username"
                value={credentialsByUser.username}
              />
            </div>
            <div className="form-group">
              <input
                onChange={handleInputChange}
                placeholder="password *"
                type="password"
                className="form-control"
                id="password"
                required
                data-validation-required-message="Please enter your password"
                name="password"
                value={credentialsByUser.password}
              />
            </div>
            <div className="forgot-credentials">
              <a className="forgot-username" href="#">
                Forgot Username?
              </a>
              <a className="forgot-password" href="#">
                Forgot Password?
              </a>
            </div>
            <div className="mrgn-30-top">
              {isAuthenticating ? (
                <button className="submit-button authenticating">
                  Authenticating <span className="btn-ring"></span>
                </button>
              ) : (
                <button className="submit-button login">Login</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
