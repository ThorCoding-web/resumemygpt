import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (elementId: string, filename: string = 'resume.pdf') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Hide any editing UI elements before capturing
    const editingElements = element.querySelectorAll('.opacity-0, .group-hover\\:opacity-100, button');
    editingElements.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });

    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      ignoreElements: (element) => {
        return element.classList.contains('opacity-0') || 
               element.tagName === 'BUTTON' ||
               element.classList.contains('group-hover:opacity-100');
      }
    });

    // Restore hidden elements
    editingElements.forEach(el => {
      (el as HTMLElement).style.display = '';
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};

export const exportToWord = async (elementId: string, filename: string = 'resume.docx') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Clone the element and clean it up for Word export
    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    // Remove editing UI elements
    const editingElements = clonedElement.querySelectorAll('button, .opacity-0, .group-hover\\:opacity-100');
    editingElements.forEach(el => el.remove());
    
    // Get the cleaned HTML content
    const htmlContent = clonedElement.innerHTML;
    
    // Create a simple HTML document structure
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Resume</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              margin: 20px;
              color: #333;
            }
            .bg-gray-800 { background-color: #1f2937; color: white; }
            .text-white { color: white; }
            .text-gray-300 { color: #d1d5db; }
            .text-gray-600 { color: #4b5563; }
            .text-gray-700 { color: #374151; }
            .text-gray-900 { color: #111827; }
            .text-blue-600 { color: #2563eb; }
            .text-purple-600 { color: #9333ea; }
            .font-bold { font-weight: bold; }
            .font-semibold { font-weight: 600; }
            .font-medium { font-weight: 500; }
            .text-sm { font-size: 0.875rem; }
            .text-lg { font-size: 1.125rem; }
            .text-xl { font-size: 1.25rem; }
            .text-2xl { font-size: 1.5rem; }
            .text-3xl { font-size: 1.875rem; }
            .text-xs { font-size: 0.75rem; }
            .mb-1 { margin-bottom: 0.25rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mb-3 { margin-bottom: 0.75rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mb-6 { margin-bottom: 1.5rem; }
            .mb-8 { margin-bottom: 2rem; }
            .mt-1 { margin-top: 0.25rem; }
            .mt-2 { margin-top: 0.5rem; }
            .mt-4 { margin-top: 1rem; }
            .mt-6 { margin-top: 1.5rem; }
            .p-1 { padding: 0.25rem; }
            .p-2 { padding: 0.5rem; }
            .p-6 { padding: 1.5rem; }
            .p-8 { padding: 2rem; }
            .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
            .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
            .pl-4 { padding-left: 1rem; }
            .pr-2 { padding-right: 0.5rem; }
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .gap-4 { gap: 1rem; }
            .gap-2 { gap: 0.5rem; }
            .flex { display: flex; }
            .flex-wrap { flex-wrap: wrap; }
            .justify-between { justify-content: space-between; }
            .items-start { align-items: flex-start; }
            .items-center { align-items: center; }
            .space-y-1 > * + * { margin-top: 0.25rem; }
            .space-y-2 > * + * { margin-top: 0.5rem; }
            .space-y-4 > * + * { margin-top: 1rem; }
            .border-b { border-bottom: 1px solid #e5e7eb; }
            .border-l-4 { border-left: 4px solid; }
            .border-gray-900 { border-color: #111827; }
            .border-gray-300 { border-color: #d1d5db; }
            .border-purple-200 { border-color: #e9d5ff; }
            .pb-6 { padding-bottom: 1.5rem; }
            .pb-1 { padding-bottom: 0.25rem; }
            .text-center { text-align: center; }
            .uppercase { text-transform: uppercase; }
            .tracking-wide { letter-spacing: 0.025em; }
            .leading-relaxed { line-height: 1.625; }
            .rounded { border-radius: 0.25rem; }
            .rounded-full { border-radius: 9999px; }
            .bg-gray-100 { background-color: #f3f4f6; }
            .bg-blue-100 { background-color: #dbeafe; }
            .bg-purple-100 { background-color: #f3e8ff; }
            .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
            .from-purple-600 { --tw-gradient-from: #9333ea; }
            .to-blue-600 { --tw-gradient-to: #2563eb; }
            ul { list-style: none; padding-left: 0; }
            li { margin-bottom: 0.25rem; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([fullHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.doc') ? filename : filename.replace('.docx', '.doc');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting Word document:', error);
    throw error;
  }
};