import React from 'react'
import { Dialog,DialogContent,DialogHeader,DialogTitle
    ,DialogDescription
 } from '../ui/dialog';
export default function CourseCompletedDialog({courseCompletedDialog,setCourseCompletedDialog,onClose}) {
  return (
    <Dialog open={courseCompletedDialog} onOpenChange={(value)=>{
      setCourseCompletedDialog(value);
      if (!value) {
         setTimeout(() => onClose(), 3000);
      }
      
   }}>
             <DialogContent  showOverlay={false} className="sm:w-[450px]">
                <DialogHeader>
                    <DialogTitle>
                       Congratulation on Completing this Course.
                    </DialogTitle>
                    <DialogDescription className="flex flex-col gap-3">
                     You can download your certificate now. 
                    </DialogDescription>
                </DialogHeader>
             </DialogContent>
          </Dialog>
  )
}
