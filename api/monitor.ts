import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// ── Supabase service role ─────────────────────────────────────────────────────
const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY!
);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'mora.suporte@gmail.com';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const APP_URL = process.env.APP_URL ?? 'https://xtudoparaguai.com';

// ── Limites de alerta ─────────────────────────────────────────────────────────
const ALERT_FAILED_JOBS_MIN = 1;   // alertar se houver >= 1 job failed nas últimas 2h
const ALERT_STUCK_ORDERS_MIN = 1;   // alertar se pedido ficar preso em sending_to_supplier > 30min
const STUCK_ORDER_MINUTES = 30;

// ── Enviar email de alerta via Resend ─────────────────────────────────────────
async function sendAlertEmail(subject: string, html: string): Promise<void> {
    if (!RESEND_API_KEY) {
        console.warn('[monitor] RESEND_API_KEY não configurado — alerta não enviado');
        return;
    }
    const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: 'XTUDO Monitoramento <noreply@xtudoparaguai.com>',
            to: [ADMIN_EMAIL],
            subject,
            html,
        }),
    });
    if (!resp.ok) {
        const body = await resp.text().catch(() => '');
        console.error('[monitor] falha ao enviar alerta:', resp.status, body);
    } else {
        console.log('[monitor] alerta enviado para', ADMIN_EMAIL);
    }
}

