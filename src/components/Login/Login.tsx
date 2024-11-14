import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import FontIconWrapper from "../FontIconWrapper";
import { Button } from "primereact/button";
import httpServices from "../../services/httpServices";
import API_ENDPOINT_CONSTANTS from "../../constants/apiEndpointConstants";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  userDetailsActions,
  userDetailsSelector,
} from "../../state/userDetailsSlice";
import authService from "../../services/authService";

export default function Login() {
  const [showLoading, setShowLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const userId: string | null = useSelector(userDetailsSelector.userId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) navigate("/chat");
  }, [userId, navigate]);

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
          dispatch(userDetailsActions.setUserDetails(response["data"]));
          authService.setAccessToken(response["data"]["accessToken"]);
          navigate("/chat");
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
      <div className="flex flex-col gap-y-4">
        <div>
          <label>Email</label>
          <div className="relative">
            <FontIconWrapper
              icon="fa-solid fa-user"
              className="absolute left-3 top-1/2 z-[1] -translate-y-1/2"
            ></FontIconWrapper>
            <InputText
              placeholder="abc@xyz.com"
              className="w-full ps-8"
              value={loginCredential.email}
              onInput={(e) => onInputChange(e, "email")}
            />
          </div>
        </div>

        <div>
          <label>Password</label>
          <div className="relative">
            <FontIconWrapper
              icon="fa-solid fa-key"
              className="absolute left-3 top-1/2 z-[1] -translate-y-1/2"
            />
            <Password
              placeholder="************"
              className="w-full"
              inputClassName="w-full ps-8"
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
