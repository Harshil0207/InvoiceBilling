'use client';
import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import styled from 'styled-components';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const FormGrid = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  background: var(--card);
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary);
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const schema = z.object({
  challanNumber: z.string().min(1),
  invoiceNumber: z.string().min(1, 'Associated Invoice Ref Required'),
  dispatchDate: z.string().min(1, 'Required'),
  deliveryNotes: z.string().optional(),
  customerDetails: z.object({
    name: z.string().min(1, 'Required'),
    mobileNumber: z.string().min(10, 'Invalid Phone'),
  }),
  deliveryAddress: z.string().min(1, 'Destination Address Required'),
  products: z.array(z.object({
    name: z.string().min(1, 'Required'),
    sku: z.string().min(1, 'Required'),
    quantity: z.number().min(1)
  })).min(1, 'At least one dynamic item allocation stream required')
});

export default function DeliveryForm({ onDataChange, initialData }) {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      challanNumber: `DC-${Date.now().toString().slice(-6)}`,
      invoiceNumber: '',
      dispatchDate: new Date().toISOString().split('T')[0],
      deliveryNotes: '',
      customerDetails: { name: '', mobileNumber: '' },
      deliveryAddress: '',
      products: [{ name: '', sku: '', quantity: 1 }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "products" });
  const watchedValues = watch();

  useEffect(() => {
    onDataChange(watchedValues);
  }, [JSON.stringify(watchedValues)]);

  return (
    <FormGrid onSubmit={handleSubmit((d) => console.log('Challan validated:', d))}>
      <div>
        <SectionTitle>Manifest Configuration</SectionTitle>
        <Row>
          <Input label="Challan Token ID" readOnly {...register('challanNumber')} />
          <Input label="Invoice Source Cross-Ref" error={errors.invoiceNumber?.message} {...register('invoiceNumber')} />
          <Input label="Dispatch Date" type="date" error={errors.dispatchDate?.message} {...register('dispatchDate')} />
        </Row>
      </div>

      <div>
        <SectionTitle>Consignee Node</SectionTitle>
        <Row>
          <Input label="Client Descriptor Name" error={errors.customerDetails?.name?.message} {...register('customerDetails.name')} />
          <Input label="Contact Mobile No" error={errors.customerDetails?.mobileNumber?.message} {...register('customerDetails.mobileNumber')} />
        </Row>
        <Input label="Terminal Destination Route Address" error={errors.deliveryAddress?.message} {...register('deliveryAddress')} />
      </div>

      <div>
        <SectionTitle>Consignment Resource Cargo Allocation</SectionTitle>
        {fields.map((field, idx) => (
          <Row key={field.id} style={{ marginBottom: '0.75rem', alignItems: 'flex-end' }}>
            <Input label="Cargo Name" {...register(`products.${idx}.name`)} />
            <Input label="SKU Identifier" {...register(`products.${idx}.sku`)} />
            <Input label="Allocation Unit Count" type="number" {...register(`products.${idx}.quantity`, { valueAsNumber: true })} />
            <Button type="button" variant="danger" style={{ marginBottom: '1rem' }} onClick={() => remove(idx)}>Delete</Button>
          </Row>
        ))}
        <Button type="button" variant="secondary" onClick={() => append({ name: '', sku: '', quantity: 1 })}>
          Add Line Item Element
        </Button>
      </div>

      <Input label="Operational Delivery Routing Notes" {...register('deliveryNotes')} />
    </FormGrid>
  );
}