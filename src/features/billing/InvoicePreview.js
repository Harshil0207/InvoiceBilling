'use client';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import JsBarcode from 'jsbarcode';

/* ══════════════════════════════════════════════════════════════════════════════
   STYLED COMPONENTS
══════════════════════════════════════════════════════════════════════════════ */

const Sheet = styled.div`
  background: #ffffff;
  color: #1e293b;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-sizing: border-box;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 12px;
  line-height: 1.5;
  position: relative;
  overflow: hidden;
`;

/* ── Top gradient bar ───────────────────────────────────────────────────────── */
const TopBar = styled.div`
  height: 6px;
  background: linear-gradient(90deg, #1d4ed8 0%, #4f46e5 50%, #7c3aed 100%);
`;

/* ── Header ─────────────────────────────────────────────────────────────────── */
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 28px 16px;
  border-bottom: 1.5px solid #e2e8f0;
  gap: 16px;
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const CompanyName = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
  line-height: 1.2;
`;

const CompanyDetail = styled.div`
  font-size: 10.5px;
  color: #64748b;
  margin-top: 4px;
  line-height: 1.7;
`;

const HeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  min-width: 160px;
`;

const InvoiceTitle = styled.div`
  font-size: 26px;
  font-weight: 900;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #1d4ed8;
  line-height: 1;
`;

const InvoiceMetaGrid = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  gap: 1px 10px;
  text-align: right;
  font-size: 10.5px;
`;

const MetaKey = styled.span`
  color: #94a3b8;
  text-align: right;
  font-weight: 500;
`;

const MetaVal = styled.span`
  color: #0f172a;
  font-weight: 600;
`;

/* ── Status badge ───────────────────────────────────────────────────────────── */
const STATUS_COLORS = {
  Paid:    { bg: '#dcfce7', color: '#16a34a', border: '#86efac' },
  Unpaid:  { bg: '#fef9c3', color: '#ca8a04', border: '#fde047' },
  Overdue: { bg: '#fee2e2', color: '#dc2626', border: '#fca5a5' },
  Partial: { bg: '#e0f2fe', color: '#0284c7', border: '#7dd3fc' },
};

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: ${p => STATUS_COLORS[p.$status]?.bg || '#f1f5f9'};
  color: ${p => STATUS_COLORS[p.$status]?.color || '#64748b'};
  border: 1px solid ${p => STATUS_COLORS[p.$status]?.border || '#e2e8f0'};
`;

/* ── Barcode strip ──────────────────────────────────────────────────────────── */
const BarcodeStrip = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 28px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  gap: 20px;
`;

const BarcodeBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const BarcodeLabel = styled.span`
  font-size: 9px;
  color: #94a3b8;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const BarcodeInfo = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const BarcodeInfoItem = styled.div`
  text-align: center;
`;

const BarcodeInfoLabel = styled.div`
  font-size: 9px;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
`;

const BarcodeInfoValue = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: #0f172a;
  margin-top: 1px;
`;

/* ── Address block ──────────────────────────────────────────────────────────── */
const AddressSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border-bottom: 1px solid #e2e8f0;
`;

const AddressBlock = styled.div`
  padding: 14px 28px;
  ${p => p.$right ? 'border-left: 1px solid #e2e8f0; background: #f8fafc;' : ''}
`;

const AddressLabel = styled.div`
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const AddressName = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 2px;
`;

const AddressDetail = styled.div`
  font-size: 10.5px;
  color: #64748b;
  line-height: 1.6;
`;

/* ── Items table ────────────────────────────────────────────────────────────── */
const TableSection = styled.div`
  padding: 16px 28px 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const THead = styled.thead``;

const TH = styled.th`
  font-size: 9.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  background: #f1f5f9;
  padding: 7px 8px;
  text-align: ${p => p.$right ? 'right' : 'left'};
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;

  &:first-child { border-radius: 4px 0 0 4px; padding-left: 10px; }
  &:last-child  { border-radius: 0 4px 4px 0; padding-right: 10px; }
`;

const TR = styled.tr`
  border-bottom: 1px solid #f1f5f9;

  &:last-child { border-bottom: none; }
`;

