import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

type ServiceCardProps = {
  title: string;
  onBook: (service: string) => void;
};

export function ServiceCard({ title, onBook }: ServiceCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-50 text-teal-700">
        <Wrench className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Professional support from trained water-care service specialists.
      </p>
      <Button type="button" variant="secondary" className="mt-5 w-full" onClick={() => onBook(title)}>
        Book Service
      </Button>
    </article>
  );
}
