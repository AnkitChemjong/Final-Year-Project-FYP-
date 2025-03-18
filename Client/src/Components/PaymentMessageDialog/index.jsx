import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
  } from "@/components/ui/dialog";
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
    className="bg-white rounded-lg shadow-2xl p-6 max-w-md mx-auto border border-slate-200"
  >
 
    <div className="flex flex-col items-center justify-center gap-4 text-center">

      <div className="text-6xl">
        {icon} 
      </div>
    
      <p className="text-lg text-slate-700 font-medium">
        {message}
      </p>
      {
        amount && (
            <p className="text-lg text-slate-700 font-medium">Paid Amount: Rs-{amount}</p>
        )
      }
    </div>

    <DialogFooter className="flex justify-center mt-6">
      <CommonButton
        func={handleRefreshAndDialogClose}
        text="Ok"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
      />
    </DialogFooter>
  </DialogContent>
</Dialog>
  )
}
