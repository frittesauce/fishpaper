"use client"
import Image from 'next/image';
import { useState, useEffect } from 'react';

const ImageHover = ({ src, alt, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1.5); // default 300/200

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setAspectRatio(img.naturalWidth / img.naturalHeight);
    };
    img.src = src;
  }, [src]);

  // Calculate hover dimensions based on aspect ratio
  const getHoverDimensions = () => {
    if (aspectRatio > 1.5) {
      // Wide image - keep height 200, adjust width
      return { width: Math.round(200 * aspectRatio), height: 200 };
    } else {
      // Tall image - keep width 300, adjust height
      return { width: 300, height: Math.round(300 / aspectRatio) };
    }
  };

  const hoverDims = getHoverDimensions();

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Normal state container - maintains layout space */}
      <div
        className="relative cursor-pointer overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-[300px] h-[200px]"
        tabIndex={0}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        onFocus={() => setIsExpanded(true)}
        onBlur={() => setIsExpanded(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        role="button"
        aria-label={`View full size image: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
      </div>

      {/* Expanded state - absolutely positioned overlay */}
      {isExpanded && (
        <div
          className="absolute z-50 overflow-hidden rounded-lg shadow-2xl pointer-events-none"
          style={{
            width: `${hoverDims.width}px`,
            height: `${hoverDims.height}px`,
            top: `${(200 - hoverDims.height) / 2}px`,
            left: `${(300 - hoverDims.width) / 2}px`,
            transition: 'all 0.3s ease-in-out'
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default ImageHover;