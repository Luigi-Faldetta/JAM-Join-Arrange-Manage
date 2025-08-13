import { useState } from "react";
import { useResetPasswordMutation } from "../../services/JamDB";

function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter your email address.');
      setIsSuccess(false);
      return;
    }

    try {
      const result = await resetPassword({ email }).unwrap();
      if (result.success) {
        setMessage('We just sent you an email with a temporary password.');
        setIsSuccess(true);
        setEmail('');
      } else {
        setMessage('Email not found. Please check your email address.');
        setIsSuccess(false);
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      setMessage('An error occurred. Please try again later.');
      setIsSuccess(false);
    }
  };

  return (
    <section className="light:bg-white">
      <div className="flex flex-col items-center justify-center px-8 py-8 mx-auto lg:py-0 h-screen -translate-y-10">

        <div className="w-full p-6 bg-white rounded-lg shadow md:mt-0 sm:max-w-md sm:p-8 h-80">
          <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            Forgot your password?
          </h1>
          <p className="font-light text-gray-500">
            Enter your email and we'll send you a code to reset your password.
          </p>
          <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="name@email.com"
                required
              />
            </div>
            {message && (
              <p className={`mt-2 text-sm font-medium ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                {message}
              </p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : null}
              {isLoading ? 'Sending...' : 'Reset password'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
export default ForgotPasswordPage;
