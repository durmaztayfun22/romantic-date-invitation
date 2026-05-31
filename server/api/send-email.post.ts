import nodemailer from 'nodemailer';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const { date, time, note, toEmail, fromEmail } = body;

  // Çevre değişkenlerini hem Nuxt config'den hem de doğrudan Vercel sisteminden kontrol et
  const gmailUser = config.gmailUser || process.env.GMAIL_USER;
  const gmailAppPassword = config.gmailAppPassword || process.env.GMAIL_APP_PASSWORD;

  // Eğer URL parametresi boşsa, sistemin çökmemesi için varsayılan olarak sizin mailinize yedeklesin
  const finalToEmail = toEmail || config.destinationEmail || process.env.DESTINATION_EMAIL || 'durmaztayfun178@gmail.com';

  // Yedek korumaya rağmen hedef mail yoksa hata ver (Artık tetiklenmeyecektir)
  if (!finalToEmail) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Target email missing.',
    });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'UTC' });

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #fecdd6; border-radius: 16px; padding: 24px; background-color: #fff5f7;">
      <h2 style="color: #e11d48; text-align: center;">🎉 Date Invitation Status: ACCEPTED!</h2>
      <p style="font-size: 16px; color: #334155;">Good news! The date invitation sent by <b>${fromEmail || 'Someone Special'}</b> has been accepted.</p>
      
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
      from: `"Romantic Date Matchmaker" <${gmailUser}>`,
      to: finalToEmail,
      cc: fromEmail || undefined,
      subject: '💖 She/He Said YES! Your date invitation details are ready!',
      html: htmlContent,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Nodemailer pipeline error:', error);
    return { success: false, error: error.message };
  }
});