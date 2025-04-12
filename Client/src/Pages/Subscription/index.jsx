import React, { useState,useEffect } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { subscriptionPlans } from '@/Utils';
import { FaCheck, FaStar, FaRocket, FaCrown, FaChalkboardTeacher, FaHeadset } from 'react-icons/fa';
import { GiTeacher } from 'react-icons/gi';
import {  MdOutlineWorkspacePremium } from 'react-icons/md';
import LottieAnimation from '@/Components/LottieAnimation';
import planSub from '@/assets/planSub.json';
import PaymentDialog from '@/Components/PaymentDialog';
import PaymentMessageDialog from '@/Components/PaymentMessageDialog';
import { useLocation } from 'react-router-dom';
import cancelpayment from '@/assets/cancelpayment.json';
import { toast } from 'react-toastify';


export default function Subscription() {
    const [openDialog,setOpenDialog]=useState(false);
    const [paymentMessage,setPaymentMessage]=useState("");
    const [paymentMessageDialog,setPaymentMessageDialog]=useState(false);
    const [subscriptionData,setSubscriptionData]=useState({subscriptionType:"",subscriptionAmount:""});
    const location=useLocation();
    const params = new URLSearchParams(location.search);
    const status=params.get('payment');
    const message=params.get('message');
  const planIcons = {
    Basic: <GiTeacher className="text-blue-500 text-4xl mb-4" />,
    Premium: <MdOutlineWorkspacePremium className="text-purple-500 text-4xl mb-4" />,
    Elite: <FaCrown className="text-yellow-500 text-4xl mb-4" />
  };

  const featureIcons = {
    standard: <FaCheck className="text-green-500 mr-2" />,
    premium: <FaStar className="text-yellow-400 mr-2" />,
    elite: <FaRocket className="text-purple-500 mr-2" />
  };

  const handleSubscribe = (plan,cost) => {
    console.log(plan)
    setSubscriptionData({subscriptionType:plan,subscriptionAmount:cost});
    setOpenDialog(true);
  };
  useEffect(() => {
    if (status && status === 'failed' ) {
      setPaymentMessage(message);
      setPaymentMessageDialog(true);
      toast.success(message);
    }
  }, [status]);
  

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-16">
            <div className='flex gap-2 items-center justify-center'>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-heading">Choose Your Plan</h1>
          <LottieAnimation animationData={planSub} width={100} height={100} speed={1} />
            </div>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the subscription that fits your teaching needs and grow your student base.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {subscriptionPlans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-xl shadow-lg overflow-hidden border-2 ${
                plan.recommended 
                  ? 'border-blue-500 transform md:-translate-y-4 bg-gradient-to-b from-blue-50 to-white' 
                  : 'border-gray-200 bg-white'
              } hover:scale-105 transition-all duration-300 hover:shadow-xl`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg flex items-center">
                  <FaStar className="mr-1" /> Recommended
                </div>
              )}
              
              <div className="p-8">
                <div className="flex flex-col items-center">
                  {planIcons[plan.name]}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name.toLocaleUpperCase()}</h3>
                  <p className="text-gray-600 mb-6">{plan.duration}</p>
                </div>
                
                <div className="mb-8 text-center">
                  <span className="text-4xl font-bold text-gray-900">Rs.{plan.price}</span>
                  <span className="text-gray-500">/{plan.duration.split(' ')[1].toLowerCase()}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      {i < 1 ? featureIcons.standard : 
                       i < 2 ? featureIcons.premium : featureIcons.elite}
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleSubscribe(plan.name,plan.price)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center ${
                    plan.recommended
                      ? 'bg-gradient-to-r from-green-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white'
                      : 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white'
                  } transition-all hover:scale-105 duration-300 shadow-md`}
                >
                  <FaChalkboardTeacher className="mr-2" />
                  Get {plan.name} Plan
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <FaHeadset className="mr-2 text-blue-500" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 text-left">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Can I change plans later?
              </h3>
              <p className="text-gray-600 mt-1 ml-6">Yes, you can upgrade or downgrade your plan at any time.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Is there a free trial?
              </h3>
              <p className="text-gray-600 mt-1 ml-6">New teachers get to upload 3 courses for free before subscribing.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                How are payments processed?
              </h3>
              <p className="text-gray-600 mt-1 ml-6">We use secure payment gateways like eSewa and Khalti.</p>
            </div>
          </div>
        </div>
      </main>
<PaymentDialog openDialog={openDialog} setOpenDialog={setOpenDialog} subscriptionDetails={subscriptionData}/>
<PaymentMessageDialog
      paymentMessageDialog={paymentMessageDialog}
      setPaymentMessageDialog={setPaymentMessageDialog}
      message={paymentMessage}
      icon={ <LottieAnimation animationData={cancelpayment} width={200} height={200} speed={1} />}
      />
      <Footer />
    </div>
  );
}