// ── Construir HTML do alerta ──────────────────────────────────────────────────
function buildAlertHtml(params: {
    failedJobs: any[];
    stuckOrders: any[];
    checkedAt: string;
}): string {
    const { failedJobs, stuckOrders, checkedAt } = params;

    const jobRows = failedJobs.map(j => `
        <tr>
            <td style="padding:10px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#334155;">${j.id.slice(0, 8)}</td>
            <td style="padding:10px;border-bottom:1px solid #f1f5f9;font-size:12px;font-weight:700;color:#dc2626;">${j.job_type}</td>
            <td style="padding:10px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#64748b;">${j.attempts}/${j.max_attempts}</td>
            <td style="padding:10px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#64748b;">${j.last_error ?? '—'}</td>
        </tr>`).join('');

    const orderRows = stuckOrders.map(o => `
        <tr>
            <td style="padding:10px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#334155;">#${o.id.slice(0, 8)}</td>
            <td style="padding:10px;border-bottom:1px solid #f1f5f9;font-size:12px;font-weight:700;color:#d97706;">${o.order_status}</td>
            <td style="padding:10px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#64748b;">R$ ${Number(o.total_brl).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            <td style="padding:10px;border-bottom:1px solid #f1f5f9;font-size:12px;color:#64748b;">${new Date(o.updated_at).toLocaleString('pt-BR')}</td>
        </tr>`).join('');

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#dc2626,#9f1239);padding:32px 40px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:22px;font-weight:900;">🚨 Alerta de Operação</h1>
            <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:13px;">XTUDO Paraguai · Monitoramento Automático</p>
            <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:11px;">${checkedAt}</p>
          </td>
        </tr>

        <tr><td style="padding:32px 40px;">

          ${failedJobs.length > 0 ? `
          <!-- Failed Jobs -->
          <h2 style="font-size:15px;font-weight:900;color:#dc2626;margin:0 0 12px;">❌ Jobs Falhos (${failedJobs.length})</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #fee2e2;border-radius:8px;overflow:hidden;margin-bottom:28px;">
            <thead>
              <tr style="background:#fef2f2;">
                <th style="padding:10px;text-align:left;font-size:10px;color:#dc2626;text-transform:uppercase;letter-spacing:.05em;">ID</th>
                <th style="padding:10px;text-align:left;font-size:10px;color:#dc2626;text-transform:uppercase;letter-spacing:.05em;">Tipo</th>
                <th style="padding:10px;text-align:left;font-size:10px;color:#dc2626;text-transform:uppercase;letter-spacing:.05em;">Tentativas</th>
                <th style="padding:10px;text-align:left;font-size:10px;color:#dc2626;text-transform:uppercase;letter-spacing:.05em;">Último Erro</th>
              </tr>
            </thead>
            <tbody>${jobRows}</tbody>
          </table>` : ''}

          ${stuckOrders.length > 0 ? `
          <!-- Stuck Orders -->
          <h2 style="font-size:15px;font-weight:900;color:#d97706;margin:0 0 12px;">⏳ Pedidos Travados > ${STUCK_ORDER_MINUTES}min (${stuckOrders.length})</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #fef3c7;border-radius:8px;overflow:hidden;margin-bottom:28px;">
            <thead>
              <tr style="background:#fffbeb;">
                <th style="padding:10px;text-align:left;font-size:10px;color:#d97706;text-transform:uppercase;letter-spacing:.05em;">Pedido</th>
                <th style="padding:10px;text-align:left;font-size:10px;color:#d97706;text-transform:uppercase;letter-spacing:.05em;">Status</th>
                <th style="padding:10px;text-align:left;font-size:10px;color:#d97706;text-transform:uppercase;letter-spacing:.05em;">Total</th>
                <th style="padding:10px;text-align:left;font-size:10px;color:#d97706;text-transform:uppercase;letter-spacing:.05em;">Última Atualização</th>
              </tr>
            </thead>
            <tbody>${orderRows}</tbody>
          </table>` : ''}

          <!-- CTA -->
          <div style="text-align:center;margin-top:24px;">
            <a href="${APP_URL}" style="display:inline-block;background:#4f46e5;color:#fff;font-weight:900;font-size:13px;padding:14px 32px;border-radius:12px;text-decoration:none;">
              Acessar Painel Admin →
            </a>
          </div>

        </td></tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #f1f5f9;">
            <p style="font-size:11px;color:#94a3b8;margin:0;">Este alerta é gerado automaticamente pelo sistema de monitoramento XTUDO Paraguai.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Handler principal ─────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Segurança: mesmo secret do worker
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && req.headers['authorization'] !== `Bearer ${cronSecret}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
    const stuckCutoff = new Date(now.getTime() - STUCK_ORDER_MINUTES * 60 * 1000).toISOString();

    // 1. Jobs que falharam definitivamente nas últimas 2h
    const { data: failedJobs } = await supabase
        .from('job_queue')
        .select('id, job_type, payload, attempts, max_attempts, last_error, updated_at')
        .eq('status', 'failed')
        .gte('updated_at', twoHoursAgo)
        .order('updated_at', { ascending: false })
        .limit(20);

    // 2. Pedidos presos em estados transitórios há mais de X minutos
    const { data: stuckOrders } = await supabase
        .from('orders')
        .select('id, order_status, total_brl, updated_at')
        .in('order_status', ['sending_to_supplier', 'supplier_processing'])
        .lte('updated_at', stuckCutoff)
        .order('updated_at', { ascending: true })
        .limit(20);

    const hasAlerts =
        (failedJobs?.length ?? 0) >= ALERT_FAILED_JOBS_MIN ||
        (stuckOrders?.length ?? 0) >= ALERT_STUCK_ORDERS_MIN;

    console.log(`[monitor] jobs falhos: ${failedJobs?.length ?? 0}, pedidos travados: ${stuckOrders?.length ?? 0}, alerta: ${hasAlerts}`);

    if (hasAlerts) {
        const checkedAt = now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        const subject = `🚨 [XTUDO] Alerta: ${failedJobs?.length ?? 0} job(s) falho(s), ${stuckOrders?.length ?? 0} pedido(s) travado(s)`;
        const html = buildAlertHtml({
            failedJobs: failedJobs ?? [],
            stuckOrders: stuckOrders ?? [],
            checkedAt,
        });
        await sendAlertEmail(subject, html);
    }

    return res.status(200).json({
        checked_at: now.toISOString(),
        failed_jobs: failedJobs?.length ?? 0,
        stuck_orders: stuckOrders?.length ?? 0,
        alert_sent: hasAlerts,
    });
}
