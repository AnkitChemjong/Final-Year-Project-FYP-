import React from 'react'
import { Dialog,DialogContent,DialogHeader,DialogTitle
    ,DialogDescription
 } from '../ui/dialog';
 import { Label } from '../ui/label';
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
                        <Label>You can download your certificate now.</Label>
                        
                            <Button onClick={()=>setCourseCompletedDialog(false)}>ok</Button>
                      
                    </DialogDescription>
                </DialogHeader>
             </DialogContent>
          </Dialog>
  )
}
