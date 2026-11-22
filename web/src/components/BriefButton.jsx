import React from 'react';
import { getBriefPdfUrl } from '../api';

export default function BriefButton({ villageId, season = "2027-pre-summer" }) {
  if (!villageId) return null;

  const handleOpenPdf = () => {
    const url = getBriefPdfUrl(villageId, season);
    window.open(url, "_blank");
  };

  return (
    <button 
      type="button" 
      className="btn-brief-pdf" 
      onClick={handleOpenPdf}
      title="Download official 1-page water security brief PDF"
    >
      <span className="pdf-icon">📄</span> Download 1-Page Brief (PDF)
    </button>
  );
}
