import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useRef, useState } from "react";
import FontIconWrapper from "./FontIconWrapper";
import { Button } from "primereact/button";
import httpServices from "../services/httpServices";
import API_ENDPOINT_CONSTANTS from "../constants/apiEndpointConstants";
import { Toast } from "primereact/toast";

export default function SignUp() {
  const [showLoading, setShowLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const [signUpCredential, setsignUpCredential] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCountryCode: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const onInputChange = (
    event: any,
    field:
      | "firstName"
      | "lastName"
      | "phoneCountryCode"
      | "phoneNumber"
      | "email"
      | "password"
      | "confirmPassword"
  ) => {
    setsignUpCredential({
      ...signUpCredential,
      [field]: event.target.value,
    });
  };

  const handleSignUp = (event: any) => {
    event.preventDefault();

    if (
      !signUpCredential.firstName ||
      !signUpCredential.lastName ||
      !signUpCredential.email ||
      !signUpCredential.phoneCountryCode ||
      !signUpCredential.phoneNumber ||
      !signUpCredential.password
    ) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Details Missing",
      });
      return;
    }

    if (
      signUpCredential.password.trim() !=
      signUpCredential.confirmPassword.trim()
    ) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Password Mismatch",
      });
      return;
    }

    setShowLoading(true);
    const userDetails: any = {
      firstName: signUpCredential.firstName,
      lastName: signUpCredential.lastName,
      email: signUpCredential.email,
      phoneCountryCode: signUpCredential.phoneCountryCode,
      phoneNumber: signUpCredential.phoneNumber,
      password: signUpCredential.password,
    };
    httpServices
      .post(API_ENDPOINT_CONSTANTS.SIGN_UP, userDetails)
      .then((response) => {
        console.log(response);
        if (response["status"] == "success") {
          localStorage.setItem("userData", JSON.stringify(response["data"]));
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: response?.data?.errorDescription
              ? response?.data?.errorDescription
              : "Something Went Wrong",
          });
        }
      })
      .finally(() => setShowLoading(false));
  };

  return (
    <form onSubmit={handleSignUp}>
      <div className="d-flex flex-column row-gap-2">
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

        <div>
          <label>Email</label>
          <div className="input-field-wrapper">
            <FontIconWrapper
              icon="fa-solid fa-envelope"
              className="input-field-icon"
            ></FontIconWrapper>
            <InputText
              value={signUpCredential.email}
              placeholder="abc@xyz.com"
              className="w-100"
              onInput={(e) => onInputChange(e, "email")}
            />
          </div>
        </div>

        <div>
          <label>Phone Number</label>
          <div className="row">
            <div className="col-12 col-sm-3">
              <InputText
                placeholder="Code"
                value={signUpCredential.phoneCountryCode}
                className="w-100"
                onInput={(e) => onInputChange(e, "phoneCountryCode")}
              />
            </div>

            <div className="col-12 col-sm-9 mt-2 mt-sm-0">
              <InputText
                placeholder="Enter Phone Number"
                value={signUpCredential.phoneNumber}
                className="w-100"
                onInput={(e) => onInputChange(e, "phoneNumber")}
              />
            </div>
          </div>
        </div>

        <div>
          <label>Password</label>
          <div className="input-field-wrapper">
            <FontIconWrapper
              icon="fa-solid fa-key"
              className="input-field-icon"
            ></FontIconWrapper>
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
        </div>

        <div>
          <label>Confirm Password</label>
          <div className="input-field-wrapper">
            <FontIconWrapper
              icon="fa-solid fa-key"
              className="input-field-icon"
            ></FontIconWrapper>
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
        </div>

        <Button
          className="mt-4"
          icon="pi pi-check"
          loading={showLoading}
          label="Create Account"
          type="submit"
        />
      </div>
      <Toast ref={toast} />
    </form>
  );
}
