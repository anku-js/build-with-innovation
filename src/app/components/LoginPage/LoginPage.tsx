"use client";
import "./LoginPage.css";
import { useState, ChangeEvent, FormEvent } from "react";
import Cookies from "js-cookie";
import { RxCrossCircled } from "react-icons/rx";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [credentialsByUser, setCredentialsByUser] = useState({
    username: "",
    password: "",
  });
  const [apiResponse, setApiResponse] = useState({
    status: "",
    message: "",
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setCredentialsByUser((prevFormData) => {
      return {
        ...prevFormData,
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
    <div className="form">
      <div className="container">
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
                  placeholder="USERNAME"
                  className="form-control"
                  id="username"
                  required
                  data-validation-required-message="Please enter your username."
                  name="username"
                  value={credentialsByUser.username}
                />
                <p className="help-block text-danger"></p>
              </div>
              <div className="form-group">
                <input
                  onChange={handleInputChange}
                  placeholder="PASSWORD"
                  type="password"
                  className="form-control"
                  id="password"
                  required
                  data-validation-required-message="Please enter your password"
                  name="password"
                  value={credentialsByUser.password}
                />
                <p className="help-block text-danger"></p>
              </div>
              <div className="forgot-credentials">
                <a className="forgot-username">Forgot Username?</a>
                <a className="forgot-password">Forgot Password?</a>
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
    </div>
  );
}
