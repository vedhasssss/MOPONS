const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send email function
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"MOPONS" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html || options.message
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

// Email templates
const emailTemplates = {
  welcome: (name) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #4F46E5 0%, #EC4899 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Welcome to MOPONS!</h1>
      </div>
      <div style="padding: 30px; background: #f9fafb;">
        <h2 style="color: #1f2937;">Hi ${name},</h2>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
          Thank you for joining MOPONS - your ultimate platform for trading coupons and saving money!
        </p>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
          Start exploring amazing deals, sell your unused coupons, or exchange them with other users.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}" style="background: linear-gradient(135deg, #4F46E5 0%, #EC4899 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Start Trading
          </a>
        </div>
      </div>
    </div>
  `,

  verifyEmail: (name, token) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #4F46E5 0%, #EC4899 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Verify Your Email</h1>
      </div>
      <div style="padding: 30px; background: #f9fafb;">
        <h2 style="color: #1f2937;">Hi ${name},</h2>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
          Please verify your email address by clicking the button below:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/verify-email/${token}" style="background: linear-gradient(135deg, #4F46E5 0%, #EC4899 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          If you didn't create an account, please ignore this email.
        </p>
      </div>
    </div>
  `,

  expiryReminder: (name, coupon, daysLeft) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #4F46E5 0%, #EC4899 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">⏰ Coupon Expiring Soon!</h1>
      </div>
      <div style="padding: 30px; background: #f9fafb;">
        <h2 style="color: #1f2937;">Hi ${name},</h2>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
          Your coupon "<strong>${coupon.title}</strong>" is expiring in ${daysLeft} day${daysLeft > 1 ? 's' : ''}!
        </p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">${coupon.title}</h3>
          <p style="color: #6b7280;">Brand: ${coupon.brand || 'N/A'}</p>
          <p style="color: #6b7280;">Discount: ${coupon.discountPercentage}%</p>
          <p style="color: #dc2626; font-weight: bold;">Expires: ${new Date(coupon.expiryDate).toLocaleDateString()}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/vault" style="background: linear-gradient(135deg, #4F46E5 0%, #EC4899 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Coupon
          </a>
        </div>
      </div>
    </div>
  `,

  couponSold: (name, coupon, amount) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #4F46E5 0%, #EC4899 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">🎉 Coupon Sold!</h1>
      </div>
      <div style="padding: 30px; background: #f9fafb;">
        <h2 style="color: #1f2937;">Hi ${name},</h2>
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
          Great news! Your coupon has been sold.
        </p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">${coupon.title}</h3>
          <p style="color: #10b981; font-size: 24px; font-weight: bold; margin: 10px 0;">₹${amount}</p>
          <p style="color: #6b7280;">has been added to your wallet</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/wallet" style="background: linear-gradient(135deg, #4F46E5 0%, #EC4899 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Wallet
          </a>
        </div>
      </div>
    </div>
  `
};

module.exports = { sendEmail, emailTemplates };
