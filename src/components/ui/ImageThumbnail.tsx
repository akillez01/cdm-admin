import { Image as ImageIcon } from 'lucide-react';
import React from 'react';

interface ImageThumbnailProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ 
  src, 
  alt, 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  if (!src) {
    return (
      <div className={`${sizeClasses[size]} ${className} bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600`}>
        <ImageIcon size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} className="text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `
              <div class="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <svg class="text-gray-400" width="${size === 'sm' ? 16 : size === 'md' ? 20 : 24}" height="${size === 'sm' ? 16 : size === 'md' ? 20 : 24}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
              </div>
            `;
          }
        }}
      />
    </div>
  );
};

export default ImageThumbnail;
