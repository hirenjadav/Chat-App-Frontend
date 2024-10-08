import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState } from "react";
import FontIconWrapper from './FontIconWrapper';
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import httpServices from "../services/httpServices";
import API_ENDPOINT_CONSTANTS from "../constants/apiEndpointConstants";

export default function SignUp() {
  const [showLoading, setShowLoading] = useState(false);

  const [signUpCredential, setsignUpCredential] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onInputChange = (event: any, field: "firstName" | "lastName" | "email" | "password" | "confirmPassword") => {
    setsignUpCredential({
      ...signUpCredential,
      [field]: event.target.value,
    });
  };

  const handleSignUp = (event: any) => {
    event.preventDefault();
    httpServices
      .post(API_ENDPOINT_CONSTANTS.SIGN_UP, signUpCredential)
      .then(response => {
        console.log(response);
      });
  }

  return (
    <form onSubmit={handleSignUp}>
      <div className="d-flex flex-column">

        <div className="row">
          <div className="col-12 col-sm-6">
            <label>First Name</label>
            <InputText
              placeholder="Enter First Name"
              value={signUpCredential.firstName}
              className="w-100"
              onInput={(e) => onInputChange(e, "firstName")}
            />
          </div>

          <div className="col-12 col-sm-6">
            <label>Last Name</label>
            <InputText
              placeholder="Enter Last Name"
              value={signUpCredential.lastName}
              className="w-100"
              onInput={(e) => onInputChange(e, "lastName")}
            />
          </div>

        </div>

        <label>Email</label>
        <div className="input-field-wrapper">
          <FontIconWrapper icon="fa-solid fa-envelope" className="input-field-icon"></FontIconWrapper>
          <InputText
            value={signUpCredential.email}
            placeholder="abc@xyz.com"
            className="w-100"
            onInput={(e) => onInputChange(e, "email")}
          />
        </div>

        <label className="mt-3">Password</label>
        <div className="input-field-wrapper">
          <FontIconWrapper icon="fa-solid fa-key" className="input-field-icon"></FontIconWrapper>
          <Password
            value={signUpCredential.password}
            onChange={(e) => onInputChange(e, "password")}
            className="w-100"
            placeholder="************"
            inputClassName="w-100"
            toggleMask={true}
            feedback={false}
          />
        </div>

        <label className="mt-3">Confirm Password</label>
        <div className="input-field-wrapper">
          <FontIconWrapper icon="fa-solid fa-key" className="input-field-icon"></FontIconWrapper>
          <Password
            value={signUpCredential.confirmPassword}
            onChange={(e) => onInputChange(e, "confirmPassword")}
            className="w-100"
            placeholder="************"
            inputClassName="w-100"
            toggleMask={true}
            feedback={false}
          />
        </div>

        <Button
          className="mt-4"
          icon="pi pi-check"
          loading={showLoading}
          label="Create Account"
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
