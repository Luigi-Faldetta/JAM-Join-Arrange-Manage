import { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { Link as Scroll } from "react-scroll";
import { useAppDispatch } from "../../reduxFiles/store";
import { openLogout } from "../../reduxFiles/slices/logout";
import { useIsLoggedIn } from "../../utils/useIsLoggedIn";
import { useLocation } from "react-router-dom";
import { useClickAway } from "@uidotdev/usehooks";
import { useGetUserQuery } from "../../services/ThesisDB";
import Chat from "../Chat/Chat";

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdownMobile, setDropdownMobile] = useState(false);
  const isLoggedIn = useIsLoggedIn();
  const ref = useClickAway(() => {
    setShowDropdown(false);
    setDropdownMobile(false);
  });

  const dispatch = useAppDispatch();
  const location = useLocation();

  const handleAvatarClick = () => {
    setShowDropdown(!showDropdown);
    if (showDropdownMobile) {
      setDropdownMobile(false);
    }
  };

  const handleMobileMenu = () => {
    setDropdownMobile(!showDropdownMobile);
    if (setShowDropdown) {
      setShowDropdown(false);
    }
  };
  const handleSignOut = () => {
    dispatch(openLogout());
    setShowDropdown(false);
  };

  const uid = localStorage.getItem("token");
  // useAuth();
  //@ts-ignore
  const { data } = useGetUserQuery(uid);

  return (
    <div className="navbar-container bg-white flex justify-center" id="navbar">
      <nav className="w-4/5 border-gray-200 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between mx-auto py-3">
          <div className="flex items-center">
            <Link to="/" className="flex mr-12 items-center">
              <img
                src="https://res.cloudinary.com/dpzz6vn2w/image/upload/v1688551951/logo-jam_hj6qmj.png"
                className="h-12 mr-3"
                alt="JAM Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                JAM
              </span>
            </Link>

            {location.pathname === "/" && (
              <div
                className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${showDropdownMobile ? "block" : "hidden"
                  }`}
                id="mobile-menu-2"
              >
                <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                  <li>
                    <Scroll
                      onClick={handleMobileMenu}
                      to="hero"
                      id="tohero"
                      spy={true}
                      smooth={true}
                      offset={-190}
                      duration={500}
                      className="block py-2 px-4 text-gray-900  md:hover:text-pink-500 md:p-0 "
                      aria-current="page"
                    >
                      Home
                    </Scroll>
                  </li>
                  <li>
                    <Scroll
                      onClick={handleMobileMenu}
                      to="about"
                      id="toabout"
                      spy={true}
                      smooth={true}
                      offset={-72}
                      duration={500}
                      className="block py-2 pl-3 pr-4 text-gray-900  md:hover:text-pink-500 md:p-0 "
                    >
                      About
                    </Scroll>
                  </li>
                  <li>
                    <Scroll
                      onClick={handleMobileMenu}
                      to="faqs"
                      id="tofaqs"
                      spy={true}
                      smooth={true}
                      offset={-180}
                      duration={500}
                      className="block py-2 pl-3 pr-4 text-gray-900  md:hover:text-pink-500 md:p-0 "
                    >
                      FAQs
                    </Scroll>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div>
            {isLoggedIn && (
              <div className="flex items-center gap-5">
                <Link
                  to="/user-dashboard"
                  className="font-medium dashboard-btn  text-gray-900  md:hover:text-pink-500 md:p-0 "
                >
                  Dashboard
                </Link>

                <Chat />

                <button
                  type="button"
                  className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  id="user-menu-button"
                  aria-expanded={showDropdown ? "true" : "false"}
                  onClick={handleAvatarClick}
                  data-dropdown-toggle="user-dropdown"
                  data-dropdown-placement="bottom"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="profile-pic w-8 h-8 rounded-full"
                    src={
                      data?.data.profilePic || "./no-profile-picture-icon.png"
                    }
                    alt=""
                  />
                </button>
              </div>
            )}

            {showDropdown && (
              <div className="dropdown-menu" ref={ref}>
                <ul>
                  <li>
                    <Link
                      to="/profile"
                      id="profile-btn"
                      className="dropdown-item"
                      onClick={handleAvatarClick}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button id="signout-btn" onClick={handleSignOut} className="dropdown-item">
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            )}

            {location.pathname === "/" && (
              <button
                data-collapse-toggle="mobile-menu-2"
                type="button"
                className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="mobile-menu-2"
                aria-expanded={showDropdownMobile ? "true" : "false"}
                onClick={handleMobileMenu}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
export default Navbar;
