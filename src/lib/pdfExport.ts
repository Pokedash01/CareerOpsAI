import { jsPDF } from 'jspdf';
import { UserProfile, TailoredContent } from '../types.js';

export function exportResumePdf(profile: UserProfile, tailored?: TailoredContent) {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter',
  });

  const margin = 40;
  let y = 45;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;

  // Header: Candidate Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(20, 24, 33);
  doc.text(profile.full_name, margin, y);
  y += 18;

  // Contact Info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(80, 85, 95);
  const contactLine = [
    profile.contact.email,
    profile.contact.phone,
    profile.contact.location || profile.preferred_locations?.[0] || 'India',
    profile.contact.links,
  ]
    .filter(Boolean)
    .join('  |  ');
  doc.text(contactLine, margin, y);
  y += 12;

  // Horizontal divider
  doc.setDrawColor(200, 205, 215);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + contentWidth, y);
  y += 16;

  // Professional Summary
  const summaryText = tailored?.summary ||
    `${profile.full_name} is a results-driven professional with ${profile.total_years_experience} years of hands-on experience specializing in ${profile.skills.slice(0, 5).join(', ')}. Demonstrated success delivering high-impact automation and cross-functional solutions.`;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('PROFESSIONAL SUMMARY', margin, y);
  y += 13;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(summaryText, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 12 + 8;

  // Key Skills
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('TECHNICAL & DOMAIN COMPETENCIES', margin, y);
  y += 13;

  const skillsList = tailored?.skills_ordered?.length ? tailored.skills_ordered : profile.skills;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const skillsString = skillsList.join('  •  ');
  const skillLines = doc.splitTextToSize(skillsString, contentWidth);
  doc.text(skillLines, margin, y);
  y += skillLines.length * 12 + 10;

  // Work Experience
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('PROFESSIONAL EXPERIENCE', margin, y);
  y += 14;

  const experienceItems = tailored?.experience?.length ? tailored.experience : profile.experience;

  for (const exp of experienceItems) {
    const origExp = profile.experience.find((e) => e.company.toLowerCase() === exp.company.toLowerCase());
    const role = origExp?.role || 'Analyst';
    const dates = origExp?.dates || '';
    const loc = origExp?.location ? ` - ${origExp.location}` : '';

    if (y > 700) {
      doc.addPage();
      y = 40;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`${role}  |  ${exp.company}${loc}`, margin, y);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    const dateWidth = doc.getTextWidth(dates);
    doc.text(dates, margin + contentWidth - dateWidth, y);
    y += 13;

    // Bullets
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);

    for (const bullet of exp.bullets || []) {
      if (y > 730) {
        doc.addPage();
        y = 40;
      }
      const bulletLines = doc.splitTextToSize(`•  ${bullet}`, contentWidth - 8);
      doc.text(bulletLines, margin + 8, y);
      y += bulletLines.length * 11 + 3;
    }
    y += 6;
  }

  // Education
  if (profile.education?.length) {
    if (y > 690) {
      doc.addPage();
      y = 40;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('EDUCATION & CERTIFICATIONS', margin, y);
    y += 13;

    for (const edu of profile.education) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${edu.degree}  -  ${edu.institution}`, margin, y);

      if (edu.dates) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        const dWidth = doc.getTextWidth(edu.dates);
        doc.text(edu.dates, margin + contentWidth - dWidth, y);
      }
      y += 12;

      if (edu.details) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text(edu.details, margin, y);
        y += 12;
      }
    }

    if (profile.certifications?.length) {
      y += 4;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      const certsText = `Certifications: ${profile.certifications.join('  |  ')}`;
      const certLines = doc.splitTextToSize(certsText, contentWidth);
      doc.text(certLines, margin, y);
      y += certLines.length * 11;
    }
  }

  const safeName = profile.full_name.replace(/\s+/g, '_');
  const safeComp = (tailored?.company || 'Tailored').replace(/\s+/g, '_');
  doc.save(`Resume_${safeComp}_${safeName}.pdf`);
}

export function exportCoverLetterPdf(profile: UserProfile, tailored: TailoredContent) {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter',
  });

  const margin = 50;
  let y = 55;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;

  // Candidate Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(profile.full_name, margin, y);
  y += 16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`${profile.contact.email}  |  ${profile.contact.phone}  |  ${profile.contact.location || 'India'}`, margin, y);
  y += 14;

  doc.setDrawColor(220, 226, 235);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + contentWidth, y);
  y += 24;

  // Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), margin, y);
  y += 22;

  // Recipient info
  doc.setFont('helvetica', 'bold');
  doc.text(`Hiring Team`, margin, y);
  y += 14;
  doc.setFont('helvetica', 'normal');
  doc.text(tailored.company, margin, y);
  y += 14;
  doc.text(`Re: Application for ${tailored.job_title}`, margin, y);
  y += 24;

  // Salutation
  doc.text(`Dear Hiring Manager,`, margin, y);
  y += 18;

  // Paragraphs
  for (const para of tailored.cover_letter_paragraphs || []) {
    const lines = doc.splitTextToSize(para, contentWidth);
    if (y + lines.length * 14 > 720) {
      doc.addPage();
      y = 50;
    }
    doc.text(lines, margin, y);
    y += lines.length * 14 + 12;
  }

  y += 8;
  doc.text(`Sincerely,`, margin, y);
  y += 16;
  doc.setFont('helvetica', 'bold');
  doc.text(profile.full_name, margin, y);

  const safeComp = tailored.company.replace(/\s+/g, '_');
  const safeName = profile.full_name.replace(/\s+/g, '_');
  doc.save(`CoverLetter_${safeComp}_${safeName}.pdf`);
}
