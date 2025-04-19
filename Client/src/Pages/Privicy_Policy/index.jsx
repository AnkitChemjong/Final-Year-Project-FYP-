import React from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { FaShieldAlt, FaUserShield, FaLock, FaEye, FaUserSecret, FaClipboardList, FaCookieBite, FaUserTimes, FaEnvelope } from 'react-icons/fa';
import { FiPhoneCall } from "react-icons/fi";

export default function PrivicyPolicy() {
  return (
    <div className="dark:bg-gray-900 dark:text-gray-100">
        <Navbar/>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800 py-12 px-6 md:px-16 lg:px-32">
      <div className="bg-white dark:bg-gray-700 p-8 shadow-lg rounded-lg max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
          <FaShieldAlt className="text-blue-600 dark:text-blue-400 font-heading" /> Privacy Policy
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Welcome to Efficient Pathsala. Your privacy is our priority. This policy explains how we collect, use, and safeguard your information.
        </p>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <FaUserShield className="text-green-500 dark:text-green-400 font-heading" /> Information We Collect
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">We collect personal details such as name, email, and payment details for authentication and transaction purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <FaLock className="text-red-500 dark:text-red-400 font-heading" /> How We Use Your Information
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Your data is used to provide and enhance our services, process payments, and send you updates about our platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <FaEye className="text-yellow-500 dark:text-yellow-400 font-heading" /> Data Protection & Security
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">We implement robust security measures to protect your data from unauthorized access and breaches.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <FaUserSecret className="text-purple-500 dark:text-purple-400 font-heading" /> Third-Party Sharing
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">We do not sell or share your personal data with third parties, except for service providers who assist us in delivering our platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <FaClipboardList className="text-blue-500 dark:text-blue-400 font-heading" /> User Rights & Choices
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">You have the right to access, update, or delete your personal data at any time. Contact us for assistance.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <FaCookieBite className="text-orange-500 dark:text-orange-400 font-heading" /> Cookies & Tracking Technologies
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">We use cookies to enhance your experience. You can manage cookie settings through your browser.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <FaUserTimes className="text-red-500 dark:text-red-400 font-heading" /> Account Deletion
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">If you wish to delete your account, please contact our support team. Your data will be permanently removed within 30 days.</p>
          </section>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mt-8">
          <FiPhoneCall className="text-green-600 dark:text-green-400 font-heading" /> Contact Us
        </h2>
        <p className="text-gray-600 dark:text-gray-300">If you have any questions about this Privacy Policy, please contact us:</p>
        <ul className="text-gray-600 dark:text-gray-300 mt-2 space-y-1">
          <li className="flex items-center gap-2"><FiPhoneCall /> +977 9800000000</li>
          <li className="flex items-center gap-2"><FaEnvelope /> efficientPathsala@gmail.com</li>
        </ul>
      </div>
    </div>
    <Footer />
    </div>
  )
}