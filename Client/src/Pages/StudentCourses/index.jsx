import React from 'react'
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function StudentCourses() {
    const location = useLocation();
  const params = new URLSearchParams(location.search);
  const status=params.get('payment');
  useEffect(() => {
    if (status && status === 'success') {
      toast.success("Payment Successful");
    }
  }, [location.search]);
  return (
    <div>
      
    </div>
  )
}
