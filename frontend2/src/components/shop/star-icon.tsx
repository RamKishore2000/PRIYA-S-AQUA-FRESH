type StarIconProps = {
  className?: string;
};

export function StarIcon({ className }: StarIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m12 2.8 2.84 5.75 6.34.92-4.59 4.48 1.08 6.32L12 17.29l-5.67 2.98 1.08-6.32-4.59-4.48 6.34-.92L12 2.8Z"
        fill="currentColor"
      />
    </svg>
  );
}
