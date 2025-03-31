import React,{useState,useEffect} from 'react';
import TeacherNavbar from '@/Components/TeacherNavbar';
import { useNavigate } from 'react-router-dom';
import CommonButton from '@/Components/CommonButton';
import { useLocation } from 'react-router-dom';
import PaymentMessageDialog from '@/Components/PaymentMessageDialog';
import LottieAnimation from '@/Components/LottieAnimation';
import successpayment from '@/assets/successpayment.json';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Badge } from '@/Components/ui/badge';
import { useSocket } from '@/Services/Socket-Client-Provider';

export default function TeacherApplication() {
  const navigate=useNavigate();
  const location = useLocation();
  const userState=useSelector(state=>state?.user);
  const {data:user,loading}=userState;
  const params = new URLSearchParams(location.search);
  const status=params.get('payment');
  const message=params.get('message');
  const amount=params.get('amount');
  const subscriptionType=params.get('subscriptionType');
  const [paymentMessageDialog,setPaymentMessageDialog]=useState(false);
  const [paymentMessage,setPaymentMessage]=useState("");
  const [paymentAmount,setPaymentAmount]=useState("");
  const {socket}=useSocket();
  const [tostShown,setTostShown]=useState(false);

  useEffect(() => {
      if (status && status === 'success') {
        socket?.emit('subscription-bought',{userId:user?._id,title:"Subscription Purchase",message:`Your subscription purchase is successfull.`,type:'subscription',subscriptionType:subscriptionType});
        setPaymentMessage(message);
        setPaymentAmount(amount);
        setPaymentMessageDialog(true);
        if(!tostShown){
          toast.success(message);
          setTostShown(true);
        }
      }
    }, [status,socket]);
  return (
    <div className='flex flex-row gap-2 overflow-hidden'>
      <TeacherNavbar />
      <div className='flex-1'>
       <CommonButton func={()=>navigate('/teacher/subscription')} text="take subscription" />
        <Badge>{user?.subscription?.subscriptionType}</Badge>
      </div>
      <PaymentMessageDialog
            paymentMessageDialog={paymentMessageDialog}
            setPaymentMessageDialog={setPaymentMessageDialog}
            message={paymentMessage}
            icon={<LottieAnimation animationData={successpayment} width={150} height={150} speed={1} />}
            amount={paymentAmount}
            />
    </div>
  );
}