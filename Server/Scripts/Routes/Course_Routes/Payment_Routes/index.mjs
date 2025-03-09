import { Router } from "express";
import { initializeEsewaPayment } from "../../../Controllers/Course_Controller/Payment/esewa/index.mjs";



const paymentRouter=Router();

paymentRouter.get('/initialize-esewa',initializeEsewaPayment);
paymentRouter.get('/complete-esewa-payment',);

paymentRouter.post('/initialize-khalti',);
paymentRouter.get('/complete-khalti-payment',);


export default paymentRouter;
