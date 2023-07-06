import { useState, useRef } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { UserState, createUser } from "../../reduxFiles/slices/users";
import {
  useLogInMutation,
} from "../../services/ThesisDB";
import { Link, useLocation, useNavigate } from "react-router-dom";

function LoginForm() {
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(<FaEyeSlash />);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [loginUser] = useLogInMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const currentRoute = location.pathname;
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userFormData: UserState = {
      email: emailInputRef.current?.value || "",
      password: passwordInputRef.current?.value || "",
    };
    await onLogIn(userFormData);
  };
  const onLogIn = async (userFormData: { email: string; password: string }) => {
    try {
      const res = await loginUser(userFormData);
      if ("data" in res && res.data.data) {
        localStorage.setItem("token", res.data.data);
        setPasswordMatch(true);
        emailInputRef.current!.value = "";
        passwordInputRef.current!.value = "";
        if (currentRoute === "/") {
          navigate("/user-dashboard");
        } else {
          window.location.reload();
        }
      } else if ("error" in res && res.error) {
        console.error(res.error);
        setPasswordMatch(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = () => {
    if (type === "password") {
      setIcon(<FaEye />);
      setType("text");
    } else {
      setIcon(<FaEyeSlash />);
      setType("password");
    }
  };
  return (
    <>
      <form method="dialog" className="modal-box  dark:border-2 border-white" onSubmit={handleFormSubmit}>
        <h3 className="font-bold text-xl">Log In</h3>

        <div className="mb-8">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium light:text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            type="email"
            id="email-input"
            className="shadow-sm bg-gray-50 border border-gray-300 light:text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Your email"
            required
            ref={emailInputRef}
          />
        </div>
        <div className="mb-8">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium light:text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <div className="relative">
            <input
              type={type}
              id="password-input"
              placeholder="Your password"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              required
              ref={passwordInputRef}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute top-3 right-3 cursor-pointer"
              onClick={handleToggle}
              style={{ color: "#555", zIndex: 1 }}
            >
              {icon}
            </span>
          </div>
          {!passwordMatch && (
            <p className="text-red-500 text-xm mt-1">
              Invalid email or password.
            </p>
          )}
       <Link to="/passwordreset" className="block mt-2 text-sm font-medium light:text-gray-900 dark:text-white hover:text-blue-500 hover:underline">Forgot password?</Link>
        </div>
        <button
          type="submit"
          id="login"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 m-3"
        >
          Log In
        </button>
      </form>
    </>
  );
}
export default LoginForm;
