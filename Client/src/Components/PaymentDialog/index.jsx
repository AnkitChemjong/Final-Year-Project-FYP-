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
import { axiosService } from "@/Services";
import { toast } from "react-toastify";
import { Initialize_Esewa_Payment } from "@/Routes";

const PaymentOption = ({ src, alt,func }) => (
  <Card onClick={func} className="md:w-48 md:h-32 w-32 h-20 cursor-pointer transition-transform hover:scale-110">
    <CardContent className="flex items-center justify-center p-4">
      <img src={src} alt={alt} className="w-full h-full object-contain" />
    </CardContent>
  </Card>
);

export default function PaymentDialog({ openDialog, setOpenDialog, courseDetail }) {
  const user = useSelector((state) => state?.user?.data);

  const handlePayment=async(paymentGateway)=>{
        const queryString={
            userId:user?._id,
            orderStatus:"processing",
            paymentMethod:paymentGateway,
            paymentStatus:"processing",
            amountPaid:courseDetail?.pricing,
            courseId:courseDetail?._id
        }
        const data = new URLSearchParams(queryString).toString();
        const handleEsewaPayment=async()=>{
           try{
                window.location.href=`${Initialize_Esewa_Payment}?${data}`;
        //         if(response.status===200 && response?.data?.esewaUrl){
        //             console.log(response);
        //             const dataList=
        //             {
        //                 total_amount: Number(response?.data?.purchaseData?.amountPaid),
        //                 transaction_uuid:response?.data?.purchaseData?._id,
        //                 product_code: response?.data?.product_code,
        //                 success_url:response?.data?.success_url,
        //                 failure_url:response?.data?.failure_url,
        //                 signed_field_names: response?.data?.paymentInitate?.signed_field_names,
        //                 signature: response?.data?.paymentInitate?.signature,
        //                 secret:response?.data?.secret_key

        //             }
        //             const formData = qs.stringify(dataList);
        //          const response2=await axiosService.post(
        //                 "https://rc-epay.esewa.com.np/api/epay/main/v2/initiate",
        //                 formData,
        //                 {
        //                   headers: {
        //                     "Content-Type": "application/x-www-form-urlencoded",
        //                   },
        //                 }
        //               );
        //               if (response2.status === 200 && response2.data.payment_url) {
        //                 window.location.href = response2.data.payment_url;
        //               }
        //         }
            }
           catch(error)
           {
            setOpenDialog(false);
            console.log(error);
            toast.error(error?.response?.data?.message);
           }
        }

         paymentGateway === "khalti"? await axiosService.post():await handleEsewaPayment();
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
          <PaymentOption func={()=>handlePayment("khalti")} src="/images/khalti.png" alt="Khalti Payment" />
          <PaymentOption func={()=>handlePayment("esewa")} src="/images/esewa.png" alt="Esewa Payment" />
        </div>

        <DialogFooter className="text-center text-gray-600">
          Choose the option that suits you best.
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
