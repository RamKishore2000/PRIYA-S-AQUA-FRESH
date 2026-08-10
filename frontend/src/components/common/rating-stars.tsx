import { Star } from "lucide-react";

type RatingStarsProps = {
  rating: number;
  reviewCount?: number;
  showText?: boolean;
};

export function RatingStars({ rating, reviewCount, showText = true }: RatingStarsProps) {
  const safeRating = Number.isFinite(Number(rating)) ? Number(rating) : 0;
  const safeReviewCount = Number.isFinite(Number(reviewCount)) ? Number(reviewCount) : 0;
  const clampedRating = Math.max(0, Math.min(5, safeRating));

  return (
    <div className="flex items-center gap-1 text-sm text-slate-500">
      <div className="flex" aria-label={`${clampedRating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, index) => {
          const fillPercent = Math.max(0, Math.min(1, clampedRating - index)) * 100;

          return (
            <span key={index} className="relative h-4 w-4">
              <Star className="absolute inset-0 h-4 w-4 text-slate-300" />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercent}%` }}>
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              </span>
            </span>
          );
        })}
      </div>
      {showText ? (
        <>
          <span className="font-semibold text-slate-700">{clampedRating.toFixed(1)}</span>
          <span>({safeReviewCount} reviews)</span>
        </>
      ) : null}
    </div>
  );
}
