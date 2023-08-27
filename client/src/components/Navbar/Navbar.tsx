import { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { Link as Scroll } from "react-scroll";
import { useAppDispatch } from "../../reduxFiles/store";
import { openLogout } from "../../reduxFiles/slices/logout";
import { useIsLoggedIn } from "../../utils/useIsLoggedIn";
import { useLocation } from "react-router-dom";
import { useClickAway } from "@uidotdev/usehooks";
import { useGetUserQuery } from "../../services/JamDB";
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
  //@ts-ignore
  const { data } = useGetUserQuery(uid);

  return (
    <div className="navbar-container bg-white flex justify-center" id="navbar">
      <nav className="w-fit md:w-4/5 border-gray-200">
        <div className="flex flex-wrap items-center justify-between mx-auto py-3">
          <div className="flex items-center">
            <Link to="/" className="flex mr-12 items-center">
              <img
                src="https://res.cloudinary.com/dpzz6vn2w/image/upload/v1688644579/jam-strw_irm1ti.png"
                className="h-12 mr-3"
                alt="JAM Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-black">
                JAM
              </span>
            </Link>

            {location.pathname === "/" && (
              <div
                className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${showDropdownMobile ? "block" : "hidden"
                  }`}
                id="mobile-menu-2"
              >
                <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
                  <li>
                    <Scroll
                      onClick={handleMobileMenu}
                      to="hero"
                      id="tohero"
                      spy={true}
                      smooth={true}
                      offset={-190}
                      duration={500}
                      className="block py-2 px-4 text-gray-900 md:hover:text-pink-500 md:p-0 "
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
                      className="block py-2 pl-3 pr-4 text-gray-900 md:hover:text-pink-500 md:p-0 "
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
                      offset={-100}
                      duration={500}
                      className="block py-2 pl-3 pr-4 text-gray-900 md:hover:text-pink-500 md:p-0 "
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
                  className="font-medium dashboard-btn  text-gray-900 md:hover:text-pink-500 md:p-0 "
                >
                  Dashboard
                </Link>
                <Chat />
                <button
                  type="button"
                  className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300"
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
                    <button
                      id="signout-btn"
                      onClick={handleSignOut}
                      className="dropdown-item"
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
export default Navbar;
