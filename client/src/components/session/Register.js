import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import Mutations from "../../graphql/mutations";
import { withRouter } from "react-router-dom";

const { REGISTER_USER } = Mutations;

// local cache doc for isLoggedIn (replaces writeData)
const IS_LOGGED_IN = gql`
  query IsLoggedIn {
    isLoggedIn @client
  }
`;

function Register(props) {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");

  const [registerUser] = useMutation(REGISTER_USER, {
    // mirror your previous updateCache -> writeData
    update: (cache, { data }) => {
      if (!data?.register) return;
      cache.writeQuery({
        query: IS_LOGGED_IN,
        data: { isLoggedIn: data.register.loggedIn },
      });
    },
    onError: (err) => {
      const msgs =
        err?.graphQLErrors?.map(e => e.message) ??
        (err?.message ? [err.message] : []);
      setErrors(msgs);
      setTimeout(() => setErrors([]), 5001);
    },
    onCompleted: (data) => {
      const { token, _id } = data.register;
      localStorage.setItem("auth-token", token);
      localStorage.setItem("currentUserId", _id);
      props.history.push("/");
      setMessage("New user created successfully");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser({
      variables: { fname, lname, email, password }
    }).catch(() => {}); // errors are handled in onError
  };

  const registerErrors = (
    <div className="login-error">
      {errors}
    </div>
  );

  return (
    <div className="">
      {errors.length > 0 ? registerErrors : null}
      {/* message is set like before; render if you want it visible */}
      {/* {message ? <div className="success-msg">{message}</div> : null} */}

      <form onSubmit={handleSubmit} className="signup-form-box">
        <p className="session-label">Signup</p>

        <div className="names-input-box">
          <label>FIRST NAME<br />
            <input
              type="text"
              value={fname}
              onChange={e => setFname(e.target.value)}
              className="signup-input-box"
            />
          </label>

          <label className="lname-wrapper">LAST NAME
            <input
              type="text"
              value={lname}
              onChange={e => setLname(e.target.value)}
              className="signup-input-box"
            />
          </label>
        </div>

        <div className="email-input-box">
          <label className="">EMAIL</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="signup-input-box"
          />
        </div>

        <div className="email-input-box">
          <label className="">PASSWORD</label>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            className="signup-input-box"
          />
        </div>

        <br />
        <button type="submit" className="form-button">
          Sign up
        </button>
      </form>
    </div>
  );
}

export default withRouter(Register);