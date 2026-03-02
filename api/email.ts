import type { VercelRequest, VercelResponse } from '@vercel/node';

// ── Transactional Email via Resend ────────────────────────────────────────────
// Docs: https://resend.com/docs/api-reference/emails/send-email
//
// Token necessário: RESEND_API_KEY (Vercel Env Var)
// ─────────────────────────────────────────────────────────────────────────────

interface EmailRequest {
    to: string;
    order_id: string;
    buyer_name: string;
    items: { title: string; quantity: number; unit_price: number; image_url?: string }[];
    total: number;
    payment_method: string;
    tracking_code?: string;
    address: string;
}

function buildOrderEmail(data: EmailRequest): string {
    const itemRows = data.items
        .map(i => `
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;">
              <strong style="display:block;color:#1e293b;font-size:14px;">${i.title}</strong>
              <span style="color:#64748b;font-size:12px;">Qtd: ${i.quantity}</span>
            </td>
            <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;text-align:right;color:#1e293b;font-weight:700;">
              R$ ${(i.unit_price * i.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </td>
          </tr>
        `)
        .join('');

    const paymentLabel: Record<string, string> = {
        pix: '⚡ PIX',
        credit_card: '💳 Cartão de Crédito',
        boleto: '📄 Boleto Bancário',
    };

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:40px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:28px;font-weight:900;letter-spacing:-0.5px;">🎉 Pedido Confirmado!</h1>
              <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Pedido #XT-${data.order_id.slice(0, 8).toUpperCase()}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#1e293b;font-size:16px;margin:0 0 24px;">Olá, <strong>${data.buyer_name}</strong>! 👋</p>
              <p style="color:#64748b;font-size:14px;margin:0 0 32px;">Seu pedido foi recebido e está em processamento. Assim que for enviado, você receberá o código de rastreio.</p>

              <!-- Items -->
              <h2 style="color:#1e293b;font-size:16px;font-weight:800;margin:0 0 16px;">Itens do Pedido</h2>
              <table width="100%" cellpadding="0" cellspacing="0">${itemRows}</table>

              <!-- Total -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;background:#f8fafc;border-radius:16px;padding:20px;">
                <tr>
                  <td style="color:#64748b;font-size:14px;font-weight:700;">Forma de Pagamento</td>
                  <td style="color:#1e293b;font-weight:700;text-align:right;">${paymentLabel[data.payment_method] ?? data.payment_method}</td>
                </tr>
                <tr>
                  <td style="color:#1e293b;font-size:18px;font-weight:900;padding-top:12px;">Total</td>
                  <td style="color:#4f46e5;font-size:18px;font-weight:900;text-align:right;padding-top:12px;">
                    R$ ${data.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </table>

              <!-- Delivery -->
              <div style="margin-top:24px;padding:20px;background:#f0fdf4;border-radius:16px;border:1px solid #bbf7d0;">
                <p style="color:#166534;font-weight:700;margin:0 0 4px;font-size:14px;">📦 Endereço de Entrega</p>
                <p style="color:#15803d;margin:0;font-size:13px;">${data.address}</p>
              </div>

              ${data.tracking_code ? `
              <!-- Tracking -->
              <div style="margin-top:24px;padding:20px;background:#eff6ff;border-radius:16px;border:1px solid #bfdbfe;">
                <p style="color:#1e40af;font-weight:700;margin:0 0 4px;font-size:14px;">🚚 Código de Rastreio</p>
                <p style="color:#1d4ed8;margin:0;font-size:14px;font-weight:800;">${data.tracking_code}</p>
              </div>` : ''}

              <!-- CTA -->
              <div style="text-align:center;margin-top:32px;">
                <a href="https://xtudoparaguai.vercel.app/#track-order"
                   style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;font-weight:800;font-size:14px;padding:16px 32px;border-radius:14px;text-decoration:none;">
                  Rastrear Pedido →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background:#f8fafc;text-align:center;border-top:1px solid #f1f5f9;">
              <p style="color:#94a3b8;font-size:12px;margin:0;">
                XTudo Paraguai Marketplace · Dúvidas? Fale conosco em <a href="mailto:suporte@xtudoparaguai.com" style="color:#4f46e5;">suporte@xtudoparaguai.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendOrderConfirmation(data: EmailRequest): Promise<boolean> {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn('[email] RESEND_API_KEY não configurado. Email não enviado.');
        return false;
    }

    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'XTudo Paraguai <noreply@xtudoparaguai.com>',
                to: [data.to],
                subject: `✅ Pedido #XT-${data.order_id.slice(0, 8).toUpperCase()} confirmado!`,
                html: buildOrderEmail(data),
            }),
        });

        if (!res.ok) {
            const err = await res.json();
            console.error('[email] Resend error:', err);
            return false;
        }

        console.log(`[email] Confirmação enviada para ${data.to}`);
        return true;
    } catch (err) {
        console.error('[email] fetch error:', err);
        return false;
    }
}

// Rota para testes manuais: POST /api/email
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const success = await sendOrderConfirmation(req.body as EmailRequest);
    return res.status(success ? 200 : 500).json({ sent: success });
}
