import React from "react";
import { useSelector } from "react-redux";
import qs from "qs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import { Initialize_Esewa_Payment,Initialize_Esewa_Payment_Subscription,Initialize_Khalti_Payment, Initialize_Khalti_Payment_Subscription } from "@/Routes";

const PaymentOption = ({ src, alt,func }) => (
  <Card onClick={func} className="md:w-48 md:h-32 w-32 h-20 cursor-pointer transition-transform hover:scale-110">
    <CardContent className="flex items-center justify-center p-4">
      <img src={src} alt={alt} className="w-full h-full object-contain" />
    </CardContent>
  </Card>
);

export default function PaymentDialog({ openDialog, setOpenDialog, courseDetail="",subscriptionDetails=""}) {
  const userState = useSelector((state) => state?.user);
  const {data:user,loading}=userState;
  

  const handlePayment=async(paymentGateway)=>{
      const teacherAmountOnly=Number(courseDetail?.pricing)*(10/100); 
        const queryString={
            userId:user?._id,
            orderStatus:"processing",
            paymentMethod:paymentGateway,
            paymentStatus:"processing",
            amountPaid:courseDetail?.pricing,
            courseId:courseDetail?._id,
            siteAmount:courseDetail?.creator?.userRole?.includes('admin')? courseDetail?.pricing:Number(courseDetail?.pricing)-teacherAmountOnly,
            teacherAmount:courseDetail?.creator?.userRole?.includes('admin')? 0:teacherAmountOnly,
            paymentFor:"course purchase"
        }
        const data = new URLSearchParams(queryString).toString();
        const handleEsewaPayment=async()=>{
           try{
                window.location.href=`${Initialize_Esewa_Payment}?${data}`;
            }
           catch(error)
           {
            setOpenDialog(false);
            console.log(error);
            toast.error(error?.response?.data?.message);
           }
        }
        const handleKhaltiPayment=async()=>{
            try{
                console.log(data);
                window.location.href=`${Initialize_Khalti_Payment}?${data}`;
             }
            catch(error)
            {
             setOpenDialog(false);
             console.log(error);
             toast.error(error?.response?.data?.message);
            }
         }

         paymentGateway === "khalti"? await handleKhaltiPayment():await handleEsewaPayment();
  }

  const handleSubscriptionPayment=async(paymentGateway)=>{
      const queryString={
          userId:user?._id,
          orderStatus:"processing",
          paymentMethod:paymentGateway,
          paymentStatus:"processing",
          amountPaid:subscriptionDetails?.subscriptionAmount,
          paymentFor:`${subscriptionDetails?.subscriptionType} subscription`,
          subscriptionType:subscriptionDetails?.subscriptionType
      }
      const data = new URLSearchParams(queryString).toString();
      const handleEsewaPayment=async()=>{
         try{
              window.location.href=`${Initialize_Esewa_Payment_Subscription}?${data}`;
          }
         catch(error)
         {
          setOpenDialog(false);
          console.log(error);
          toast.error(error?.response?.data?.message);
         }
      }
      const handleKhaltiPayment=async()=>{
          try{
              console.log(data);
              window.location.href=`${Initialize_Khalti_Payment_Subscription}?${data}`;
           }
          catch(error)
          {
           setOpenDialog(false);
           console.log(error);
           toast.error(error?.response?.data?.message);
          }
       }

       paymentGateway === "khalti"? await handleKhaltiPayment():await handleEsewaPayment();
}

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment Options</DialogTitle>
          <DialogDescription>
            Select your preferred payment gateway to proceed with the payment.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-row justify-evenly py-6">
          <PaymentOption func={()=>courseDetail? handlePayment("khalti"):handleSubscriptionPayment("khalti")} src="/images/khalti.png" alt="Khalti Payment" />
          <PaymentOption func={()=>courseDetail? handlePayment("esewa"):handleSubscriptionPayment("esewa")} src="/images/esewa.png" alt="Esewa Payment" />
        </div>

        <DialogFooter className="text-center text-gray-600">
          Choose the option that suits you best.
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
