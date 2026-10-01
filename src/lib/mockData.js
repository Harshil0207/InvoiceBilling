export const mockDashboardMetrics = {
  totalInvoices: 1240,
  pendingDeliveries: 42,
  deliveredOrders: 1198,
  totalRevenue: 348920.50
};

export const sampleCompanyProfile = {
  name: "Apex Logistics Tech Ltd.",
  address: "Industrial Enterprise Estate, Phase II, Fleet Corridor 40001",
  gstNumber: "27AAAAA0000A1Z5",
  contactNumber: "18005559876",
  email: "billing@apexlogistics.io"
};

export const defaultMockInvoicesLedger = [
  {
    invoiceNumber: "INV-982104",
    orderDate: "2026-06-01",
    deliveryDate: "2026-06-04",
    paymentMethod: "UPI",
    deliveryStatus: "Dispatched",
    companyInfo: sampleCompanyProfile,
    customerInfo: {
      name: "Quantum Retail Infrastructure Corp",
      address: "Terminal Plaza Suite 9, North Sector Hub",
      mobileNumber: "9876543210",
      email: "procurement@quantumretail.com",
      gstNumber: "27BBBBB1111B1Z2"
    },
    products: [
      { id: "p1", name: "High-Bandwidth Networking Node Module", sku: "HW-NODE-09", quantity: 5, unitPrice: 420.00, taxPercent: 18, discount: 50.00, total: 2419.00 }
    ],
    subtotal: 2100.00,
    discountTotal: 50.00,
    gstTotal: 369.00,
    grandTotal: 2419.00
  }
];