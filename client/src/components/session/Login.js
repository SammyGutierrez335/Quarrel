import React, { useState } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import { useHistory } from "react-router-dom";
import Mutations from "../../graphql/mutations";
import * as SessionUtil from "../../util/session_util";

const { LOGIN_USER } = Mutations;

const Login = () => {
  const history = useHistory();
  const client = useApolloClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const [loginUser] = useMutation(LOGIN_USER, {
    onCompleted: ({ login }) => {
      if (!login) return;
      // persist
      SessionUtil.saveUserToCache(client, login);
      SessionUtil.saveUserToLocalStorage(login);
      // go home
      history.push("/");
    },
    onError: (err) => {
      const msgs = err?.graphQLErrors?.map((e) => e.message) || [err.message];
      setErrors(msgs);
      setTimeout(() => setErrors([]), 5000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser({ variables: { email, password } });
  };

  const handleDemoLogin = (e) => {
    e.preventDefault();
    loginUser({ variables: { email: "demouser@gmail.com", password: "password" } });
  };

  return (
    <div className="session-page">
        <form className="login-form-box" onSubmit={handleSubmit}>
          <p className="session-label">Login</p>
          <div className="login-form">
          <h2>?</h2>
          {errors.length > 0 && (
            <ul className="errors">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          )}
        <div className="input-boxes">
            <label style={{width: "100%"}}>EMAIL</label>
            <input
              className="text_box"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          <label>
            Password
            <input
              className="text_box"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
          </div>
          <div style={{display: "flex", justifyContent: "space-between"}}>

          <button type="submit" className="form-button">Log In</button>
          <button type="button" onClick={handleDemoLogin} className="demo-button">Demo Login</button>
          </div>
      </div>
        </form>
      </div>
  );
};

export default Login;