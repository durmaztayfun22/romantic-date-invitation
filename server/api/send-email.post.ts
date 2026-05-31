import nodemailer from 'nodemailer';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  // Ön yüzden gelen verileri ve e-posta adreslerini yakalıyoruz
  const { date, time, note, toEmail, fromEmail } = body;

  // Temel doğrulama: Eğer hedef mail yoksa hata döndür
  if (!toEmail) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Target email (toEmail) is required.',
    });
  }

  // E-posta gönderici motoru (Yine sizin güvenli Gmail altyapınız köprü olacak)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.gmailUser,
      pass: config.gmailAppPassword,
    },
  });

  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'UTC' });

  // Dinamik mail içeriği
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
      <p style="font-size: 11px; color: #94a3b8; text-align: center;">This response was routed securely. Submitted at (UTC): ${timestamp}</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Romantic Date Matchmaker" <${config.gmailUser}>`,
      to: toEmail, // Artık statik değil, URL'den gelen kişiye gidiyor!
      cc: fromEmail || undefined, // İstenirse davet eden kişiye de bilgi geçiyoruz
      subject: '💖 She/He Said YES! Your date invitation details are ready!',
      html: htmlContent,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Nodemailer pipeline error:', error);
    return { success: false, error: error.message };
  }
});