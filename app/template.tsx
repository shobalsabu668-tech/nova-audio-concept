import { RevealObserver } from "@/components/ui/reveal-observer";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-in flex flex-1 flex-col">
      {children}
      <RevealObserver />
    </div>
  );
}
