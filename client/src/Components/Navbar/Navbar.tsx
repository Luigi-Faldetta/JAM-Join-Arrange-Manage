import { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { Link as Scroll } from "react-scroll";
import { useAuth } from "../../utils/useAuth";
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
    setShowDropdown(false)
    setDropdownMobile(false)
  })

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
  //@ts-ignore
  const { data } = useGetUserQuery(uid);

  return (
    <div className="navbar-container" id='navbar'>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-around mx-auto p-4">
          <Link to="/" className="flex items-center">
            <img
              src="logo-jam.png"
              className="h-12 mr-3"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              JAM
            </span>
          </Link>
          {isLoggedIn && <Chat />}
            <div className="flex items-center md:order-2">
          {isLoggedIn && (
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
                  src={data?.data.profilePic || './no-profile-picture-icon.png'}
                  alt=""
                />
              </button>
                )}
              {showDropdown && (
                <div className="dropdown-menu" ref={ref}>
                  <ul>
                    <li>
                      <Link to="/profile" className="dropdown-item" onClick={handleAvatarClick}>
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/user-dashboard" className="dropdown-item" onClick={handleAvatarClick}>
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleSignOut} className="dropdown-item">
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

          <div
            className={`items-center justify-between w-full md:flex md:w-auto md:order-1  ${
              showDropdownMobile ? "block" : "hidden"
            }`}
            ref={ref}
            id="mobile-menu-2"
          >
              <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  {/* <Link to="/" className="dropdown-item"> */}
                  <Scroll
                    to="hero"
                    spy={true}
                    smooth={true}
                    offset={50}
                    duration={500}
                    className="block py-2 px-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    aria-current="page"
                  >
                    Home
                  </Scroll>
                  {/* </Link> */}
                </li>
                <li>
                  {/* <Link to="/about" className="dropdown-item"> */}
                  <Scroll
                    to="about"
                    spy={true}
                    smooth={true}
                    offset={50}
                    duration={500}
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    About
                  </Scroll>
                  {/* </Link> */}
                </li>
                <li>
                  {/* <Link to="/faqs" className="dropdown-item"> */}
                  <Scroll
                    to="faqs"
                    spy={true}
                    smooth={true}
                    offset={50}
                    duration={500}
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    FAQs
                  </Scroll>
                  {/* </Link> */}
                </li>
              </ul>
          </div>
          
        </div>
      </nav>
    </div>
  );
}
export default Navbar;
