import React from 'react';
import { Button } from '../ui/button';

export default function CommonButton({func = () => {},text,disable=false}) {
  return (
    <Button disabled={disable} onClick={func} className="bg-green-600 text-white px-5 py-5 hover:bg-blue-700">{text}</Button>
  )
}
