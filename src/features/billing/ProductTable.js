'use client';
import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
  margin-top: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.875rem;
`;

const Th = styled.th`
  background: var(--muted);
  color: var(--muted-foreground);
  padding: 0.75rem 1rem;
  font-weight: 600;
  border-bottom: 1px solid var(--border);
`;

const Td = styled.td`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
  color: var(--foreground);
`;

export default function ProductTable({ items = [] }) {
  if (items.length === 0) {
    return (
      <TableContainer style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
        No items loaded into runtime ledger matrix.
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <Th>Product Spec</Th>
            <Th>SKU Reference</Th>
            <Th>Qty</Th>
            <Th>Unit Rate</Th>
            <Th>Tax</Th>
            <Th>Line Total</Th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id || idx}>
              <Td style={{ fontWeight: 500 }}>{item.name || 'Unnamed Spec'}</Td>
              <Td>{item.sku || 'N/A'}</Td>
              <Td>{item.quantity || 0}</Td>
              <Td>${(item.unitPrice || 0).toFixed(2)}</Td>
              <Td>{item.taxPercent || 0}%</Td>
              <Td style={{ fontWeight: 600 }}>${(item.total || 0).toFixed(2)}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}