import React from 'react';
import { Button } from '@/Components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
const navigate=useNavigate();
const goHome=()=>{
navigate("/")
}
  return (
    <div className="relative h-100vh">
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-gray-200">
    <Button onClick={goHome}>Go Home</Button>
  </div>
</div>
  )
}
