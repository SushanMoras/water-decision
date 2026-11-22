import React from 'react';

export default function ShareButton({ village, forecast, topAction }) {
  if (!village) return null;

  const handleShare = () => {
    const balMid = forecast?.balance_ml?.mid != null ? `${Math.round(forecast.balance_ml.mid)} ML` : "N/A";
    const actTitle = topAction?.title || "Crop diversification & conservation";
    const currentUrl = window.location.href;

    const message = `Village Water Brief: ${village.name} (${village.district})
Stress Category: ${village.stress_class.toUpperCase()} (${Math.round(village.stress_score?.mid || 0)}%)
Projected Net Balance: ${balMid}
Top Recommended Action: ${actTitle}

Explore details & what-if scenarios: ${currentUrl}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button 
      type="button" 
      className="btn-share-whatsapp" 
      onClick={handleShare}
      title="Share village water summary via WhatsApp"
    >
      Share Brief
    </button>
  );
}
