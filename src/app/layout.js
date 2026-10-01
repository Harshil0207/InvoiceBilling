import StyledComponentsRegistry from "@/lib/registery";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata = {
  title: 'InvoicePro — Invoice Generator',
  description: 'Generate, preview and download professional invoices instantly.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <GlobalStyles />
          <ToastProvider>
            <main style={{
              padding: '16px 24px',
              maxWidth: '100%',
              margin: '0 auto',
              boxSizing: 'border-box',
            }}>
              {children}
            </main>
          </ToastProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}