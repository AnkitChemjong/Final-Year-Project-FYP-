import nodemailer from "nodemailer";

const sendMailToUser=async (email,code)=>{
    const transporter=nodemailer.createTransport({
        service:"gmail",
        host: process.env.GHOST,
    port: process.env.GPORT,
    auth: {
        user: process.env.GUSER,
        pass: process.env.GPASS
    }
    })
    // Set up email data with unicode symbols
    const mailOptions = {
        from: `"Efficient Pathsala" <${process.env.GUSER}>`, 
        to: email,
        subject: 'Efficient Pathsala - Token for Password Reset', 
        text: `Dear ${email},\n\nHere is your password reset code: ${code}\n\nValid for 10 minute\n\nRegards,\nEfficient Pathsala`,
        replyTo: process.env.GUSER
      };
      
// Send mail with defined transport object
await transporter.sendMail(mailOptions);

}
export default sendMailToUser;