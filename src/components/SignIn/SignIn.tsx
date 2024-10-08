import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState } from "react";
import FontIconWrapper from '../FontIconWrapper';
import { Button } from "primereact/button";
import httpServices from "../../services/httpServices";
import API_ENDPOINT_CONSTANTS from "../../constants/apiEndpointConstants";
import { Link } from "react-router-dom";
import "./SignIn.scss";

export default function SignIn() {
  const [showLoading, setShowLoading] = useState(false);

  const [loginCredential, setLoginCredential] = useState({
    email: "",
    password: "",
  });

  const onInputChange = (event: any, field: "email" | "password") => {
    switch (field) {
      case "email":
        setLoginCredential({
          ...loginCredential,
          email: event.target.value,
        });
        break;

      case "password":
        setLoginCredential({
          ...loginCredential,
          password: event.target.value,
        });
        break;
    }
  };

  const handleSignIn = (event: any) => {
    event.preventDefault();
    setShowLoading(true);
    httpServices
      .post(API_ENDPOINT_CONSTANTS.LOGIN, loginCredential)
      .then(response => {
        setShowLoading(false);
        console.log(response);
      });
  }

  return (
    <form onSubmit={handleSignIn}>

      <div className="d-flex flex-column">

        <label>Email</label>
        <div className="input-field-wrapper">
          <FontIconWrapper icon="fa-solid fa-user" className="input-field-icon"></FontIconWrapper>
          <InputText
            placeholder="abc@xyz.com"
            className="w-100"
            value={loginCredential.email}
            onInput={(e) => onInputChange(e, "email")}
          />
        </div>

        <label className="mt-3">Password</label>
        <div className="input-field-wrapper">
          <FontIconWrapper icon="fa-solid fa-key" className="input-field-icon" />
          <Password
            placeholder="************"
            className="w-100"
            inputClassName="w-100"
            toggleMask
            value={loginCredential.password}
            onChange={(e) => onInputChange(e, "password")}
            feedback={false}
          />
        </div>

        <div className="mt-1">
          <Link to={'/auth/forgot-password'} className="link-style-none">
            Forgot Password?
          </Link>
        </div>

        <Button
          className="mt-4"
          icon="pi pi-check"
          loading={showLoading}
          label="Sign In"
          type="submit" />

        <hr />

        <Link to="/auth/signin">
          <Button
            className="w-100"
            disabled={showLoading}
            label="Continue with Google"
            type="button"
            outlined />
        </Link>

      </div>
    </form>
  );
}
