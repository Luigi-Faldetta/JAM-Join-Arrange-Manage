import LoginForm from "../../Components/LandingDashboard/LoginForm";
import CreateUserForm from "../../Components/LandingDashboard/CreateUserForm";
import "./LandingPage.css";
import { useState } from "react";
import { useIsLoggedIn } from "../../utils/useIsLoggedIn";
import { useLocation } from "react-router-dom";

const LandingPage = ({data} : any) => {
  const [loginFormActive, setLoginFormActive] = useState(false);
  const location = useLocation();
  const currentRoute = location.pathname;
  const isLoggedIn = useIsLoggedIn();

  const handleGetStartedClick = () => {
    setLoginFormActive(!loginFormActive);
  };

  return (
    <section
      className="landing-page dark:bg-gray-900 lg:mt-9"
      id="hero"
    >
      <div className="grid max-w-screen-xl px-4 mx-auto xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7">
        {currentRoute === '/' ? (
          <>
          <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
            Join. Arrange. Manage.
          </h1>
          <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
            From splitting bills and organizing todos to planning all your
            events.
          </p>
          </>
          ) : (
            <h1 className="max-w-2xl mb-4 text-4xl font-bold tracking-tight leading-none md:text-5xl xl:text-3xl dark:text-white">You were invited to {data?.data.title}. If you want to join, please log in.</h1> 
          )}
          {!isLoggedIn ? (
          <button
            onClick={handleGetStartedClick}
            className="hidden lg:inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-black rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            Get started
            <svg
              className="w-5 h-5 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          ) : null}
        </div>
        <div className={`lg:col-span-5 ${loginFormActive ? "active" : ""}`}>
  {!isLoggedIn ? (
    <div className="login-form  lg:flex lg:flex-col">
      <LoginForm />
      <CreateUserForm />
    </div>
  ) : (
    <div className="image-container">
      <img src="https://hips.hearstapps.com/hmg-prod/images/delish-190605-raspberry-jam-031-landscape-pf-1560443834.jpg?crop=0.888532477947073xw:1xh;center,top&resize=1200:*" alt="Your Image" />
    </div>
  )}
</div>
      </div>
    </section>
  );
};

export default LandingPage;
