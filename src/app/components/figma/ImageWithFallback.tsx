import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
}

export function ImageWithFallback({ src, alt, className, fallbackSrc, ...props }: ImageWithFallbackProps) {
    const [error, setError] = useState(false);

    return error ? (
        <div className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)}>
            <ImageOff className="size-8 opacity-50" />
        </div>
    ) : (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
            {...props}
        />
    );
}
