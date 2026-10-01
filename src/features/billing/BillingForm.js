'use client';
import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import styled from 'styled-components';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

/* ─── Styled Components ─────────────────────────────────────────────────────── */
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Section = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: var(--muted);
  border-bottom: 1px solid var(--border);
`;

const SectionLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const SectionIcon = styled.span`
  font-size: 0.95rem;
  line-height: 1;
`;

const SectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted-foreground);
`;

const SectionBody = styled.div`
  padding: 1rem 1.25rem 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0 0.875rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

/* Items table layout */
const ItemsTableWrap = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  /* Show a subtle horizontal scroll hint on small screens */
  @media (max-width: 640px) {
    border-bottom: 1px solid var(--border);
  }
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
`;

const ItemsTh = styled.th`
  background: var(--muted);
  color: var(--muted-foreground);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.5rem 0.625rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
`;

const ItemsTr = styled.tr`
  border-bottom: 1px solid var(--border-light);

  &:last-child {
    border-bottom: none;
  }

  &:hover td {
    background: #f8fafc;
  }
`;

const ItemsTd = styled.td`
  padding: 0.375rem 0.625rem;
  vertical-align: middle;
`;

const AddItemFooter = styled.div`
  padding: 0.75rem 1.25rem;
  border-top: 1px solid var(--border);
  background: var(--muted);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const RemoveBtn = styled.button`
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: #fff;
  color: #ef4444;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  flex-shrink: 0;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: #fef2f2;
    border-color: #ef4444;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.5rem 0.625rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--background);
  color: var(--foreground);
  font-size: 0.8125rem;
  outline: none;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.15s;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
  }
`;

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 1rem;
  width: 100%;
`;

const SelectLabel = styled.label`
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--foreground);
`;

const TaxBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.1rem 0.5rem;
  white-space: nowrap;
`;

const SmallInput = styled.input`
  width: 100%;
  padding: 0.4rem 0.5rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--background);
  color: var(--foreground);
  font-size: 0.8125rem;
  outline: none;
  font-family: inherit;
  transition: border-color 0.15s;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
  }
`;

const ItemTaxSelect = styled(SmallInput).attrs({ as: 'select' })``;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8125rem;
  padding: 0.2rem 0;
  color: var(--muted-foreground);

  strong {
    color: var(--foreground);
    font-weight: 700;
  }
`;

/* ─── Zod Schema ─────────────────────────────────────────────────────────────── */
const schema = z.object({
  invoiceNumber: z.string().min(1),
  invoiceDate: z.string().min(1, 'Required'),
  dueDate: z.string().optional(),
  currency: z.enum(['INR', 'USD', 'EUR', 'GBP', 'AED']),
  paymentMethod: z.enum(['UPI', 'Bank Transfer', 'Credit Card', 'Cash', 'Cheque']),
  paymentStatus: z.enum(['Unpaid', 'Paid', 'Partial', 'Overdue']),
  companyInfo: z.object({
    name: z.string().min(1, 'Required'),
    address: z.string().min(1, 'Required'),
    gstNumber: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    website: z.string().optional(),
  }),
  customerInfo: z.object({
    name: z.string().min(1, 'Required'),
    address: z.string().min(1, 'Required'),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    gstNumber: z.string().optional(),
  }),
  products: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, 'Required'),
    description: z.string().optional(),
    quantity: z.number().min(0),
    unitPrice: z.number().min(0),
    taxPercent: z.number().min(0),
    discount: z.number().min(0),
    total: z.number(),
  })).min(1),
  notes: z.string().optional(),
  bankDetails: z.string().optional(),
});

const CURRENCIES = { INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'د.إ' };
const TAX_OPTIONS = [0, 5, 12, 18, 28];

