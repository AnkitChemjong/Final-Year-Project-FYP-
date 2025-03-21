import React from 'react'
import { Dialog,DialogContent,DialogHeader,DialogTitle
    ,DialogDescription
 } from '../ui/dialog';
 import { Button } from '../ui/button';
export default function CourseCompletedDialog({courseCompletedDialog,setCourseCompletedDialog}) {
  return (
    <Dialog open={courseCompletedDialog} onOpenChange={(value)=>setCourseCompletedDialog(value)}>
             <DialogContent  showOverlay={false} className="sm:w-[450px]">
                <DialogHeader>
                    <DialogTitle>
                       Congratulation on Completing this Course.
                    </DialogTitle>
                    <DialogDescription className="flex flex-col gap-3">
                     You can download your certificate now. 
                    </DialogDescription>
                    <div className="mt-4 flex justify-end">
      <Button onClick={() => setCourseCompletedDialog(false)}>OK</Button>
    </div>
                </DialogHeader>
             </DialogContent>
          </Dialog>
  )
}
