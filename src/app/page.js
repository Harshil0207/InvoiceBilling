'use client';
import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import BillingForm from '@/features/billing/BillingForm';
import InvoicePreview from '@/features/billing/InvoicePreview';
import { exportElementToPDF } from '@/utils/pdfGenerator';

/* ══════════════════════════════════════════════════════════════════════════════
   ANIMATIONS
══════════════════════════════════════════════════════════════════════════════ */
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideUp = keyframes`from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; }`;
const pulseAnim = keyframes`0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); }`;

/* ══════════════════════════════════════════════════════════════════════════════
   PAGE SHELL
══════════════════════════════════════════════════════════════════════════════ */
const PageWrapper = styled.div`
  padding-bottom: 5rem;
  min-height: 100vh;
`;

/* ── Header ───────────────────────────────────────────────────────────────── */
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  gap: 0.75rem;
  padding: 0.875rem 0;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
`;

const PageTitleGroup = styled.div`
  min-width: 0;
`;

const PageTitle = styled.h1`
  font-size: clamp(1.1rem, 3vw, 1.375rem);
  font-weight: 800;
  color: var(--foreground);
  letter-spacing: -0.025em;
  line-height: 1.2;
  white-space: nowrap;
`;

const PageSubtitle = styled.p`
  font-size: 0.75rem;
  color: var(--muted-foreground);
  margin-top: 0.1rem;

  @media (max-width: 480px) {
    display: none;
  }
`;

const LiveDot = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #dcfce7;
  color: #16a34a;
  border: 1px solid #86efac;
  border-radius: 999px;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    background: #16a34a;
    border-radius: 50%;
    animation: ${pulseAnim} 1.5s ease-in-out infinite;
  }
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const IconBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.875rem;
  border-radius: var(--radius);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s;
  white-space: nowrap;
  font-family: inherit;

  background: ${p => p.$primary ? 'var(--primary)' : '#ffffff'};
  color: ${p => p.$primary ? '#ffffff' : 'var(--foreground)'};
  border-color: ${p => p.$primary ? 'transparent' : 'var(--border)'};
  box-shadow: ${p => p.$primary
    ? '0 2px 8px rgba(37,99,235,0.25)'
    : '0 1px 3px rgba(0,0,0,0.06)'};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${p => p.$primary
      ? '0 4px 14px rgba(37,99,235,0.35)'
      : '0 3px 8px rgba(0,0,0,0.1)'};
    ${p => !p.$primary && 'border-color: var(--primary); color: var(--primary);'}
  }

  &:active { transform: translateY(0); }

  /* Hide label on very small screens, show only icon */
  .btn-label {
    @media (max-width: 480px) {
      display: none;
    }
  }
`;

const CopyBtn = styled(IconBtn)`
  @media (max-width: 600px) {
    display: none;
  }
`;

/* ── Summary chips bar ────────────────────────────────────────────────────── */
const SummaryBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
`;

const SummaryChip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  font-size: 0.8125rem;
  flex-shrink: 0;
`;

const ChipLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted-foreground);
`;

const ChipValue = styled.span`
  font-weight: 700;
  color: ${p => p.$color || 'var(--foreground)'};
`;

/* ── Split layout ─────────────────────────────────────────────────────────── */
const SplitLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  align-items: flex-start;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

/* ── Panel label ──────────────────────────────────────────────────────────── */
const PanelLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.625rem;
`;

const PanelLabelText = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--muted-foreground);
  white-space: nowrap;
`;

const PanelDivider = styled.div`
  flex: 1;
  height: 1px;
  background: var(--border);
`;

/* ── Desktop Preview panel (hidden on mobile) ─────────────────────────────── */
const DesktopPreviewPanel = styled.div`
  position: sticky;
  top: 5rem;

  @media (max-width: 899px) {
    display: none;
  }
`;

const PreviewOuter = styled.div`
  overflow-x: auto;
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04);
  border: 1px solid var(--border);
`;

/* ── Mobile sticky "Preview" FAB ──────────────────────────────────────────── */
const MobilePreviewFAB = styled.button`
  display: none;
  position: fixed;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;

  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 4px 20px rgba(37,99,235,0.4);
  transition: transform 0.15s, box-shadow 0.15s;
  white-space: nowrap;

  &:hover {
    transform: translateX(-50%) translateY(-2px);
    box-shadow: 0 6px 24px rgba(37,99,235,0.5);
  }

  @media (max-width: 899px) {
    display: inline-flex;
  }
`;

/* ── Modal overlay ────────────────────────────────────────────────────────── */
const ModalOverlay = styled.div`
  display: ${p => p.$open ? 'flex' : 'none'};
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.55);
  align-items: flex-start;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
  animation: ${p => p.$open ? css`${fadeIn} 0.2s ease` : 'none'};
  -webkit-overflow-scrolling: touch;
`;

const ModalSheet = styled.div`
  background: #fff;
  border-radius: 14px;
  width: 100%;
  max-width: 820px;
  margin: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  overflow: hidden;
  animation: ${p => p.$open ? css`${slideUp} 0.25s ease` : 'none'};
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const ModalTitle = styled.h2`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #0f172a;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ModalCloseBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  font-size: 1.125rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;

  &:hover {
    background: #fef2f2;
    color: #ef4444;
    border-color: #fca5a5;
  }
`;

