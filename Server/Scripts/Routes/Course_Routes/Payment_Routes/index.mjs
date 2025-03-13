import { Router } from "express";
import EsewaPayment from "../../../Controllers/Course_Controller/Payment/esewa/index.mjs";
import KhaltiPayment from "../../../Controllers/Course_Controller/Payment/khalti/index.mjs";


const paymentRouter=Router();

paymentRouter.get('/initialize-esewa',EsewaPayment.initializeEsewaPayment);
paymentRouter.get('/complete-esewa-payment',EsewaPayment.completeEsewaPayment);
paymentRouter.get('/esewa_cancel',EsewaPayment.esewaCancelUrl);

paymentRouter.get('/initialize-khalti',KhaltiPayment.initializeTheKhaltiPayment);
paymentRouter.get('/complete-khalti-payment',KhaltiPayment.completeKhaltiPayment);


export default paymentRouter;
