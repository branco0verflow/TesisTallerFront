import React, { useEffect } from "react";

/**
 * ProfessionalSpinner – SK‑Chase loader (color‑cycle version)
 * ------------------------------------------------------------------
 * ▸ Seis puntos persiguiéndose (Spinkit style)
 * ▸ Colores por vuelta:
 *       1ª vuelta  → azul claro  (#bfdbfe)
 *       2ª vuelta  → rojo claro  (#fecaca)
 *       3ª vuelta  → blanco      (#ffffff)
 *   Luego reinicia ciclo.
 * ▸ Full‑screen overlay, responsive.
 */
const ProfessionalSpinner = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      /* ---------- keyframes ---------- */
      @keyframes sk-chase      { 100% { transform: rotate(360deg); } }
      @keyframes sk-chase-dot  { 80%,100% { transform: rotate(360deg); } }
      @keyframes sk-chase-dot-before {
        50% { transform: scale(0.4); }
        0%,100% { transform: scale(1); }
      }
      /* 3‑cycle color change (7.5 s → 3 × 2.5 s) */
      @keyframes color-cycle {
        0%,33%   { background-color:#46C2A0; } /* light blue */
        33.01%,66%{ background-color:#991750; } /* light red  */
        66.01%,100%{ background-color:#178A99; } /* white      */
      }

      /* ---------- overlay ---------- */
      .sk-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(174, 208, 201, 0.1);backdrop-filter:blur(2px);z-index:10500;}

      /* ---------- spinner ---------- */
      .sk-chase{width:80px;height:80px;position:relative;animation:sk-chase 2.5s linear infinite;}
      .sk-chase-dot{width:100%;height:100%;position:absolute;left:0;top:0;animation:sk-chase-dot 2s ease-in-out infinite;}

      .sk-chase-dot:before{content:"";display:block;width:25%;height:25%;border-radius:50%;animation:sk-chase-dot-before 2s ease-in-out infinite, color-cycle 7.5s linear infinite;}

      /* phase delays */
      .sk-chase-dot:nth-child(1)  { animation-delay:-1.1s; }
      .sk-chase-dot:nth-child(2)  { animation-delay:-1.0s; }
      .sk-chase-dot:nth-child(3)  { animation-delay:-0.9s; }
      .sk-chase-dot:nth-child(4)  { animation-delay:-0.8s; }
      .sk-chase-dot:nth-child(5)  { animation-delay:-0.7s; }
      .sk-chase-dot:nth-child(6)  { animation-delay:-0.6s; }
      .sk-chase-dot:nth-child(1):before{animation-delay:-1.1s,0s;}
      .sk-chase-dot:nth-child(2):before{animation-delay:-1.0s,0s;}
      .sk-chase-dot:nth-child(3):before{animation-delay:-0.9s,0s;}
      .sk-chase-dot:nth-child(4):before{animation-delay:-0.8s,0s;}
      .sk-chase-dot:nth-child(5):before{animation-delay:-0.7s,0s;}
      .sk-chase-dot:nth-child(6):before{animation-delay:-0.6s,0s;}

      /* ---------- responsive ---------- */
      @media(max-width:480px){
        .sk-chase{width:60px;height:60px;}
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="sk-overlay" role="alert" aria-label="Cargando…">
      <div className="sk-chase">
        <div className="sk-chase-dot" />
        <div className="sk-chase-dot" />
        <div className="sk-chase-dot" />
        <div className="sk-chase-dot" />
        <div className="sk-chase-dot" />
        <div className="sk-chase-dot" />
      </div>
    </div>
  );
};

export default ProfessionalSpinner;
