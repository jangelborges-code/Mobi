import React, { useState, useCallback, useRef } from 'react';
import { ImageFile } from '../../../types';
import { fileToImageFile } from '../../../utils/imageHelpers';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  image: ImageFile | null;
  onImageUpload: (image: ImageFile) => void;
  onError: (message: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ image, onImageUpload, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    try {
      const imageFile = await fileToImageFile(file);
      onImageUpload(imageFile);
    } catch (error) {
        if (error instanceof Error) {
            onError(error.message);
        } else {
            onError("Ocurrió un error desconocido al procesar el archivo.");
        }
    }
  }, [onImageUpload, onError]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const borderColor = image ? 'border-[#ff5500]' : isDragging ? 'border-[#ff5500]' : 'border-[#d1ccc9]';
  const borderStyle = image ? 'border-solid' : 'border-dashed';

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full h-full bg-white/50 rounded-lg border-2 ${borderColor} ${borderStyle} flex items-center justify-center transition-colors duration-300 cursor-pointer overflow-hidden group`}
    >
      <input type="file" ref={fileInputRef} onChange={handleChange} className="hidden" accept="image/*" />
      {image ? (
        <>
          <img src={`data:${image.mimeType};base64,${image.base64}`} alt="Habitación subida" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-white font-semibold">Cambiar Imagen</p>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500">
          <UploadIcon className="w-12 h-12 mx-auto text-[#0d624e]" />
          <p className="mt-2 font-semibold">Haz clic para subir o arrastra y suelta</p>
          <p className="text-sm">PNG, JPG, WEBP</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
