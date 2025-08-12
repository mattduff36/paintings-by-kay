import type Stripe from 'stripe';
import type { Product } from '@/lib/types/product';
import type { Order } from '@/lib/types/order';

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

function getOwnerEmail(): string {
  return process.env.OWNER_EMAIL || 'hello@paintingsbykay.co.uk';
}

function formatAddressFromSession(session: Stripe.Checkout.Session): string {
  const a = session.customer_details?.address;
  if (!a) return 'Not provided';
  return [a.line1, a.line2, a.city, a.postal_code, a.country].filter(Boolean).join(', ');
}

function formatAddressFromOrder(order: Order): string {
  return [
    order.shipping_line1,
    order.shipping_line2,
    order.shipping_city,
    order.shipping_postal_code,
    order.shipping_country,
  ]
    .filter(Boolean)
    .join(', ') || 'Not provided';
}

async function sendBasicEmail(to: string[], subject: string, html: string, text: string): Promise<void> {
  const fromEmail = process.env.EMAIL_FROM || process.env.RESEND_FROM || '';
  const resend = getResend();
  if (resend && fromEmail) {
    try {
      await resend.emails.send({ from: fromEmail, to, subject, html, text });
      return;
    } catch (err) {
      console.error('Resend email failed', err);
    }
  }
  console.log('[email:simulate]', { to, subject, text });
}

export async function sendOwnerOrderInitiatedEmail(params: {
  product: Product;
  session: Stripe.Checkout.Session;
}): Promise<void> {
  const { product, session } = params;
  const subject = `Checkout initiated: ${product.name}`;
  const text =
    `A customer started checkout.\n` +
    `Order ID: ${session.id}\n` +
    `Product: ${product.name}\n` +
    `Price: £${(product.price_gbp_pennies / 100).toFixed(2)}\n`;
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2 style="margin:0 0 16px;">Checkout initiated</h2>
      <ul>
        <li><strong>Order ID</strong>: ${session.id}</li>
        <li><strong>Product</strong>: ${product.name}</li>
        <li><strong>Price</strong>: £${(product.price_gbp_pennies / 100).toFixed(2)}</li>
      </ul>
    </div>
  `;
  await sendBasicEmail([getOwnerEmail()], subject, html, text);
}

export async function sendOwnerOrderPaidEmail(params: {
  product: Product;
  session: Stripe.Checkout.Session;
}): Promise<void> {
  const { product, session } = params;
  const subject = `Order paid: ${product.name}`;
  const addr = formatAddressFromSession(session);
  const customerName = session.customer_details?.name || 'Unknown';
  const customerEmail = session.customer_details?.email || session.customer_email || 'Unknown';
  const customerPhone = session.customer_details?.phone || 'Unknown';
  const text =
    `An order has been paid.\n` +
    `Order ID: ${session.id}\n` +
    `Product: ${product.name}\n` +
    `Price: £${(product.price_gbp_pennies / 100).toFixed(2)}\n` +
    `Customer: ${customerName}\n` +
    `Email: ${customerEmail}\n` +
    `Phone: ${customerPhone}\n` +
    `Shipping address: ${addr}\n`;
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2 style="margin:0 0 16px;">Order paid</h2>
      <ul>
        <li><strong>Order ID</strong>: ${session.id}</li>
        <li><strong>Product</strong>: ${product.name}</li>
        <li><strong>Price</strong>: £${(product.price_gbp_pennies / 100).toFixed(2)}</li>
        <li><strong>Customer</strong>: ${customerName}</li>
        <li><strong>Email</strong>: ${customerEmail}</li>
        <li><strong>Phone</strong>: ${customerPhone}</li>
        <li><strong>Shipping address</strong>: ${addr}</li>
      </ul>
    </div>
  `;
  await sendBasicEmail([getOwnerEmail()], subject, html, text);
}

export async function sendOwnerOrderFailedEmail(params: {
  product: Product;
  session: Stripe.Checkout.Session;
  reason?: string;
}): Promise<void> {
  const { product, session, reason } = params;
  const subject = `Checkout failed: ${product.name}`;
  const text =
    `A checkout failed or was cancelled.\n` +
    `Order ID: ${session.id}\n` +
    `Product: ${product.name}\n` +
    `Reason: ${reason || 'unknown'}\n`;
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2 style="margin:0 0 16px;">Checkout failed/cancelled</h2>
      <ul>
        <li><strong>Order ID</strong>: ${session.id}</li>
        <li><strong>Product</strong>: ${product.name}</li>
        <li><strong>Reason</strong>: ${reason || 'unknown'}</li>
      </ul>
    </div>
  `;
  await sendBasicEmail([getOwnerEmail()], subject, html, text);
}

export async function sendOrderDespatchedEmails(params: {
  order: Order;
  siteUrl: string;
}): Promise<void> {
  const { order, siteUrl } = params;
  const subjectCustomer = `Your order has been despatched: ${order.product_name}`;
  const addr = formatAddressFromOrder(order);
  const price = (order.price_gbp_pennies / 100).toFixed(2);
  const textCustomer =
    `Good news! Your artwork has been despatched.\n` +
    `Order ID: ${order.id}\n` +
    `Item: ${order.product_name}\n` +
    `Price: £${price}\n` +
    `Shipping address: ${addr}\n` +
    `${siteUrl}\n` +
    `Paintings by Kay`;
  const htmlCustomer = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2 style="margin:0 0 16px;">Your order has been despatched</h2>
      <p>We're pleased to let you know your artwork is on its way.</p>
      <ul>
        <li><strong>Order ID</strong>: ${order.id}</li>
        <li><strong>Item</strong>: ${order.product_name}</li>
        <li><strong>Price</strong>: £${price}</li>
        <li><strong>Shipping address</strong>: ${addr}</li>
      </ul>
      <p>If you have any questions, reply to this email.</p>
    </div>
  `;
  await sendBasicEmail([order.customer_email], subjectCustomer, htmlCustomer, textCustomer);

  const subjectOwner = `Order despatched: ${order.product_name}`;
  const textOwner = `Order marked despatched.\nOrder ID: ${order.id}\nItem: ${order.product_name}`;
  const htmlOwner = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2 style="margin:0 0 16px;">Order despatched</h2>
      <ul>
        <li><strong>Order ID</strong>: ${order.id}</li>
        <li><strong>Item</strong>: ${order.product_name}</li>
      </ul>
    </div>
  `;
  await sendBasicEmail([getOwnerEmail()], subjectOwner, htmlOwner, textOwner);
}



