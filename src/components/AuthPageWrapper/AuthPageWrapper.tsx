import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import "./AuthPageWrapper.scss";
import FontIconWrapper from '../FontIconWrapper';

export default function AuthPageWrapper() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('');


  useEffect(() => {
    const routeArr: string[] = location.pathname.split('/');
    let currentPageUrl: string = '';
    if (routeArr.length) {
      currentPageUrl = routeArr[routeArr.length - 1];
      setCurrentPage(currentPageUrl);
    }
  }, [location]);


  return (
    <div className="page-container container-md">

      <div className="auth-page-wrapper">

        <div className="page-content">

          <div className="page-title mb-4">
            <FontIconWrapper className="diamond-icon" icon="fa-regular fa-gem" />
            <h2 className="mt-2">Welcome Back</h2>

            {currentPage == 'signin' && <p>Login to your account</p>}
            {currentPage == 'forgot-password' && <p>Enter your registered email</p>}
            {currentPage == 'signup' && <p>Fill the details</p>}
          </div>

          <Outlet />

        </div>

        {
          (currentPage == 'signin' || currentPage == 'forgot-password') ?
            <p className="mt-2 text-center">
              Didn't have an account?
              <Link className="ms-1 text-decoration-none" to={'signup'}>Create an account</Link>
            </p> :
            <p className="mt-2 text-center">
              Already have an account?
              <Link className="ms-1 text-decoration-none" to={'signin'}>Signin</Link>
            </p>
        }

      </div>

    </div>
  )
}
