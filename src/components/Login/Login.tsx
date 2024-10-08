import { InputText } from "primereact/inputtext";
import { useRef, useState } from "react";
import FontIconWrapper from "../FontIconWrapper";
import { Button } from "primereact/button";
import httpServices from "../../services/httpServices";
import API_ENDPOINT_CONSTANTS from "../../constants/apiEndpointConstants";
import "./Login.scss";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";

export default function SignIn() {
  const [showLoading, setShowLoading] = useState(false);
  const toast = useRef<Toast>(null);

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

    if (!loginCredential.email || !loginCredential.password) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Details Missing",
      });
      return;
    }

    setShowLoading(true);
    const userDetails: any = {
      email: loginCredential.email,
      password: loginCredential.password,
    };

    httpServices
      .post(API_ENDPOINT_CONSTANTS.LOGIN, userDetails)
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
    <form onSubmit={handleSignIn}>
      <div className="d-flex flex-column row-gap-2">
        <div>
          <label>Email</label>
          <div className="input-field-wrapper">
            <FontIconWrapper
              icon="fa-solid fa-user"
              className="input-field-icon"
            ></FontIconWrapper>
            <InputText
              placeholder="abc@xyz.com"
              className="w-100"
              value={loginCredential.email}
              onInput={(e) => onInputChange(e, "email")}
            />
          </div>
        </div>

        <div>
          <label>Password</label>
          <div className="input-field-wrapper">
            <FontIconWrapper
              icon="fa-solid fa-key"
              className="input-field-icon"
            />
            <Password
              placeholder="************"
              className="w-100"
              inputClassName="w-100"
              toggleMask
              value={loginCredential.password}
              onChange={(e) => onInputChange(e, "password")}
              feedback={false}
            />
            {/* <InputOtp
            value={loginCredential.otp}
            length={6}
            onChange={(e) => onInputChange(e, "otp")}
          /> */}
          </div>
        </div>

        {/* <div className="mt-1">
          <Link to={"/auth/forgot-password"} className="link-style-none">
            Forgot Password?
          </Link>
        </div> */}

        <Button
          className="mt-4"
          icon="pi pi-check"
          loading={showLoading}
          label="Sign In"
          type="submit"
        />
      </div>
      <Toast ref={toast} />
    </form>
  );
}
