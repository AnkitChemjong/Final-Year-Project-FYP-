import axios from 'axios';
import {createHmac} from 'crypto';

const getEsewaPaymentHash=async ({amount,transaction_uuid})=>{
    try {
        const data = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;
    
        const secretKey = process.env.ESEWA_SECRET_KEY;
        const hash =createHmac("sha256", secretKey)
          .update(data)
          .digest("base64");
    
        return {
          signature: hash,
          signed_field_names: "total_amount,transaction_uuid,product_code",
        };
      } catch (error) {
        throw error;
      }
}

async function verifyEsewaPayment(encodedData) {
    try {
      // decoding base64 code revieved from esewa
      let decodedData = atob(encodedData);
      decodedData = await JSON.parse(decodedData);
      //console.log(decodedData);
      let headersList = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
  
      const data = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE},signed_field_names=${decodedData.signed_field_names}`;
  
      const secretKey = process.env.ESEWA_SECRET_KEY;
      const hash = createHmac("sha256", secretKey)
        .update(data)
        .digest("base64");
  
      //console.log(hash);
      //console.log(decodedData.signature);
      let reqOptions = {
        url: `${process.env.ESEWA_STATUS_URL}?product_code=${process.env.ESEWA_PRODUCT_CODE}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`,
        method: "GET",
        headers: headersList,
      };
      if (hash !== decodedData.signature) {
        throw { message: "Invalid Info", decodedData };
      }
      let response = await axios.request(reqOptions);
      if (
        response.data.status !== "COMPLETE" ||
        response.data.transaction_uuid !== decodedData.transaction_uuid ||
        Number(response.data.total_amount) !== Number(decodedData.total_amount)
      ) {
        throw { message: "Invalid Info", decodedData };
      }
      return { response: response.data, decodedData };
    } catch (error) {
      throw error;
    }
  }


export {getEsewaPaymentHash,verifyEsewaPayment};