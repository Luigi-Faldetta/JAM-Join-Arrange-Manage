import './footer.css'
import React from 'react';
import { FiMail } from 'react-icons/fi';
import { FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footerX bg-white border-gray-200 flex justify-between">
      <p className="text-gray-600">Copyright © 2023 - All rights reserved</p>
      <div className="flex items-center">
        <a
          href="/contactus"
          className="text-gray-600 hover:text-pink-500 mr-4"
        >
          <FiMail size={20} />
        </a>
        <a
          href="https://www.linkedin.com/company/96443199/admin/feed/posts/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-pink-500"
        >
          <FaLinkedin size={20} />
        </a>
      </div>
    </footer>
  );
}
export default Footer;

