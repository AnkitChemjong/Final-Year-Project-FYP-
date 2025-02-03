import nodemailer from "nodemailer";

const sendMailToUser=async (email,code="",text="",subject="")=>{
    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth: {
        user: process.env.GUSER,
        pass: process.env.GPASS
    }
    })

    // Set up email data with unicode symbols
    const mailOptions = {
        from: `"Efficient Pathsala" <${process.env.GUSER}>`, 
        to: email,
        subject: code?  ('Efficient Pathsala - Token for Password Reset'):subject, 
        text:code? (`Dear ${email},\n\nHere is your password reset code: ${code}\n\nValid for 10 minute\n\nRegards,\nEfficient Pathsala`):text,
        replyTo: process.env.GUSER
      };
      
// Send mail with defined transport object
await transporter.sendMail(mailOptions);

}
export default sendMailToUser;