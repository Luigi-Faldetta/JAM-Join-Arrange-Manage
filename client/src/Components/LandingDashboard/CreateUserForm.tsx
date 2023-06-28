import { useRef, useState } from "react";
import { UserState, createUser } from "../../reduxFiles/slices/users";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";

function CreateUserForm() {
  const [open, setOpen] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(<FaEyeSlash />);
  const dispatch = useDispatch();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const repeatPasswordInputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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

    console.log(userFormData);
    dispatch(createUser(userFormData));
    setOpen(false);
    setPasswordMatch(true);
    emailInputRef.current!.value = "";
    phoneInputRef.current!.value = "";
    passwordInputRef.current!.value = "";
    repeatPasswordInputRef.current!.value = "";
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
      <button className="text-blue-700 hover:text-blue-800 text-sm font-medium underline mt-2" onClick={() => setOpen(true)}>
        Sign Up
      </button>
      <dialog id="my_modal_3" className="modal" open={open}>
        <form method="dialog" className="modal-box" onSubmit={handleFormSubmit}>
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">Sign Up Here</h3>

          <div className="mb-6">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your name
            </label>
            <input
              type="text"
              id="name"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Your name"
              required
              ref={nameInputRef}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Your email"
              required
              ref={emailInputRef}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your password
            </label>
            <div className="relative">
              <input
                type={type}
                id="password"
                placeholder="Your password"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
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
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Repeat password
            </label>
            <div className="relative">
              <input
                type={type}
                id="repeat-password"
                placeholder="Repeat password"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
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
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Register new account
          </button>
        </form>
      </dialog>
    </>
  );
}

export default CreateUserForm;
