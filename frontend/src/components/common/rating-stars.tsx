import { Star } from "lucide-react";

type RatingStarsProps = {
  rating: number;
  reviewCount?: number;
};

export function RatingStars({ rating, reviewCount }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1 text-sm text-slate-500">
      <div className="flex" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${index < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
          />
        ))}
      </div>
      {reviewCount ? <span>({reviewCount})</span> : null}
    </div>
  );
}
