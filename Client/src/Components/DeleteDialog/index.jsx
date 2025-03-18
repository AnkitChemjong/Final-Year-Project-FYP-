import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import CommonButton from '../CommonButton';

export default function DeleteDialog({deleteDialog,setDeleteDialog,func,title,description}) {

    
  return (
    <Dialog open={deleteDialog} onOpenChange={(value) => setDeleteDialog(value)}>
  <DialogContent
    showOverlay={false}
    className="bg-white rounded-lg shadow-2xl p-6 max-w-md mx-auto border border-slate-200"
  >
    <DialogHeader className="space-y-4">
      <DialogTitle className="text-xl font-semibold text-slate-800 text-center">
        {title}
      </DialogTitle>
      <DialogDescription className="text-sm text-slate-600 text-center">
        {description}
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="flex justify-between mt-6">
      <CommonButton
        func={func}
        text="Delete"
        
      />
      <CommonButton
        func={() => setDeleteDialog(false)}
        text="Cancel"
      />
    </DialogFooter>
  </DialogContent>
</Dialog>
  )
}
