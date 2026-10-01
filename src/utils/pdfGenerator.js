import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Exports a DOM element as a single-page PDF, scaled to fit A4 exactly.
 * No extra pages are generated — the content is shrunk/scaled to fit one page.
 */
export const exportElementToPDF = async (elementId, filename) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Render at 2x resolution for sharp barcode / text rendering
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageW = 210;  // A4 width in mm
  const pageH = 297;  // A4 height in mm

  // Scale the image to fit within one A4 page, maintaining aspect ratio
  const canvasRatio = canvas.height / canvas.width;
  const imgW = pageW;
  const imgH = pageW * canvasRatio;

  // If taller than one page, shrink to fit
  const finalW = imgH > pageH ? (pageH / canvasRatio) : imgW;
  const finalH = imgH > pageH ? pageH : imgH;

  // Center vertically if there's whitespace
  const offsetY = (pageH - finalH) / 2;

  pdf.addImage(imgData, 'PNG', 0, offsetY > 0 ? offsetY : 0, finalW, finalH);

  pdf.save(`${filename}.pdf`);
};