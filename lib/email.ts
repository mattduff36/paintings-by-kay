import type Stripe from 'stripe';
import type { Product } from '@/lib/types/product';

let resendClient: any | null = null;

function getResend() {
  try {
    // Lazy import so we don't hard fail if dependency not installed in some environments
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Resend } = require('resend');
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return null;
    if (!resendClient) resendClient = new Resend(apiKey);
    return resendClient as InstanceType<typeof Resend>;
  } catch {
    return null;
  }
}

export interface PurchaseEmailParams {
  toEmail: string;
  product: Product;
  session: Stripe.Checkout.Session;
  siteUrl: string;
}

export async function sendPurchaseConfirmationEmail(params: PurchaseEmailParams): Promise<void> {
  const { toEmail, product, session, siteUrl } = params;
  const fromEmail = process.env.EMAIL_FROM || process.env.RESEND_FROM || '';
  const bccEmail = process.env.EMAIL_BCC || '';

  const subject = `Order confirmation: ${product.name}`;
  const priceGbp = (product.price_gbp_pennies / 100).toFixed(2);
  const shippingAddress = (session.customer_details?.address &&
    [
      session.customer_details.address.line1,
      session.customer_details.address.line2,
      session.customer_details.address.city,
      session.customer_details.address.postal_code,
      session.customer_details.address.country,
    ]
      .filter(Boolean)
      .join(', ')) || 'Not provided';

  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2 style="margin:0 0 16px;">Thank you for your purchase!</h2>
      <p>We're delighted to confirm your order for <strong>${product.name}</strong>.</p>
      <ul>
        <li><strong>Order ID</strong>: ${session.id}</li>
        <li><strong>Price</strong>: £${priceGbp}</li>
        <li><strong>Shipping</strong>: Free UK postage & packaging</li>
        <li><strong>Shipping address</strong>: ${shippingAddress}</li>
      </ul>
      <p>We'll be in touch when your artwork has shipped. If you have any questions, reply to this email.</p>
      <p style="margin-top:24px;">
        <a href="${siteUrl}/shop" style="display:inline-block;background:#111;color:#fff;padding:10px 14px;border-radius:6px;text-decoration:none">Visit the shop</a>
      </p>
      <p style="color:#555;margin-top:24px;">Paintings by Kay</p>
    </div>
  `;

  const text = `Thank you for your purchase!\n\n` +
    `Order confirmation for ${product.name}.\n` +
    `Order ID: ${session.id}\n` +
    `Price: £${priceGbp}\n` +
    `Shipping: Free UK postage & packaging\n` +
    `Shipping address: ${shippingAddress}\n\n` +
    `We will be in touch when your artwork has shipped.\n` +
    `${siteUrl}/shop\n` +
    `Paintings by Kay`;

  const resend = getResend();
  if (resend && fromEmail) {
    try {
      await resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        ...(bccEmail ? { bcc: [bccEmail] } : {}),
        subject,
        html,
        text,
      });
      return;
    } catch (err) {
      console.error('Resend email failed', err);
    }
  }

  // Graceful fallback when no email provider configured
  console.log('[email:simulate]', {
    to: toEmail,
    subject,
    text,
  });
}



