import { useState } from "react";
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';

function ContactUs() {
  const SERVICE_ID = 'service_heks6q1';
  const TEMPLATE_ID = 'template_d2wfwid';
  const USER_ID = 'pL8ttfxEAHP6G7Dhh';
  const [newEmail, setEmail] = useState("");
  const [message, setMessage] = useState('');

  const templateParams: Record<string, unknown> = {
    email: newEmail,
    message: message,
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setEmail(newEmail)
    setMessage(message)
    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID)
      .then((result) => {
        console.log(result.text);
        Swal.fire({
          icon: 'success',
          title: 'Your message is submitted. You can expect to hear back from us within the next two weeks.',
        });
      })
      .catch((error) => {
        console.log(error.text);
        Swal.fire({
          icon: 'error',
          title: 'Ooops, something went wrong',
          text: error.text,
        });
      });
    setEmail('')
    setMessage('')
  };

  return (
    <section className="light:bg-white">
      <div className="flex flex-col items-center justify-center px-8 py-8 mx-auto lg:py-0 h-screen -translate-y-10">

        <div className="w-full p-6 bg-white rounded-lg shadow md:mt-0 sm:max-w-md sm:p-8">
          <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            Contact us
          </h1>
          <p className="font-light text-gray-500">
            Enter your email and your message.
          </p>
          <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                name="email"
                id="email"
                value={newEmail}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="name@email.com"
              />
            </div>
            <textarea onChange={(e) => setMessage(e.target.value)} value={message} placeholder="Type your message here" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />

            <button
              type="submit"
              className="w-full text-white bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
export default ContactUs;