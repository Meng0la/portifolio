// api/contact.js (Vercel Serverless Function)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { nome, email, mensagem, _source, _ts } = req.body || {};
    if (!nome || !email || !mensagem) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }

    // Envio via Resend (https://resend.com)
    const API_KEY = process.env.RESEND_API_KEY;   // configure no Dashboard da Vercel
    const TO = process.env.MAIL_TO || 'g.menguebarros@gmail.com';
    const FROM = process.env.MAIL_FROM || 'portfolio@seu-dominio.com'; // domínio verificado

    const subject = `Contato do Portfólio — ${nome}`;
    const html = `
      <h2>Novo contato do portfólio</h2>
      <p><b>Nome:</b> ${escapeHtml(nome)}</p>
      <p><b>E-mail:</b> ${escapeHtml(email)}</p>
      <p><b>Mensagem:</b></p>
      <pre style="white-space:pre-wrap">${escapeHtml(mensagem)}</pre>
      <hr>
      <small>source: ${escapeHtml(_source || '')} | ts: ${escapeHtml(_ts || '')}</small>
    `;

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        subject,
        html
      })
    });

    if (!r.ok) {
      const body = await r.text();
      console.error('Resend error:', body);
      return res.status(502).json({ error: 'Email provider error' });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// helper simples pra evitar HTML injection
function escapeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
