import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useEffect, useRef, useState } from "react";
import FontIconWrapper from "./FontIconWrapper";
import { Button } from "primereact/button";
import httpServices from "../services/httpServices";
import API_ENDPOINT_CONSTANTS from "../constants/apiEndpointConstants";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  userDetailsActions,
  userDetailsSelector,
} from "../state/userDetailsSlice";
import authService from "../services/authService";

export default function SignUp() {
  const [showLoading, setShowLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const userId: string = useSelector(userDetailsSelector.userId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) navigate("/chat");
  }, [userId, navigate]);

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
      | "confirmPassword",
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
    <form onSubmit={handleSignUp}>
      <div className="flex flex-col gap-y-4">
        <div className="grid w-full grid-cols-2 gap-x-4">
          <div className="w-full">
            <label>First Name</label>
            <InputText
              placeholder="Enter First Name"
              value={signUpCredential.firstName}
              className="w-full"
              onInput={(e) => onInputChange(e, "firstName")}
            />
          </div>

          <div className="w-full">
            <label>Last Name</label>
            <InputText
              placeholder="Enter Last Name"
              value={signUpCredential.lastName}
              className="w-full"
              onInput={(e) => onInputChange(e, "lastName")}
            />
          </div>
        </div>

        <div>
          <label>Email</label>
          <div className="relative">
            <FontIconWrapper
              icon="fa-solid fa-envelope"
              className="absolute left-3 top-1/2 z-[1] -translate-y-1/2"
            ></FontIconWrapper>
            <InputText
              value={signUpCredential.email}
              placeholder="abc@xyz.com"
              className="w-full ps-8"
              onInput={(e) => onInputChange(e, "email")}
            />
          </div>
        </div>

        <div>
          <label>Phone Number</label>
          <div className="grid grid-cols-3 gap-x-4">
            <div className="col-span-1">
              <InputText
                placeholder="Code"
                value={signUpCredential.phoneCountryCode}
                className="w-full"
                onInput={(e) => onInputChange(e, "phoneCountryCode")}
              />
            </div>

            <div className="col-span-2">
              <InputText
                placeholder="Enter Phone Number"
                value={signUpCredential.phoneNumber}
                className="w-full"
                onInput={(e) => onInputChange(e, "phoneNumber")}
              />
            </div>
          </div>
        </div>

        <div>
          <label>Password</label>
          <div className="relative">
            <FontIconWrapper
              icon="fa-solid fa-key"
              className="absolute left-3 top-1/2 z-[1] -translate-y-1/2"
            ></FontIconWrapper>
            <Password
              value={signUpCredential.password}
              onChange={(e) => onInputChange(e, "password")}
              className="w-full"
              pt={{ iconField: { className: "w-full" } }}
              placeholder="************"
              inputClassName="w-full ps-8"
              toggleMask={true}
              feedback={false}
            />
          </div>
        </div>

        <div>
          <label>Confirm Password</label>
          <div className="relative">
            <FontIconWrapper
              icon="fa-solid fa-key"
              className="absolute left-3 top-1/2 z-[1] -translate-y-1/2"
            ></FontIconWrapper>
            <Password
              value={signUpCredential.confirmPassword}
              onChange={(e) => onInputChange(e, "confirmPassword")}
              className="w-full"
              pt={{ iconField: { className: "w-full" } }}
              placeholder="************"
              inputClassName="w-full ps-8"
              toggleMask={true}
              feedback={false}
            />
          </div>
        </div>

        <Button
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