const ModalBody = styled.div`
  overflow-x: auto;
  background: #f1f5f9;
  padding: 1rem;
`;

export default function InvoiceGeneratorPage() {
  const [liveData, setLiveData] = useState({});
  const [copying, setCopying] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const sym = { INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'د.إ' }[liveData?.currency] || '₹';
  const itemCount = (liveData?.products || []).filter(p => p.name).length;
  const grandTotal = liveData?.grandTotal || 0;
  const discountTotal = liveData?.discountTotal || 0;
  const taxTotal = liveData?.taxTotal || 0;

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = previewOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [previewOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setPreviewOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleCopy = async () => {
    if (!liveData.invoiceNumber) return;
    try {
      await navigator.clipboard.writeText(liveData.invoiceNumber);
      setCopying(true);
      setTimeout(() => setCopying(false), 1500);
    } catch { /* silent */ }
  };

  const handleDownload = () =>
    exportElementToPDF('invoice-capture-node', `Invoice-${liveData.invoiceNumber || 'Draft'}`);

  return (
    <PageWrapper>

      {/* ── Header ── */}
      <PageHeader>
        <HeaderLeft>
          <PageTitleGroup>
            <PageTitle>Invoice Generator</PageTitle>
            <PageSubtitle>Fill the form — preview updates live</PageSubtitle>
          </PageTitleGroup>
          <LiveDot>Live</LiveDot>
        </HeaderLeft>

        <ActionBar>
          <CopyBtn onClick={handleCopy} title="Copy invoice number">
            {copying ? '✓' : '#'} <span className="btn-label">{copying ? 'Copied!' : liveData.invoiceNumber || '—'}</span>
          </CopyBtn>
          <IconBtn onClick={() => window.print()}>
            🖨 <span className="btn-label">Print</span>
          </IconBtn>
          <IconBtn $primary onClick={handleDownload}>
            ⬇ <span className="btn-label">Download PDF</span>
          </IconBtn>
        </ActionBar>
      </PageHeader>

      {/* ── Summary chips ── */}
      <SummaryBar>
        <SummaryChip>
          <ChipLabel>Items</ChipLabel>
          <ChipValue>{itemCount}</ChipValue>
        </SummaryChip>
        {discountTotal > 0 && (
          <SummaryChip>
            <ChipLabel>Discount</ChipLabel>
            <ChipValue $color="#ef4444">−{sym}{discountTotal.toFixed(2)}</ChipValue>
          </SummaryChip>
        )}
        {taxTotal > 0 && (
          <SummaryChip>
            <ChipLabel>GST / Tax</ChipLabel>
            <ChipValue>{sym}{taxTotal.toFixed(2)}</ChipValue>
          </SummaryChip>
        )}
        <SummaryChip>
          <ChipLabel>Total</ChipLabel>
          <ChipValue $color="#1d4ed8">{sym}{grandTotal.toFixed(2)}</ChipValue>
        </SummaryChip>
        <SummaryChip>
          <ChipLabel>Status</ChipLabel>
          <ChipValue $color={
            liveData?.paymentStatus === 'Paid' ? '#16a34a' :
            liveData?.paymentStatus === 'Overdue' ? '#dc2626' :
            liveData?.paymentStatus === 'Partial' ? '#0284c7' : '#ca8a04'
          }>
            {liveData?.paymentStatus || 'Unpaid'}
          </ChipValue>
        </SummaryChip>
      </SummaryBar>

      {/* ── Split Layout ── */}
      <SplitLayout>

        {/* Left — Form */}
        <div>
          <PanelLabel>
            <PanelLabelText>📋 Invoice Form</PanelLabelText>
            <PanelDivider />
          </PanelLabel>
          <BillingForm onDataChange={setLiveData} />
        </div>

        {/* Right — Desktop preview (hidden on mobile) */}
        <DesktopPreviewPanel>
          <PanelLabel>
            <PanelLabelText>👁 Live Preview</PanelLabelText>
            <PanelDivider />
          </PanelLabel>
          <PreviewOuter>
            <InvoicePreview data={liveData} />
          </PreviewOuter>
        </DesktopPreviewPanel>

      </SplitLayout>

      {/* ── Mobile FAB — Preview Invoice ── */}
      <MobilePreviewFAB onClick={() => setPreviewOpen(true)}>
        👁 Preview Invoice
      </MobilePreviewFAB>

      {/* ── Preview Modal (mobile + tablet) ── */}
      <ModalOverlay $open={previewOpen} onClick={(e) => { if (e.target === e.currentTarget) setPreviewOpen(false); }}>
        <ModalSheet $open={previewOpen}>
          <ModalHeader>
            <ModalTitle>📄 Invoice Preview</ModalTitle>
            <ModalActions>
              <IconBtn onClick={handleDownload} $primary style={{ fontSize: '0.8125rem', padding: '0.4rem 0.875rem' }}>
                ⬇ Download PDF
              </IconBtn>
              <ModalCloseBtn onClick={() => setPreviewOpen(false)} title="Close">×</ModalCloseBtn>
            </ModalActions>
          </ModalHeader>
          <ModalBody>
            <InvoicePreview data={liveData} />
          </ModalBody>
        </ModalSheet>
      </ModalOverlay>

    </PageWrapper>
  );
}