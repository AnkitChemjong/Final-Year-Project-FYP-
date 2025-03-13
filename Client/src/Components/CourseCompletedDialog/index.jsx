import React from 'react'
import { Dialog,DialogContent,DialogHeader,DialogTitle
    ,DialogDescription
 } from '../ui/dialog';
 import { useNavigate } from 'react-router-dom';
 import { Label } from '../ui/label';
 import { Button } from '../ui/button';
export default function CourseCompletedDialog({courseCompletedDialog,setCourseCompletedDialog}) {
    const navigate=useNavigate();
    const resetCourse=async()=>{
       
    }
  return (
    <Dialog open={courseCompletedDialog}>
             <DialogContent className="sm:w-[450px]">
                <DialogHeader>
                    <DialogTitle>
                       Congratulation on Completing this Course.
                    </DialogTitle>
                    <DialogDescription className="flex flex-col gap-3">
                        <Label>You can download your certificate now.</Label>
                        <div className='flex flex-row gap-3'>
                            <Button onClick={()=>navigate('/studentCourse')}>Enrolled Curses</Button>
                            <Button onClick={resetCourse}>Rewatch Course</Button>
                        </div>
                    </DialogDescription>
                </DialogHeader>
             </DialogContent>
          </Dialog>
  )
}