const TD = styled.td`
  font-size: 11px;
  padding: 8px;
  vertical-align: middle;
  color: #334155;
  text-align: ${p => p.$right ? 'right' : 'left'};

  &:first-child { padding-left: 10px; }
  &:last-child  { padding-right: 10px; }
`;

const ItemName = styled.div`
  font-weight: 600;
  color: #0f172a;
  font-size: 11.5px;
`;

const DiscountBadge = styled.span`
  font-size: 9.5px;
  color: #ef4444;
  font-weight: 600;
`;

/* ── Totals ─────────────────────────────────────────────────────────────────── */
const BottomSection = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  padding: 16px 28px;
  border-top: 1.5px solid #e2e8f0;
`;

const BankDetails = styled.div`
  flex: 1;
`;

const BankLabel = styled.div`
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #94a3b8;
  margin-bottom: 5px;
`;

const BankText = styled.pre`
  font-size: 10.5px;
  color: #475569;
  line-height: 1.65;
  white-space: pre-wrap;
  font-family: inherit;
`;

const TotalsBox = styled.div`
  width: 220px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
`;

const TotalLineRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 11px;

  &:last-child {
    border-bottom: none;
    background: linear-gradient(90deg, #1d4ed8, #4f46e5);
    color: #fff;
    padding: 9px 12px;
    font-weight: 700;
    font-size: 13px;
  }
`;

const TLineLabel = styled.span`
  color: inherit;
  font-size: inherit;
`;

const TLineValue = styled.span`
  font-weight: 600;
  color: inherit;
`;

/* ── Signature & Footer ─────────────────────────────────────────────────────── */
const SignatureSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border-top: 1px solid #e2e8f0;
  margin: 0 28px;
`;

const SignatureBlock = styled.div`
  padding: 12px 0;
  ${p => p.$right ? 'border-left: 1px solid #e2e8f0; padding-left: 20px;' : ''}
`;

const SignatureLabel = styled.div`
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #94a3b8;
  margin-bottom: 24px;
`;

const SignatureLine = styled.div`
  border-top: 1.5px solid #cbd5e1;
  width: 120px;
  margin-top: 4px;
`;

const SignatureSubLabel = styled.div`
  font-size: 9.5px;
  color: #94a3b8;
  margin-top: 4px;
`;

const PageFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 28px 16px;
  border-top: 1px solid #f1f5f9;
`;

const FooterNote = styled.div`
  font-size: 10px;
  color: #94a3b8;
  font-style: italic;
`;

const ThankYouText = styled.div`
  font-size: 10.5px;
  font-weight: 700;
  color: #1d4ed8;
`;

/* ── Notes bar ──────────────────────────────────────────────────────────────── */
const NotesBar = styled.div`
  margin: 0 28px 4px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  padding: 8px 12px;
`;

const NotesBarLabel = styled.span`
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #3b82f6;
  margin-right: 6px;
`;

const NotesBarText = styled.span`
  font-size: 10.5px;
  color: #1e40af;
`;

/* ══════════════════════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════════════════════ */

const CURRENCY_MAP = { INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'د.إ' };

const fmt = (n, sym = '₹') => `${sym}${(Number(n) || 0).toFixed(2)}`;

const fmtDate = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return d; }
};

const STATUS_DOTS = { Paid: '●', Unpaid: '○', Overdue: '▲', Partial: '◑' };

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════════════════════ */

