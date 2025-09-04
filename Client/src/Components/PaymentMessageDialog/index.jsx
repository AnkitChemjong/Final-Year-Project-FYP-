import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogDescription,
    DialogTitle
  } from "@/Components/ui/dialog";
  import CommonButton from '../CommonButton';
import { useNavigate } from 'react-router-dom';

export default function PaymentMessageDialog({paymentMessageDialog,setPaymentMessageDialog,message,icon,amount=""}) {
    const navigate=useNavigate();
    const handleRefreshAndDialogClose=()=>{
        setPaymentMessageDialog(false);
        navigate(location.pathname,{ replace: true });
    }
  return (
    <Dialog open={paymentMessageDialog} onOpenChange={(value) => setPaymentMessageDialog(value)}>
      <DialogContent
        showOverlay={false}
        className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 max-w-sm mx-auto border border-slate-200 dark:border-slate-700"
      >
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Payment</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Showing Payment Status.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center gap-4 text-center max-w-full"> 
          <div className="text-slate-700 dark:text-slate-300">
            {icon} 
          </div>
          <p className="text-lg text-slate-700 dark:text-slate-300 font-medium">
            {message}
          </p>
          {amount && (
            <p className="text-lg text-slate-700 dark:text-slate-300 font-medium">
              Paid Amount: Rs.{amount}
            </p>
          )}
        </div>

        <DialogFooter className="flex justify-center mt-6">
          <CommonButton
            func={handleRefreshAndDialogClose}
            text="Ok"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-6 py-2 rounded-md transition-colors duration-200"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}