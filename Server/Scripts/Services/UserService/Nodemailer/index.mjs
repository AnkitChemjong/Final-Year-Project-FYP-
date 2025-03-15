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
        html: `
    <div style="max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: white; font-family: Arial, sans-serif; border: 1px solid #ddd;">
        <div style="text-align: center; padding: 10px 0;">
            <h2 style="color: #2E8B57; margin-bottom: 10px;">Efficient Pathsala</h2>
        </div>
        <div style="padding: 20px; background: #f4f4f4; border-radius: 8px;">
            <p style="font-size: 16px; color: #333;">Dear ${email},</p>
            ${code ? `
            <p style="font-size: 18px; font-weight: bold; color: #1E90FF; text-align: center;">Here is your password reset code:</p>
            <p style="font-size: 22px; font-weight: bold; color: #2E8B57; text-align: center; background: #e6ffe6; padding: 10px; border-radius: 5px;">${code}</p>
            <p style="text-align: center; font-size: 14px; color: #999;">Valid for 10 minutes</p>
            ` : `<p style="font-size: 16px; color: #333;">${text}</p>`}
        </div>
        <p style="font-size: 14px; text-align: center; color: #666; margin-top: 20px;">Regards,<br><b>Efficient Pathsala</b></p>
    </div>
    `,
        replyTo: process.env.GUSER
      };
      
// Send mail with defined transport object
await transporter.sendMail(mailOptions);

}
export default sendMailToUser;