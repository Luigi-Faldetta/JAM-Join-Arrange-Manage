import { useRef, useState } from "react";
import { UserState, createUser } from "../../reduxFiles/slices/users";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useAddUserMutation } from "../../services/ThesisDB";
import { ApiResponse } from "../../services/ApiResponseType";
import { useLocation, useNavigate } from "react-router-dom";

function CreateUserForm() {
  const [open, setOpen] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(<FaEyeSlash />);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const repeatPasswordInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate()
  const location = useLocation();
  const [addNewUser] = useAddUserMutation();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const password = passwordInputRef.current?.value || "";
    const repeatPassword = repeatPasswordInputRef.current?.value || "";
    if (password !== repeatPassword) {
      setPasswordMatch(false);
      return;
    }
    const userFormData: UserState = {
      name: nameInputRef.current?.value || "",
      email: emailInputRef.current?.value || "",
      password: passwordInputRef.current?.value || "",
    };
    registerUser(userFormData);
    setOpen(false);
    setPasswordMatch(true);
    nameInputRef.current!.value = "";
    emailInputRef.current!.value = "";
    passwordInputRef.current!.value = "";
    repeatPasswordInputRef.current!.value = "";
  };

  const registerUser = async (userFormData: any) => {
    try {
      const currentRoute = location.pathname;
      const res = await addNewUser(userFormData);

      if ("data" in res && res.data.data ) {
        //@ts-ignore
        localStorage.setItem("token", res.data.data.userId);
      } else if ("error" in res && res.error) {
        console.error(res.error);
      }

      if (currentRoute === "/") {
        navigate("/user-dashboard");
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error(error)
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
      <div className="flex items-center justify-center mt-2">
        <div className="text-black text-sm font-medium">
          Don't have an account yet?
        </div>
        <button
          className="text-blue-700 hover:text-blue-800 text-sm font-medium underline ml-2 "
          style={{ zIndex: 2 }}
          onClick={() => setOpen(true)}
        >
          Sign Up
        </button>
      </div>
      <dialog id="my_modal_3" className="modal" open={open}>
        <form method="dialog" className="modal-box bg-white" onSubmit={handleFormSubmit}>
          <div
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-black"
            onClick={() => setOpen(false)}
          >
            ✕
          </div>
          <h3 className="font-bold text-lg text-black">Sign Up Here</h3>

          <div className="mb-6">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your name
            </label>
            <input
              type="text"
              id="name"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Your name"
              required
              ref={nameInputRef}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Your email"
              required
              ref={emailInputRef}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your password
            </label>
            <div className="relative">
              <input
                type={type}
                id="password"
                placeholder="Your password"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
                ref={passwordInputRef}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute top-2 right-2 cursor-pointer"
                onClick={handleToggle}
                style={{ color: "#555", zIndex: 1 }}
              >
                {icon}
              </span>
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="repeat-password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Repeat password
            </label>
            <div className="relative">
              <input
                type={type}
                id="repeat-password"
                placeholder="Repeat password"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
                ref={repeatPasswordInputRef}
              />
              <span
                className="absolute top-2 right-2 cursor-pointer"
                onClick={handleToggle}
                style={{ color: "#555", zIndex: 1 }}
              >
                {icon}
              </span>
            </div>
            {!passwordMatch && (
              <p className="text-red-500 text-xs mt-1">
                Passwords do not match.
              </p>
            )}
          </div>

          <button
            type="submit"
            id="login-btn"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Register new account
          </button>
        </form>
      </dialog>
    </>
  );
}

export default CreateUserForm;
