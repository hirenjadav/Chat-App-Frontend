import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./HomePage.scss";

export default function HomePage() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    const routeArr: string[] = location.pathname.split("/");
    let currentPageUrl: string = "";
    if (routeArr.length) {
      currentPageUrl = routeArr[routeArr.length - 1];
      setCurrentPage(currentPageUrl);
    }
  }, [location]);

  return (
    <div className="container-md min-vh-100 h-100 d-flex justify-content-center align-items-center">
      <div className="auth-page-wrapper">
        <div className="page-content">
          <div className="page-title mb-4">
            {currentPage == "signin" && <h2>Login to your account</h2>}
            {currentPage == "forgot-password" && (
              <h2>Enter your registered email</h2>
            )}
            {currentPage == "signup" && <h2>Create your account</h2>}
          </div>

          <Outlet />
        </div>

        {currentPage == "login" || currentPage == "forgot-password" ? (
          <p className="mt-2 text-center">
            Didn't have an account?
            <Link className="ms-1 text-decoration-none" to={"signup"}>
              Create an account
            </Link>
          </p>
        ) : (
          <p className="mt-2 text-center">
            Already have an account?
            <Link className="ms-1 text-decoration-none" to={"signin"}>
              Signin
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
