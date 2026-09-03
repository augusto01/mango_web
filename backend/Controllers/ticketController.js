const nodemailer = require('nodemailer');

const purchaseTicket = async (req, res) => {
  const { fullName, email, eventName, categoryName, price, quantity, total } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false }
    });

    // Link directo al logo de Mango
    const mangoLogoUrl = `https://lh3.googleusercontent.com/d/17jZU9r7I_R4flmV0eZ5xJ7Zn8voRXcEj`;

    const mailOptions = {
      from: `"MANGUERO TECH 🥭" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🥭 ¡TICKET CONFIRMADO! - ${eventName}`,
      html: `
        <div style="background-color: #050505; padding: 20px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: #ffffff;">
          <div style="max-width: 480px; margin: 0 auto; border: 1px solid #333; border-radius: 28px; overflow: hidden; background: #0f0f0f; box-shadow: 0 20px 50px rgba(0,0,0,0.7);">
            
            <div style="background: linear-gradient(180deg, #FF6B00 0%, #FF9E00 100%); padding: 40px 20px; text-align: center;">
              <img src="${mangoLogoUrl}" alt="Manguero Logo" style="width: 80px; height: auto; margin-bottom: 15px; filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.2));" />
              <h1 style="margin: 0; color: #000; font-size: 34px; font-weight: 900; letter-spacing: -1.5px;">¡HOLA MANGUERO!</h1>
            </div>

            <div style="padding: 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h3 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 300;">${fullName.toUpperCase()}</h3>
                <p style="color: #666; margin-top: 5px; font-size: 14px; text-transform: uppercase;">Evento: ${eventName}</p>
              </div>

              <div style="text-align: center; margin-bottom: 15px;">
                <h2 style="color: #FF6B00; margin: 0; font-size: 38px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; line-height: 1;">
                  ${categoryName}
                </h2>
                <p style="color: #444; font-size: 10px; margin-top: 5px; letter-spacing: 2px;">ACCESS_TOKEN_QR</p>
              </div>

              <div style="text-align: center; margin-bottom: 35px;">
                <div style="background: #ffffff; display: inline-block; padding: 12px; border-radius: 18px; border: 4px solid #FF6B00;">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=MANGUERO_TICKET_${fullName.replace(/\s/g, '_')}_${Date.now()}" 
                       style="display: block; width: 180px; height: 180px;" 
                       alt="QR Access" />
                </div>
              </div>

              <div style="background: #161616; border-radius: 20px; padding: 20px; border: 1px solid #222;">
                <h4 style="color: #FF6B00; margin: 0 0 12px 0; font-size: 13px; font-weight: 800; letter-spacing: 1px;">📍 REGLAS DE ACCESO:</h4>
                <ul style="margin: 0; padding: 0; list-style: none; color: #999; font-size: 12px; line-height: 1.7;">
                  <li style="margin-bottom: 6px;">🕒 <b>LLEGA TEMPRANO:</b> Te recomendamos llegar 45 min antes para evitar filas.</li>
                  <li style="margin-bottom: 6px;">🚫 <b>QR ÚNICO:</b> El código es de un solo uso. No compartas este correo.</li>
                  <li style="margin-bottom: 6px;">📱 <b>BRILLO:</b> Ten el código listo y el brillo al máximo en puerta.</li>
                  <li>🕺 <b>DIVIÉRTETE:</b> ¡Ven con toda la energía manguera! Nos vemos ahí.</li>
                </ul>
              </div>

              <div style="margin-top: 25px; border-top: 1px dashed #333; padding-top: 15px;">
                <table style="width: 100%; font-size: 11px; color: #444;">
                  <tr>
                    <td>ENTRADAS: ${quantity || 1}</td>
                    <td style="text-align: right; color: #00FF41; font-weight: bold; font-size: 15px;">TOTAL: $${(total || price).toLocaleString()}</td>
                  </tr>
                </table>
              </div>
            </div>

            <div style="background: #000; padding: 15px; text-align: center;">
              <p style="color: #222; font-size: 9px; margin: 0; font-family: 'Courier New', monospace;">
                MANGUERO_SECURE_TICKET // VERIFIED_BY_SYSTEM_2026
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: '¡Ticket enviado con categoría destacada!' });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: 'Error en el envío' });
  }
};

module.exports = { purchaseTicket };