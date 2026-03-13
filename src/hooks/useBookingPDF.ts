// ============================================================
// ILT — useBookingPDF
// Génère un PDF de confirmation/facture côté client
// Dépendance : npm install jspdf
// ============================================================

import { useCallback } from 'react';

export interface BookingPDFData {
  reference:     string;
  clientName:    string;
  clientEmail:   string;
  destination:   string;
  travelDate:    string;
  guests:        number | string;
  duration?:     number | string;
  amount:        number;
  paymentMethod: 'stripe' | 'zelle';
  confirmedAt?:  string;
}

export const useBookingPDF = () => {

  const downloadPDF = useCallback(async (data: BookingPDFData) => {

    // Import dynamique pour ne pas alourdir le bundle initial
    const { default: jsPDF } = await import('jspdf');

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const W  = 210; // largeur A4
    const M  = 20;  // marge gauche
    const MR = 190; // marge droite

    // ── Couleurs ──────────────────────────────────────────
    const ROYAL  = [48,  36, 112] as [number, number, number];
    const GOLD   = [245, 166, 35] as [number, number, number];
    const DARK   = [26,  35,  64] as [number, number, number];
    const GRAY   = [138, 149, 176] as [number, number, number];
    const LIGHT  = [238, 234, 248] as [number, number, number];
    const WHITE  = [255, 255, 255] as [number, number, number];
    const GREEN  = [10,  135, 84]  as [number, number, number];

    let y = 0;

    // ── Header bloc violet ────────────────────────────────
    doc.setFillColor(...ROYAL);
    doc.rect(0, 0, W, 52, 'F');

    // Bande or en bas du header
    doc.setFillColor(...GOLD);
    doc.rect(0, 48, W, 4, 'F');

    // Titre
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(...WHITE);
    doc.text('INFINITE LUXURY TRIPS', W / 2, 20, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(245, 166, 35);
    doc.text('BOOKING CONFIRMATION & RECEIPT', W / 2, 30, { align: 'center' });

    doc.setTextColor(...WHITE);
    doc.setFontSize(8);
    doc.text('concierge@infiniteluxurytrips.com  ·  +1 (800) ILT-LUXE', W / 2, 40, { align: 'center' });

    y = 62;

    // ── Bloc référence centré ─────────────────────────────
    doc.setFillColor(...LIGHT);
    doc.roundedRect(M, y, W - M * 2, 28, 4, 4, 'F');
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.5);
    doc.roundedRect(M, y, W - M * 2, 28, 4, 4, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text('BOOKING REFERENCE', W / 2, y + 9, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(...ROYAL);
    doc.text(data.reference, W / 2, y + 21, { align: 'center' });

    y += 36;

    // ── Statut confirmé ───────────────────────────────────
    doc.setFillColor(...GREEN);
    doc.roundedRect(M, y, W - M * 2, 10, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...WHITE);
    doc.text('✓  PAYMENT CONFIRMED', W / 2, y + 6.5, { align: 'center' });

    y += 18;

    // ── Section : Détails de la réservation ───────────────
    const drawSectionTitle = (title: string, yPos: number) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...ROYAL);
      doc.text(title.toUpperCase(), M, yPos);
      doc.setDrawColor(...GOLD);
      doc.setLineWidth(0.8);
      doc.line(M, yPos + 2, MR, yPos + 2);
    };

    const drawRow = (label: string, value: string, yPos: number, highlight = false) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(...GRAY);
      doc.text(label, M, yPos);

      doc.setFont('helvetica', highlight ? 'bold' : 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(highlight ? GOLD[0] : DARK[0], highlight ? GOLD[1] : DARK[1], highlight ? GOLD[2] : DARK[2]);
      doc.text(value, MR, yPos, { align: 'right' });

      // Ligne de séparation légère
      doc.setDrawColor(230, 230, 240);
      doc.setLineWidth(0.2);
      doc.line(M, yPos + 2, MR, yPos + 2);
    };

    // Titre section
    drawSectionTitle('Booking Details', y);
    y += 8;

    const rows: [string, string, boolean?][] = [
      ['Traveler',        data.clientName],
      ['Email',           data.clientEmail],
      ['Destination',     data.destination],
      ['Travel Date',     data.travelDate],
      ['Guests',          `${data.guests} person${Number(data.guests) > 1 ? 's' : ''}`],
      ['Duration',        data.duration ? `${data.duration} nights` : '—'],
      ['Payment Method',  data.paymentMethod === 'stripe' ? 'Credit Card (Stripe)' : 'Zelle Bank Transfer'],
      ['Confirmed On',    data.confirmedAt
        ? new Date(data.confirmedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      ],
    ];

    rows.forEach(([label, value]) => {
      drawRow(label, value, y);
      y += 10;
    });

    y += 4;

    // ── Total ──────────────────────────────────────────────
    doc.setFillColor(...ROYAL);
    doc.roundedRect(M, y, W - M * 2, 16, 3, 3, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...WHITE);
    doc.text('Total Amount Paid', M + 6, y + 10);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...GOLD);
    doc.text(`$${Number(data.amount).toLocaleString('en-US')}`, MR - 6, y + 10, { align: 'right' });

    y += 24;

    // ── Section : Prochaines étapes ───────────────────────
    drawSectionTitle('What Happens Next', y);
    y += 10;

    const steps = [
      '📧  Confirmation email sent to your inbox',
      '📞  Our concierge will contact you within 24 hours',
      '🗺   Full itinerary sent 7 days before departure',
      '💬  24/7 support throughout your journey',
    ];

    steps.forEach(step => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...DARK);
      doc.text(step, M, y);
      y += 8;
    });

    y += 4;

    // ── Politique d'annulation ────────────────────────────
    doc.setFillColor(255, 248, 236);
    doc.roundedRect(M, y, W - M * 2, 20, 3, 3, 'F');
    doc.setDrawColor(245, 166, 35);
    doc.setLineWidth(0.4);
    doc.roundedRect(M, y, W - M * 2, 20, 3, 3, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(212, 136, 26);
    doc.text('CANCELLATION POLICY', M + 4, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 80, 20);
    doc.text(
      'Free cancellation within 48 hours of booking. To request a cancellation, visit',
      M + 4, y + 13
    );
    doc.text(
      'infiniteluxurytrips.com/cancel and enter your booking reference.',
      M + 4, y + 18
    );

    y += 28;

    // ── Footer ────────────────────────────────────────────
    doc.setFillColor(...ROYAL);
    doc.rect(0, 277, W, 20, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...WHITE);
    doc.text('© 2026 Infinite Luxury Trips  ·  Crafted for those who seek the extraordinary', W / 2, 286, { align: 'center' });
    doc.setTextColor(...GOLD);
    doc.text('infiniteluxurytrips.com', W / 2, 292, { align: 'center' });

    // ── Téléchargement ────────────────────────────────────
    doc.save(`ILT-${data.reference}.pdf`);

  }, []);

  return { downloadPDF };
};