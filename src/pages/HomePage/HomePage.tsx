import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

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
    <div className="flex h-full min-h-screen items-center justify-center">
      <div className="w-100 min-w-[350px] max-w-[550px]">
        <div className="rounded-3xl border border-black bg-white p-8">
          <div className="mb-4 flex flex-col justify-center text-center">
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
            <Link className="text-decoration-none ms-1" to={"signup"}>
              Create an account
            </Link>
          </p>
        ) : (
          <p className="mt-2 text-center">
            Already have an account?
            <Link className="text-decoration-none ms-1" to={"signin"}>
              Signin
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
