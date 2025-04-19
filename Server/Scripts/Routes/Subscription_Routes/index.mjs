import { Router } from "express";
import EsewaPaymentSubscription from "../../Controllers/Subscription/Payment/esewa/index.mjs";
import KhaltiPaymentSubscription from "../../Controllers/Subscription/Payment/khalti/index.mjs";
import getAllSubscriptionPayment from "../../Controllers/Subscription/Get_All_Subscription_Payment/index.mjs";


const paymentSubRouter=Router();

paymentSubRouter.get('/initialize-esewa',EsewaPaymentSubscription.initializeEsewaPayment);
paymentSubRouter.get('/complete-esewa-payment-subscription',EsewaPaymentSubscription.completeEsewaPayment);
paymentSubRouter.get('/esewa_subscription_cancel',EsewaPaymentSubscription.esewaCancelUrlSubscription);

paymentSubRouter.get('/initialize-khalti',KhaltiPaymentSubscription.initializeTheKhaltiPayment);
paymentSubRouter.get('/complete-khalti-payment-subscription',KhaltiPaymentSubscription.completeKhaltiPayment);


paymentSubRouter.get("/getAllSubscriptionPayment",getAllSubscriptionPayment);

export default paymentSubRouter;
