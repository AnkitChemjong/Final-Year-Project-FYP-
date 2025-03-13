import React from 'react';
import { Dialog,DialogContent,DialogHeader,DialogTitle
    ,DialogDescription,DialogFooter
 } from '../ui/dialog';
 import { useNavigate } from 'react-router-dom';
 import { FaChevronLeft } from "react-icons/fa";
import { Button } from '../ui/button';
export default function CourseNotBoughtDialog({lockView,setLockView}) {
    const navigate=useNavigate();
  return (
    <Dialog open={lockView}>
        <DialogContent className="sm:w-[425px]">
            <DialogHeader>
                <DialogTitle>You can't view this course.</DialogTitle>
                <DialogDescription>
                    Please purchase this course first.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
            <Button onClick={()=>navigate(-1)} className="bg-green-600 text-white px-5 py-2 hover:bg-blue-700 hover:scale-105 transform transition-transform duration-300 ease-in-out shadow-md " size="sm">
                    <FaChevronLeft className='h-4 w-4 mr-2'/>
                    Return
                    </Button>
            </DialogFooter>
        </DialogContent>

      </Dialog>
  )
}
