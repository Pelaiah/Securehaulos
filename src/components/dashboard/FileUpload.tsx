'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, File as FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
    onFilesChange: (files: File[]) => void;
}

export function FileUpload({ onFilesChange }: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = [...files, ...acceptedFiles];
        setFiles(newFiles);
        onFilesChange(newFiles);
    }, [files, onFilesChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const removeFile = (fileToRemove: File) => {
        const newFiles = files.filter(file => file !== fileToRemove);
        setFiles(newFiles);
        onFilesChange(newFiles);
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
                        <p>Drop the files here ...</p>
                    ) : (
                        <p>Drag & drop files here, or click to select</p>
                    )}
                     <p className="text-xs">PDF, PNG, JPG accepted</p>
                </div>
            </div>
            {files.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Uploaded files:</h4>
                    <ul className="space-y-2">
                        {files.map((file, index) => (
                            <li key={index} className="flex items-center justify-between bg-muted p-2 rounded-md text-sm">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <FileIcon className="w-4 h-4 shrink-0" />
                                    <span className="truncate">{file.name}</span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(file)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
