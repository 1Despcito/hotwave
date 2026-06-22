import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendBookingConfirmationEmail = async (bookingDetails: any, siteSettings: any) => {
  // 1. Email to Customer
  if (bookingDetails.customerEmail) {
    const customerHtml = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #0B192C; color: #fff; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Hot Wave Tours</h1>
          <p style="color: #00E5FF; margin-top: 5px;">Booking Confirmation</p>
        </div>
        <div style="padding: 30px; background-color: #fff; color: #333;">
          <h2 style="color: #FF6B00;">Hello ${bookingDetails.customerName},</h2>
          <p>Thank you for booking with us! We have received your reservation request and our team will contact you shortly to confirm the final details.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0B192C;">Booking Details:</h3>
            <ul style="list-style-type: none; padding: 0;">
              <li style="margin-bottom: 10px;"><strong>Service:</strong> ${bookingDetails.serviceName}</li>
              ${bookingDetails.packageName ? `<li style="margin-bottom: 10px;"><strong>Package:</strong> ${bookingDetails.packageName}</li>` : ''}
              <li style="margin-bottom: 10px;"><strong>Date:</strong> ${bookingDetails.bookingDate ? new Date(bookingDetails.bookingDate).toLocaleDateString() : 'Not specified'}</li>
              <li style="margin-bottom: 10px;"><strong>Guests:</strong> ${bookingDetails.adults} Adults, ${bookingDetails.children} Children</li>
              ${bookingDetails.hotelName ? `<li style="margin-bottom: 10px;"><strong>Hotel:</strong> ${bookingDetails.hotelName}</li>` : ''}
            </ul>
          </div>
          
          <p style="font-size: 14px; color: #666;">If you have any urgent questions, please contact us on WhatsApp: ${siteSettings?.whatsappNumber || ''}</p>
        </div>
        <div style="background-color: #f1f5f9; text-align: center; padding: 15px; font-size: 12px; color: #64748b;">
          &copy; ${new Date().getFullYear()} Hot Wave. All rights reserved.
        </div>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"Hot Wave" <${process.env.SMTP_USER}>`,
        to: bookingDetails.customerEmail,
        subject: `Booking Request Received - ${bookingDetails.serviceName}`,
        html: customerHtml,
      });
      console.log('Customer confirmation email sent.');
    } catch (e) {
      console.error('Failed to send customer email:', e);
    }
  }

  // 2. Email to Admin
  const adminEmail = siteSettings?.contactEmail || process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  if (adminEmail) {
    const adminHtml = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #1e293b; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #FF6B00; color: #fff; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">New Booking Received! 🚀</h1>
        </div>
        <div style="padding: 30px; background-color: #fff; color: #333;">
          <p><strong>Customer Name:</strong> ${bookingDetails.customerName}</p>
          <p><strong>Phone:</strong> ${bookingDetails.phoneNumber}</p>
          <p><strong>Email:</strong> ${bookingDetails.customerEmail || 'N/A'}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Service:</strong> ${bookingDetails.serviceName}</p>
          <p><strong>Package:</strong> ${bookingDetails.packageName || 'N/A'}</p>
          <p><strong>Date:</strong> ${bookingDetails.bookingDate ? new Date(bookingDetails.bookingDate).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Hotel:</strong> ${bookingDetails.hotelName || 'N/A'}</p>
          <p><strong>Guests:</strong> ${bookingDetails.adults} Adults, ${bookingDetails.children} Children</p>
          <p><strong>Notes:</strong> <br/> ${bookingDetails.notes || 'None'}</p>
        </div>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"Hot Wave System" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `New Booking: ${bookingDetails.customerName} - ${bookingDetails.serviceName}`,
        html: adminHtml,
      });
      console.log('Admin notification email sent.');
    } catch (e) {
      console.error('Failed to send admin email:', e);
    }
  }
};
