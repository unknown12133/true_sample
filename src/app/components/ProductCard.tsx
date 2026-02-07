import { useState, useEffect, useRef } from 'react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { CheckCircle2, ChevronDown, ChevronUp, Edit3, Trash2 } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface ProductDescription {
  Features: { [key: string]: string };
  Description: string;
}

interface ProductCardProps {
  product_id: string;
  name: string;
  category: string;
  description: ProductDescription;
  prices: { [key: string]: number };
  image: string;
  is_active: boolean;
}

export function ProductCard({
  product_id,
  name,
  category,
  description,
  prices,
  image,
  is_active,
  onEdit,
  onDelete
}: ProductCardProps & { onEdit?: () => void; onDelete?: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  // Close description when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (descriptionRef.current && !descriptionRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  // Use the first price as the primary display price
  const priceEntries = Object.entries(prices);

  return (
    <Card className="group flex flex-col h-full overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/40 bg-card/50 backdrop-blur-sm">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <ImageWithFallback
          src={image}
          alt={name}
          className="size-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className={`${is_active ? 'bg-green-500' : 'bg-gray-400'} text-white shadow-lg border-none`}>
            {is_active ? 'Available' : 'Unavailable'}
          </Badge>
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-primary/20 text-primary">
            {category}
          </Badge>
        </div>

        {/* Product ID Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-[10px] font-mono opacity-60 group-hover:opacity-100 transition-opacity">
            {product_id}
          </Badge>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-1 space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>

          {/* Description Section */}
          <div className="relative" ref={descriptionRef}>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {description.Description}
            </p>

            {description.Description.length > 60 && !isExpanded && (
              <button
                onClick={() => setIsExpanded(true)}
                className="text-[10px] font-bold text-primary hover:text-primary/80 mt-1 flex items-center gap-0.5 transition-colors group/read"
              >
                Read More <ChevronDown className="size-3 group-hover/read:translate-y-0.5 transition-transform" />
              </button>
            )}

            {/* Expanded Description Overlay */}
            {isExpanded && (
              <div className="absolute top-[-8px] left-[-8px] right-[-8px] z-50 bg-background/95 backdrop-blur-md p-3 rounded-lg shadow-xl border border-border">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {description.Description}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                  className="text-[10px] font-bold text-primary hover:text-primary/80 mt-2 flex items-center gap-0.5 transition-colors group/read"
                >
                  Show Less <ChevronUp className="size-3 group-hover/read:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {Object.entries(description.Features).map(([key, value], idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-[10px] text-muted-foreground whitespace-nowrap overflow-hidden">
              <CheckCircle2 className="size-3 text-primary shrink-0" />
              <span className="truncate" title={value}>{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto space-y-4 pt-2">
          {/* Price Variations */}
          <div className="flex flex-wrap gap-2">
            {priceEntries.map(([unit, value], idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center px-3 py-1.5 rounded-lg border border-primary bg-primary/10 text-primary transition-all shadow-sm hover:shadow-md hover:bg-primary/20"
              >
                <span className="text-[10px] font-bold uppercase tracking-tight opacity-70">{unit}</span>
                <span className="text-sm font-bold">₹{value}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={onEdit}
              variant="outline"
              className="flex-1 bg-background hover:bg-primary/5 border-primary/20 text-primary font-semibold relative overflow-hidden group"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={onDelete}
              variant="destructive"
              size="icon"
              className="shrink-0 shadow-sm"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
