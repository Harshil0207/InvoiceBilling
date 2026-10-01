'use client';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import JsBarcode from 'jsbarcode';

const ContainerA4 = styled.div`
  background: #ffffff;
  color: #000000;
  padding: 3rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const BlockRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const LogTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  
  th, td {
    border: 1px solid #94a3b8;
    padding: 0.65rem;
    text-align: left;
    font-size: 0.875rem;
  }
  th {
    background: #f8fafc;
  }
`;

const SignatureBlock = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  padding-top: 4rem;
`;

const SigLine = styled.div`
  border-top: 1px dashed #000000;
  width: 200px;
  text-align: center;
  font-size: 0.8125rem;
  padding-top: 0.5rem;
`;

export default function DeliveryPreview({ data }) {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current && data?.challanNumber) {
      try {
        JsBarcode(barcodeRef.current, data.challanNumber, {
          format: "CODE128",
          width: 1.4,
          height: 35,
          displayValue: true
        });
      } catch (err) {
        console.error("Challan barcode stream failure:", err);
      }
    }
  }, [data?.challanNumber]);

  return (
    <ContainerA4 id="delivery-challan-node">
      <div>
        <BlockRow style={{ borderBottom: '2px solid #0f172a', paddingBottom: '1rem' }}>
          <div>
            <h1>DELIVERY CHALLAN</h1>
            <p style={{ color: '#475569', fontSize: '0.875rem' }}>Non-Commercial Transit Manifest Document</p>
          </div>
          <svg ref={barcodeRef}></svg>
        </BlockRow>

        <BlockRow>
          <div>
            <h4 style={{ textTransform: 'uppercase', color: '#475569', fontSize: '0.75rem' }}>Consignee Destination</h4>
            <p style={{ fontWeight: 600 }}>{data?.customerDetails?.name || '---'}</p>
            <p style={{ fontSize: '0.875rem', maxWidth: '320px' }}>{data?.deliveryAddress || '---'}</p>
            <p style={{ fontSize: '0.875rem' }}>Tel: {data?.customerDetails?.mobileNumber || '---'}</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.875rem' }}>
            <p><strong>Challan ID:</strong> {data?.challanNumber}</p>
            <p><strong>Source Invoice Ref:</strong> {data?.invoiceNumber || '---'}</p>
            <p><strong>Dispatch Horizon:</strong> {data?.dispatchDate}</p>
          </div>
        </BlockRow>

        <LogTable>
          <thead>
            <tr>
              <th style={{ width: '10%' }}>Index</th>
              <th>Resource Element Descriptor</th>
              <th>SKU Identifier Token</th>
              <th style={{ width: '15%' }}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {data?.products?.map((prod, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{prod.name || '---'}</td>
                <td>{prod.sku || '---'}</td>
                <td>{prod.quantity || 0}</td>
              </tr>
            ))}
          </tbody>
        </LogTable>

        {data?.deliveryNotes && (
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '4px', fontSize: '0.8125rem', border: '1px solid #e2e8f0' }}>
            <strong>Routing & Logistics Directives:</strong> {data.deliveryNotes}
          </div>
        )}
      </div>

      <SignatureBlock>
        <SigLine>Authorized Dispatcher Signatory</SigLine>
        <SigLine>Receiver / Customer Sign-Off</SigLine>
      </SignatureBlock>
    </ContainerA4>
  );
}