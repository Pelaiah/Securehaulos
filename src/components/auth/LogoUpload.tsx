'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface LogoUploadProps {
    onFileChange: (file: File | null) => void;
}

export function LogoUpload({ onFileChange }: LogoUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const acceptedFile = acceptedFiles[0];
            setFile(acceptedFile);
            onFileChange(acceptedFile);
            if (preview) {
                URL.revokeObjectURL(preview);
            }
            setPreview(URL.createObjectURL(acceptedFile));
        }
    }, [onFileChange, preview]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.svg'] },
        multiple: false,
    });

    const removeFile = () => {
        setFile(null);
        onFileChange(null);
        if (preview) {
            URL.revokeObjectURL(preview);
            setPreview(null);
        }
    };

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer transition-colors",
                    isDragActive ? "border-primary bg-primary/10" : "hover:border-muted-foreground/50"
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <UploadCloud className="w-8 h-8" />
                    {isDragActive ? (
                        <p>Drop the logo here...</p>
                    ) : (
                        <p>Drag & drop your logo, or click to select</p>
                    )}
                    <p className="text-xs">PNG, JPG, or GIF</p>
                </div>
            </div>
            {preview && file && (
                <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Logo Preview:</h4>
                    <div className="flex items-center justify-between bg-muted p-2 rounded-md text-sm">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <Image src={preview} alt="Logo preview" width={40} height={40} className="rounded-sm object-contain" />
                            <span className="truncate">{file.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removeFile}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
