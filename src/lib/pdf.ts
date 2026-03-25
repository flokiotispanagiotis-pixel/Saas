import PDFDocument from 'pdfkit';
import { CompanySettings, Sales, SaleItem, Customer } from '@prisma/client';
import { prisma } from './db';
import { Readable } from 'stream';

export async function generateInvoicePdf(saleId: number) {
  const sale = await prisma.sales.findUnique({
    where: { id: saleId },
    include: { items: { include: { product: true } }, customer: true }
  });
  if (!sale) throw new Error('Sale not found');

  const settings = await prisma.companySettings.findFirst();
  const doc = new PDFDocument({ margin: 40 });

  const chunks: Buffer[] = [];
  const stream = doc.on('data', (chunk) => chunks.push(chunk));

  // Header
  doc.fontSize(18).text(settings?.business_name || 'Business Name');
  doc.fontSize(10).text(settings?.address || '');
  doc.text(`VAT: ${settings?.vat_number || ''} - Tax Office: ${settings?.tax_office || ''}`);
  doc.moveDown();

  doc.fontSize(14).text('INVOICE', { align: 'right' });
  doc.fontSize(10).text(`Invoice No: ${sale.invoice_number}`, { align: 'right' });
  doc.text(`Date: ${sale.date.toISOString().slice(0, 10)}`, { align: 'right' });

  doc.moveDown();
  doc.text(`Customer: ${sale.customer.name}`);
  if (sale.customer.address) doc.text(`Address: ${sale.customer.address}`);
  if (sale.customer.vat_number) doc.text(`VAT: ${sale.customer.vat_number}`);

  doc.moveDown();
  doc.text('Items:');
  doc.moveDown(0.5);

  sale.items.forEach((item) => {
    doc.text(
      `${item.product.name} | Qty: ${item.qty} | Price: ${item.price.toFixed(2)} | Subtotal: ${item.subtotal.toFixed(2)}`
    );
  });

  doc.moveDown();
  doc.fontSize(12).text(`Total: ${sale.total_amount.toFixed(2)} €`, { align: 'right' });

  if (settings?.invoice_notes) {
    doc.moveDown();
    doc.fontSize(9).text(settings.invoice_notes);
  }

  doc.end();

  return await new Promise<Buffer>((resolve) => {
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

export async function generateDeliveryNotePdf(saleId: number) {
  const sale = await prisma.sales.findUnique({
    where: { id: saleId },
    include: { items: { include: { product: true } }, customer: true }
  });
  if (!sale) throw new Error('Sale not found');

  const settings = await prisma.companySettings.findFirst();
  const doc = new PDFDocument({ margin: 40 });
  const chunks: Buffer[] = [];
  const stream = doc.on('data', (chunk) => chunks.push(chunk));

  doc.fontSize(18).text(settings?.business_name || 'Business Name');
  doc.fontSize(10).text('DELIVERY NOTE', { align: 'right' });
  doc.text(`No: ${sale.invoice_number}`, { align: 'right' });
  doc.text(`Date: ${sale.date.toISOString().slice(0, 10)}`, { align: 'right' });

  doc.moveDown();
  doc.text(`Customer: ${sale.customer.name}`);
  if (sale.customer.address) doc.text(`Address: ${sale.customer.address}`);

  doc.moveDown();
  doc.text('Delivered Items:');
  sale.items.forEach((item) => {
    doc.text(`${item.product.name} | Qty: ${item.qty}`);
  });

  doc.end();

  return await new Promise<Buffer>((resolve) => {
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}
