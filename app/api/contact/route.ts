import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Eksik bilgi gönderildi.' }, { status: 400 });
    }

    // SMTP yapılandırması
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Gönderici 'destek@zeraygold.com.tr' olmazsa Brevo / Zoho Relay hatası verebilir (Sender Identity Override).
    // O yüzden from kısmı 'destek' olmak zorunda, ancak 'replyTo' müşterinin e-postası olacak.
    const mailOptions = {
      from: `"Zeray İletişim Formu" <destek@zeraygold.com.tr>`, 
      replyTo: email,
      to: 'destek@zeraygold.com.tr',
      subject: `Yeni İletişim Mesajı: ${subject || 'Bilinmeyen Konu'} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;">
          <h2 style="color: #d4af37; border-bottom: 2px solid #eee; padding-bottom: 10px;">Yeni İletişim Mesajı</h2>
          <p><strong>Gönderen Adı:</strong> ${name}</p>
          <p><strong>E-posta:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone || 'Belirtilmedi'}</p>
          <p><strong>Konu:</strong> ${subject || 'Genel'}</p>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #d4af37; margin-top: 20px;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="font-size: 12px; color: #888; margin-top: 30px; text-align: center;">
            Bu mesaj Zeray Gold (www.zeraygold.com.tr) iletişim formundan otomatik olarak gönderilmiştir.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Mesaj başarıyla iletildi.' });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json({ error: 'Mesaj gönderilemedi, sunucu/SMTP hatası.' }, { status: 500 });
  }
}
