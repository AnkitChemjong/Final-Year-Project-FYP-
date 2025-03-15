import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommonButton from '@/Components/CommonButton';

export default function NotFound() {
  const navigate = useNavigate();
  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="relative h-screen bg-gray-100 flex justify-center items-center">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
        <p className="text-lg text-gray-600 mb-6">The page you are looking for cannot be found.</p>
        <p className="text-sm text-gray-500 mb-8">It seems like you've reached a broken link or a non-existent page.</p>
        <CommonButton func={goHome} text="Go Home"/>
        </div>
    </div>
  );
}
