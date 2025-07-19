import React from "react";
import img1 from "../../Images/Marca1.png"
import img2 from "../../Images/Marca2.png"
import img3 from "../../Images/Marca3.png"
import img4 from "../../Images/Marca4.png"
import img5 from "../../Images/Marca5.png"
import img6 from "../../Images/Marca6.png"
import img7 from "../../Images/Marca7.png"

export default function LogosBar() {
  const logos = [
    img1, img2, img3, img4, img5, img6, img7
  ];

  return (
    <div className="overflow-hidden py-1">
      <div className="relative w-full">
        <div className="animate-marquee flex gap-8 whitespace-nowrap">
          {logos.map((src, i) => (
            <img key={`logo1-${i}`} src={src} alt="logo" className="h-16 grayscale opacity-85" />
          ))}
          {logos.map((src, i) => (
            <img key={`logo2-${i}`} src={src} alt="logo" className="h-16 grayscale opacity-85" />
          ))}
        </div>
      </div>
    </div>
  );
}