export default function InvoicePreview({ data }) {
  const barcodeRef = useRef(null);
  const sym = CURRENCY_MAP[data?.currency] || '₹';
  const products = (data?.products || []).filter(p => p.name);
  const status = data?.paymentStatus || 'Unpaid';

  useEffect(() => {
    if (barcodeRef.current && data?.invoiceNumber) {
      try {
        JsBarcode(barcodeRef.current, data.invoiceNumber, {
          format: 'CODE128',
          width: 1.4,
          height: 36,
          displayValue: true,
          fontSize: 9,
          margin: 2,
          background: '#f8fafc',
          lineColor: '#1e293b',
        });
      } catch (e) { console.error('Barcode error:', e); }
    }
  }, [data?.invoiceNumber]);

  return (
    <Sheet id="invoice-capture-node">
      <TopBar />

      {/* ── Header ── */}
      <Header>
        <HeaderLeft>
          <CompanyName>{data?.companyInfo?.name || 'Your Company Name'}</CompanyName>
          <CompanyDetail>
            {data?.companyInfo?.address || 'Company Address'}<br />
            {data?.companyInfo?.gstNumber && <>GSTIN: {data.companyInfo.gstNumber}<br /></>}
            {[data?.companyInfo?.phone, data?.companyInfo?.email].filter(Boolean).join('  ·  ')}
            {data?.companyInfo?.website && <><br />{data.companyInfo.website}</>}
          </CompanyDetail>
        </HeaderLeft>

        <HeaderRight>
          <InvoiceTitle>Invoice</InvoiceTitle>
          <StatusBadge $status={status}>
            {STATUS_DOTS[status]} {status}
          </StatusBadge>
          <InvoiceMetaGrid>
            <MetaKey>Invoice #</MetaKey>
            <MetaVal>{data?.invoiceNumber || '—'}</MetaVal>
            <MetaKey>Date</MetaKey>
            <MetaVal>{fmtDate(data?.invoiceDate)}</MetaVal>
            <MetaKey>Due</MetaKey>
            <MetaVal>{fmtDate(data?.dueDate)}</MetaVal>
            <MetaKey>Payment</MetaKey>
            <MetaVal>{data?.paymentMethod || '—'}</MetaVal>
          </InvoiceMetaGrid>
        </HeaderRight>
      </Header>

      {/* ── Barcode Strip ── */}
      <BarcodeStrip>
        <BarcodeBox>
          <BarcodeLabel>Scan Invoice</BarcodeLabel>
          <svg ref={barcodeRef} />
        </BarcodeBox>
        <BarcodeInfo>
          <BarcodeInfoItem>
            <BarcodeInfoLabel>Invoice No</BarcodeInfoLabel>
            <BarcodeInfoValue>{data?.invoiceNumber || '—'}</BarcodeInfoValue>
          </BarcodeInfoItem>
          <BarcodeInfoItem>
            <BarcodeInfoLabel>Amount Due</BarcodeInfoLabel>
            <BarcodeInfoValue>{fmt(data?.grandTotal, sym)}</BarcodeInfoValue>
          </BarcodeInfoItem>
          <BarcodeInfoItem>
            <BarcodeInfoLabel>Currency</BarcodeInfoLabel>
            <BarcodeInfoValue>{data?.currency || 'INR'}</BarcodeInfoValue>
          </BarcodeInfoItem>
        </BarcodeInfo>
      </BarcodeStrip>

      {/* ── Address Block ── */}
      <AddressSection>
        <AddressBlock>
          <AddressLabel>🏢 From</AddressLabel>
          <AddressName>{data?.companyInfo?.name || '—'}</AddressName>
          <AddressDetail>{data?.companyInfo?.address || '—'}</AddressDetail>
        </AddressBlock>
        <AddressBlock $right>
          <AddressLabel>👤 Bill To</AddressLabel>
          <AddressName>{data?.customerInfo?.name || 'Customer Name'}</AddressName>
          <AddressDetail>
            {data?.customerInfo?.address || '—'}<br />
            {[data?.customerInfo?.phone, data?.customerInfo?.email].filter(Boolean).join('  ·  ')}
            {data?.customerInfo?.gstNumber && <><br />GSTIN: {data.customerInfo.gstNumber}</>}
          </AddressDetail>
        </AddressBlock>
      </AddressSection>

      {/* ── Items Table ── */}
      <TableSection>
        <Table>
          <THead>
            <tr>
              <TH style={{ width: '36%' }}>#  Item</TH>
              <TH $right style={{ width: '7%' }}>Qty</TH>
              <TH $right style={{ width: '14%' }}>Unit Price</TH>
              <TH $right style={{ width: '9%' }}>Tax</TH>
              <TH $right style={{ width: '10%' }}>Discount</TH>
              <TH $right style={{ width: '14%' }}>Amount</TH> 
            </tr>
          </THead>
          <tbody>
            {products.length > 0 ? products.map((item, idx) => (
              <TR key={item.id || idx}>
                <TD>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600, marginTop: '2px', flexShrink: 0 }}>{idx + 1}</span>
                    <ItemName>{item.name}</ItemName>
                  </div>
                </TD>
                <TD $right>{item.quantity || 0}</TD>
                <TD $right>{fmt(item.unitPrice, sym)}</TD>
                <TD $right>
                  {item.taxPercent > 0
                    ? <span style={{ background: '#eff6ff', color: '#1d4ed8', borderRadius: '4px', padding: '1px 5px', fontSize: '10px', fontWeight: 600 }}>{item.taxPercent}%</span>
                    : <span style={{ color: '#94a3b8' }}>—</span>
                  }
                </TD>
                <TD $right>
                  {item.discount > 0
                    ? <DiscountBadge>−{fmt(item.discount, sym)}</DiscountBadge>
                    : <span style={{ color: '#94a3b8' }}>—</span>
                  }
                </TD>
                <TD $right style={{ fontWeight: 700, color: '#0f172a' }}>{fmt(item.total, sym)}</TD>
              </TR>
            )) : (
              <TR>
                <TD colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', padding: '20px' }}>
                  No items added yet
                </TD>
              </TR>
            )}
          </tbody>
        </Table>
      </TableSection>

      {/* ── Totals + Bank Details ── */}
      <BottomSection>
        <BankDetails>
          {data?.bankDetails ? (
            <>
              <BankLabel>🏦 Payment Details</BankLabel>
              <BankText>{data.bankDetails}</BankText>
            </>
          ) : (
            <div style={{ color: '#cbd5e1', fontSize: '11px', fontStyle: 'italic' }}>Bank details will appear here</div>
          )}
        </BankDetails>
        <TotalsBox>
          <TotalLineRow>
            <TLineLabel>Subtotal</TLineLabel>
            <TLineValue>{fmt(data?.subtotal, sym)}</TLineValue>
          </TotalLineRow>
          {(data?.discountTotal > 0) && (
            <TotalLineRow>
              <TLineLabel style={{ color: '#ef4444' }}>Discount</TLineLabel>
              <TLineValue style={{ color: '#ef4444' }}>−{fmt(data.discountTotal, sym)}</TLineValue>
            </TotalLineRow>
          )}
          <TotalLineRow>
            <TLineLabel>GST / Tax</TLineLabel>
            <TLineValue>{fmt(data?.taxTotal, sym)}</TLineValue>
          </TotalLineRow>
          <TotalLineRow>
            <TLineLabel>Grand Total</TLineLabel>
            <TLineValue>{fmt(data?.grandTotal, sym)}</TLineValue>
          </TotalLineRow>
        </TotalsBox>
      </BottomSection>

      {/* ── Notes ── */}
      {data?.notes && (
        <NotesBar>
          <NotesBarLabel>📝 Note:</NotesBarLabel>
          <NotesBarText>{data.notes}</NotesBarText>
        </NotesBar>
      )}

      {/* ── Signature ── */}
      <SignatureSection>
        <SignatureBlock>
          <SignatureLabel>Customer Signature</SignatureLabel>
          <SignatureLine />
          <SignatureSubLabel>{data?.customerInfo?.name || 'Customer Name'}</SignatureSubLabel>
        </SignatureBlock>
        <SignatureBlock $right>
          <SignatureLabel>Authorized Signature</SignatureLabel>
          <SignatureLine />
          <SignatureSubLabel>{data?.companyInfo?.name || 'Company Name'}</SignatureSubLabel>
        </SignatureBlock>
      </SignatureSection>

      {/* ── Footer ── */}
      <PageFooter>
        <FooterNote>
          This is a computer-generated invoice. No physical signature required.
        </FooterNote>
        <ThankYouText>Thank you for your business! 🙏</ThankYouText>
      </PageFooter>
    </Sheet>
  );
}