/* ─── Component ──────────────────────────────────────────────────────────────── */
export default function BillingForm({ onDataChange, initialData }) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      currency: 'INR',
      paymentMethod: 'UPI',
      paymentStatus: 'Unpaid',
      companyInfo: { name: '', address: '', gstNumber: '', phone: '', email: '', website: '' },
      customerInfo: { name: '', address: '', phone: '', email: '', gstNumber: '' },
      products: [{ id: '1', name: '', description: '', quantity: 1, unitPrice: 0, taxPercent: 18, discount: 0, total: 0 }],
      notes: '',
      bankDetails: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'products' });
  const watchedValues = watch();
  const currency = CURRENCIES[watchedValues.currency] || '₹';

  // Real-time totals + preview propagation
  useEffect(() => {
    let subtotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;

    const products = watchedValues.products || [];
    products.forEach((prod, index) => {
      const base = (prod.quantity || 0) * (prod.unitPrice || 0);
      const disc = Math.min(prod.discount || 0, base);
      const taxable = base - disc;
      const tax = taxable * ((prod.taxPercent || 0) / 100);
      const lineTotal = taxable + tax;

      if (prod.total !== lineTotal) {
        setValue(`products.${index}.total`, Number(lineTotal.toFixed(2)), { shouldValidate: false });
      }

      subtotal += base;
      discountTotal += disc;
      taxTotal += tax;
    });

    const grandTotal = subtotal - discountTotal + taxTotal;

    onDataChange({
      ...watchedValues,
      currency,
      subtotal: Number(subtotal.toFixed(2)),
      discountTotal: Number(discountTotal.toFixed(2)),
      taxTotal: Number(taxTotal.toFixed(2)),
      grandTotal: Number(grandTotal.toFixed(2)),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watchedValues)]);

  return (
    <FormContainer>

      {/* ── Invoice Details ── */}
      <Section>
        <SectionHeader>
          <SectionLeft>
            <SectionIcon>🧾</SectionIcon>
            <SectionTitle>Invoice Details</SectionTitle>
          </SectionLeft>
        </SectionHeader>
        <SectionBody>
          <Input label="Invoice #" readOnly {...register('invoiceNumber')} />
          <Input label="Invoice Date" type="date" error={errors.invoiceDate?.message} {...register('invoiceDate')} />
          <Input label="Due Date" type="date" {...register('dueDate')} />

          <SelectWrapper>
            <SelectLabel>Currency</SelectLabel>
            <StyledSelect {...register('currency')}>
              <option value="INR">₹ INR — Indian Rupee</option>
              <option value="USD">$ USD — US Dollar</option>
              <option value="EUR">€ EUR — Euro</option>
              <option value="GBP">£ GBP — British Pound</option>
              <option value="AED">د.إ AED — UAE Dirham</option>
            </StyledSelect>
          </SelectWrapper>

          <SelectWrapper>
            <SelectLabel>Payment Method</SelectLabel>
            <StyledSelect {...register('paymentMethod')}>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
            </StyledSelect>
          </SelectWrapper>

          <SelectWrapper>
            <SelectLabel>Payment Status</SelectLabel>
            <StyledSelect {...register('paymentStatus')}>
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Overdue">Overdue</option>
            </StyledSelect>
          </SelectWrapper>
        </SectionBody>
      </Section>

      {/* ── From (Company) ── */}
      <Section>
        <SectionHeader>
          <SectionLeft>
            <SectionIcon>🏢</SectionIcon>
            <SectionTitle>From — Your Company</SectionTitle>
          </SectionLeft>
        </SectionHeader>
        <SectionBody>
          <Input label="Company Name *" error={errors.companyInfo?.name?.message} {...register('companyInfo.name')} />
          <Input label="GSTIN" {...register('companyInfo.gstNumber')} />
          <Input label="Phone" {...register('companyInfo.phone')} />
          <Input label="Email" type="email" {...register('companyInfo.email')} />
          <Input label="Website" placeholder="https://yoursite.com" {...register('companyInfo.website')} />
          <FullWidth>
            <Input label="Address *" error={errors.companyInfo?.address?.message} {...register('companyInfo.address')} />
          </FullWidth>
        </SectionBody>
      </Section>

      {/* ── Bill To (Customer) ── */}
      <Section>
        <SectionHeader>
          <SectionLeft>
            <SectionIcon>👤</SectionIcon>
            <SectionTitle>Bill To — Customer</SectionTitle>
          </SectionLeft>
        </SectionHeader>
        <SectionBody>
          <Input label="Customer Name *" error={errors.customerInfo?.name?.message} {...register('customerInfo.name')} />
          <Input label="GSTIN" {...register('customerInfo.gstNumber')} />
          <Input label="Phone" {...register('customerInfo.phone')} />
          <Input label="Email" type="email" {...register('customerInfo.email')} />
          <FullWidth>
            <Input label="Billing Address *" error={errors.customerInfo?.address?.message} {...register('customerInfo.address')} />
          </FullWidth>
        </SectionBody>
      </Section>

      {/* ── Line Items ── */}
      <Section>
        <SectionHeader>
          <SectionLeft>
            <SectionIcon>📦</SectionIcon>
            <SectionTitle>Items</SectionTitle>
          </SectionLeft>
          <TaxBadge>{fields.length} item{fields.length !== 1 ? 's' : ''}</TaxBadge>
        </SectionHeader>

        <ItemsTableWrap>
          <ItemsTable>
            <thead>
              <tr>
                <ItemsTh style={{ width: '30%' }}>Item / Description</ItemsTh>
                <ItemsTh style={{ width: '7%' }}>Qty</ItemsTh>
                <ItemsTh style={{ width: '14%' }}>Unit Price</ItemsTh>
                <ItemsTh style={{ width: '10%' }}>Tax %</ItemsTh>
                <ItemsTh style={{ width: '12%' }}>Discount</ItemsTh>
                <ItemsTh style={{ width: '14%', textAlign: 'right' }}>Total</ItemsTh>
                <ItemsTh style={{ width: '4%' }}></ItemsTh>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, idx) => {
                const prod = watchedValues.products?.[idx] || {};
                return (
                  <ItemsTr key={field.id}>
                    <ItemsTd>
                      <SmallInput
                        placeholder="Item name"
                        {...register(`products.${idx}.name`)}
                      />
                    </ItemsTd>
                    <ItemsTd>
                      <SmallInput
                        type="number"
                        min="0"
                        step="1"
                        placeholder="1"
                        {...register(`products.${idx}.quantity`, { valueAsNumber: true })}
                      />
                    </ItemsTd>
                    <ItemsTd>
                      <SmallInput
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...register(`products.${idx}.unitPrice`, { valueAsNumber: true })}
                      />
                    </ItemsTd>
                    <ItemsTd>
                      <ItemTaxSelect {...register(`products.${idx}.taxPercent`, { valueAsNumber: true })}>
                        {TAX_OPTIONS.map(t => (
                          <option key={t} value={t}>{t}%</option>
                        ))}
                      </ItemTaxSelect>
                    </ItemsTd>
                    <ItemsTd>
                      <SmallInput
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...register(`products.${idx}.discount`, { valueAsNumber: true })}
                      />
                    </ItemsTd>
                    <ItemsTd style={{ textAlign: 'right', fontWeight: 600, color: '#0f172a', fontSize: '0.8125rem' }}>
                      {currency}{(prod.total || 0).toFixed(2)}
                    </ItemsTd>
                    <ItemsTd>
                      <RemoveBtn type="button" onClick={() => remove(idx)} title="Remove">×</RemoveBtn>
                    </ItemsTd>
                  </ItemsTr>
                );
              })}
            </tbody>
          </ItemsTable>
        </ItemsTableWrap>

        <AddItemFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => append({ id: Date.now().toString(), name: '', description: '', quantity: 1, unitPrice: 0, taxPercent: 18, discount: 0, total: 0 })}
            style={{ fontSize: '0.8125rem', padding: '0.4rem 0.875rem' }}
          >
            + Add Item
          </Button>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            <SummaryRow>
              <span>Subtotal</span>
              <strong>{currency}{(watchedValues.products || []).reduce((s, p) => s + (p.quantity || 0) * (p.unitPrice || 0), 0).toFixed(2)}</strong>
            </SummaryRow>
            <SummaryRow>
              <span>Discount</span>
              <strong style={{ color: '#ef4444' }}>−{currency}{(watchedValues.products || []).reduce((s, p) => s + (p.discount || 0), 0).toFixed(2)}</strong>
            </SummaryRow>
          </div>
        </AddItemFooter>
      </Section>

      {/* ── Bank Details ── */}
      <Section>
        <SectionHeader>
          <SectionLeft>
            <SectionIcon>🏦</SectionIcon>
            <SectionTitle>Bank / Payment Details</SectionTitle>
          </SectionLeft>
        </SectionHeader>
        <SectionBody>
          <FullWidth>
            <textarea
              {...register('bankDetails')}
              placeholder={`Bank: HDFC Bank\nAccount No: 1234567890\nIFSC: HDFC0001234\nBranch: Mumbai`}
              rows={3}
              style={{
                width: '100%',
                padding: '0.5rem 0.625rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                background: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '0.8125rem',
                resize: 'vertical',
                outline: 'none',
                marginBottom: '1rem',
                fontFamily: 'inherit',
                lineHeight: 1.6,
              }}
            />
          </FullWidth>
        </SectionBody>
      </Section>

      {/* ── Notes ── */}
      <Section>
        <SectionHeader>
          <SectionLeft>
            <SectionIcon>📝</SectionIcon>
            <SectionTitle>Notes & Terms</SectionTitle>
          </SectionLeft>
        </SectionHeader>
        <SectionBody>
          <FullWidth>
            <textarea
              {...register('notes')}
              placeholder="e.g. Payment due within 15 days. Thank you for your business!"
              rows={2}
              style={{
                width: '100%',
                padding: '0.5rem 0.625rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                background: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '0.8125rem',
                resize: 'vertical',
                outline: 'none',
                marginBottom: '1rem',
                fontFamily: 'inherit',
                lineHeight: 1.6,
              }}
            />
          </FullWidth>
        </SectionBody>
      </Section>

    </FormContainer>
  );
}