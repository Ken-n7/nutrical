export function localDateStamp(date = new Date()) {
  return date.toLocaleDateString('en-CA');
}

export function buildPdfFilename(name, date = new Date()) {
  const base =
    (name || '')
      .trim()
      .replace(/[^\w]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50) || '';
  const stamp = localDateStamp(date);
  return base ? `MealPlan-${base}-${stamp}.pdf` : `MealPlan-${stamp}.pdf`;
}

export async function downloadMealPlanPdf(patient) {
  const el = document.querySelector('.meal-plan-print');
  if (!el) throw new Error('Meal plan print content not found');

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
  });

  const img = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin * 2;
  const imgHeight = (canvas.height * contentWidth) / canvas.width;

  let heightLeft = imgHeight;
  pdf.addImage(img, 'PNG', margin, margin, contentWidth, imgHeight);
  heightLeft -= contentHeight;
  while (heightLeft > 0) {
    pdf.addPage();
    pdf.addImage(img, 'PNG', margin, margin - (imgHeight - heightLeft), contentWidth, imgHeight);
    heightLeft -= contentHeight;
  }

  const filename = buildPdfFilename(patient?.name);
  pdf.save(filename);
  return filename;
}