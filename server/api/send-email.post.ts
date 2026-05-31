import nodemailer from 'nodemailer';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const { date, time, note } = body;

  // Basic validation check
  if (!date || !time) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Payload parameters passed.',
    });
  }

  // Create transporter configuration with Gmail settings
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.gmailUser,
      pass: config.gmailAppPassword,
    },
  });

  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'UTC' });

  // Rich semantic HTML output format for the inbox notification
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #fecdd6; border-radius: 16px; padding: 24px; background-color: #fff5f7;">
      <h2 style="color: #e11d48; text-align: center;">🎉 Date Invitation Status: ACCEPTED!</h2>
      <p style="font-size: 16px; color: #334155;">Good news! Your date invitation has been accepted. Here are the scheduled details:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ffe4e9; font-weight: bold; color: #475569;">Selected Date:</td>
          <td style="padding: 10px; border-bottom: 1px solid #ffe4e9; color: #0f172a;">${date}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ffe4e9; font-weight: bold; color: #475569;">Selected Time:</td>
          <td style="padding: 10px; border-bottom: 1px solid #ffe4e9; color: #0f172a;">${time}</td>
        </tr>
        <tr>
          <td style="padding: 10px; valign: top; font-weight: bold; color: #475569;">Sweet Note:</td>
          <td style="padding: 10px; color: #0f172a; font-style: italic;">"${note || 'No note added.'}"</td>
        </tr>
      </table>

      <hr style="border: 0; border-top: 1px solid #fecdd6; margin: 20px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center;">Submitted at (UTC): ${timestamp}</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Romantic Date Matchmaker" <${config.gmailUser}>`,
      to: config.destinationEmail || config.gmailUser,
      subject: '💖 She/He Said YES! Your date invitation details are ready!',
      html: htmlContent,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Nodemailer pipeline error processing transmission: ', error);
    return { success: false, error: error.message };
  }
});