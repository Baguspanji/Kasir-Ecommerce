"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { UploadCloud, X } from "lucide-react";
import { Button } from "./ui/button";

interface ImageUploaderProps {
  value?: string;
  onChange: (value: string) => void;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const aspect = 1;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  }

  const handleCropComplete = (c: PixelCrop) => {
    setCompletedCrop(c);
    if (imgRef.current && c.width && c.height) {
      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      canvas.width = c.width;
      canvas.height = c.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(
          imgRef.current,
          c.x * scaleX,
          c.y * scaleY,
          c.width * scaleX,
          c.height * scaleY,
          0,
          0,
          c.width,
          c.height
        );
        const base64Image = canvas.toDataURL("image/jpeg");
        onChange(base64Image);
      }
    }
  };
  
  const handleRemoveImage = () => {
    setImgSrc("");
    onChange("");
  }
  
  useEffect(() => {
    if(value && value !== imgSrc) {
        setImgSrc(value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  if (imgSrc) {
    return (
      <div className="relative">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={handleCropComplete}
          aspect={aspect}
          minHeight={100}
        >
          <img
            ref={imgRef}
            alt="Crop me"
            src={imgSrc}
            onLoad={onImageLoad}
            className="w-full"
          />
        </ReactCrop>
        <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7"
            onClick={handleRemoveImage}
        >
            <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`w-full aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-colors ${
        isDragActive ? "border-primary bg-accent" : "border-input"
      }`}
    >
      <input {...getInputProps()} />
      <UploadCloud className="w-12 h-12 text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">
        Seret & lepas gambar, atau klik untuk memilih
      </p>
    </div>
  );
}
