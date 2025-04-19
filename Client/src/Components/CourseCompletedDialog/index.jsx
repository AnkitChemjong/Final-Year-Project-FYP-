import React from 'react'
import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '../ui/dialog';

export default function CourseCompletedDialog({courseCompletedDialog,setCourseCompletedDialog,onClose}) {
  return (
    <Dialog open={courseCompletedDialog} onOpenChange={(value)=>{
      setCourseCompletedDialog(value);
      if (!value) {
         setTimeout(() => onClose(), 3000);
      }
    }}>
      <DialogContent 
        showOverlay={false} 
        className="sm:w-[450px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
      >
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-100">
            Congratulations on Completing this Course.
          </DialogTitle>
          <DialogDescription className="flex flex-col gap-3 text-slate-600 dark:text-slate-300">
            You can download your certificate now. 
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}