import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Load } from '@/lib/data';
import {
  ArrowRight,
  MapPin,
  Truck,
  Crown,
  Pencil,
  Trash2,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface LoadCardProps {
  load: Load;
  isShipperView?: boolean;
  // carrier eligibility hints
  carrierEquipmentTypes?: string[];
  carrierDocCount?: number;
  onGetLoadClick?: () => void;
  onEditLoadClick?: (load: Load) => void;
  onReviewApplicationClick?: (load: Load) => void;
  onDeleteLoadClick?: (loadId: string) => void;
}

export function LoadCard({
  load,
  isShipperView = false,
  carrierEquipmentTypes = [],
  carrierDocCount = 0,
  onGetLoadClick,
  onEditLoadClick,
  onReviewApplicationClick,
  onDeleteLoadClick,
}: LoadCardProps) {
  const statusBadge = {
    Posted: 'text-blue-500 border-blue-500/30 bg-blue-500/10',
    Pending: 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10 animate-pulse',
    'In Transit': 'text-green-500 border-green-500/30 bg-green-500/10',
    Completed: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10',
  }[load.status || 'Posted'];

  // Carrier-side compatibility check
  const equipmentMatch =
    carrierEquipmentTypes.length === 0 ||
    carrierEquipmentTypes.some(
      (t) => t.toLowerCase() === load.equipment.toLowerCase()
    );

  const requiredDocs = load.requiredDocuments ?? ['Proof of Insurance', 'Carrier Authority', 'W-9 Form'];

  return (
    <Card className="flex flex-col justify-between hover:shadow-md transition-all border-[#e2e4dd]">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <CardTitle className="font-headline text-lg mb-1">{load.cargo}</CardTitle>
            <CardDescription className="text-xs">
              Shipped by <strong className="text-foreground">{load.shipper}</strong>
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {load.isPremium && (
              <Badge variant="outline" className="border-accent text-accent text-[11px] py-0">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
            <Badge variant="outline" className={`text-[10px] font-semibold ${statusBadge}`}>
              {load.status || 'Posted'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow pb-3">
        {/* Route */}
        <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 mr-1.5 text-primary shrink-0" />
          <span className="truncate">{load.origin}</span>
          <ArrowRight className="w-3.5 h-3.5 mx-2 text-muted-foreground shrink-0" />
          <span className="truncate">{load.destination}</span>
        </div>

        <Separator />

        <div className="mt-3 flex justify-between items-center text-sm">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Truck className="w-4 h-4 text-muted-foreground" />
            <span>{load.equipment}</span>

            {/* Carrier equipment compatibility chip */}
            {!isShipperView && carrierEquipmentTypes.length > 0 && (
              equipmentMatch ? (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#2c7350] bg-[#e7f4ee] px-1.5 py-0.5 rounded-full ml-1">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Match
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full ml-1">
                  <AlertCircle className="w-2.5 h-2.5" /> No match
                </span>
              )
            )}
          </div>
          <div className="text-right">
            <p className="text-[11px] text-muted-foreground">Target Payout</p>
            <p className="font-bold text-base sm:text-lg text-green-600 font-mono">
              ${load.payout.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Carrier: required docs summary */}
        {!isShipperView && requiredDocs.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#82877c]">
            <FileText className="w-3 h-3 text-[#82877c]" />
            <span>Requires:</span>
            {requiredDocs.slice(0, 2).map((d) => (
              <span
                key={d}
                className="px-1.5 py-0.5 rounded bg-[#f2f3ef] border border-[#e2e4dd] text-[10px] font-medium"
              >
                {d}
              </span>
            ))}
            {requiredDocs.length > 2 && (
              <span className="text-[10px] text-[#b4b8ac]">+{requiredDocs.length - 2} more</span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t border-[#e2e4dd]/60 flex gap-2">
        {isShipperView ? (
          <>
            {load.status === 'Pending' ? (
              <Button
                className="flex-1 bg-[#2c7350] hover:bg-[#235c40] text-white text-xs h-9"
                onClick={() => onReviewApplicationClick?.(load)}
              >
                <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                Review Carrier Request
              </Button>
            ) : (
              <Button
                variant="outline"
                className="flex-1 text-xs h-9 hover:bg-black/5"
                onClick={() => onEditLoadClick?.(load)}
              >
                <Pencil className="w-3.5 h-3.5 mr-1.5" />
                Edit Load
              </Button>
            )}
            {onDeleteLoadClick && load.status !== 'In Transit' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-destructive"
                onClick={() => onDeleteLoadClick(load.id)}
                title="Archive / Remove Load"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </>
        ) : (
          <Button
            className={
              load.status === 'Posted' && equipmentMatch
                ? 'w-full text-xs h-9 bg-[#2c7350] hover:bg-[#235c40] text-white font-semibold'
                : 'w-full text-xs h-9'
            }
            onClick={onGetLoadClick}
            disabled={load.status !== 'Posted'}
          >
            {load.status === 'Posted'
              ? equipmentMatch
                ? '✓ Get This Load'
                : 'Get Load (Equipment Mismatch)'
              : `Unavailable (${load.status})`}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
