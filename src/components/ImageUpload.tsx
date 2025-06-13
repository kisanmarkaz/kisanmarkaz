import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
import { Button } from './ui/button';

export interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onFileSelect,
  accept = 'image/jpeg,image/jpg,image/png,image/webp',
  maxSize = 5 * 1024 * 1024, // 5MB default
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      alert(`File size should not exceed ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    if (!accept.split(',').includes(file.type)) {
      alert('File type not supported');
      return;
    }

    onFileSelect(file);
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        style={{ display: 'none' }}
      />
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        disabled={disabled}
      >
        <Camera className="w-4 h-4 mr-2" />
        Upload Image
      </Button>
    </div>
  );
}; 