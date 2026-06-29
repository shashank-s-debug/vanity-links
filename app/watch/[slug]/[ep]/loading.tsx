import { Spinner } from "@/components/ui";

export default function WatchLoading() {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black">
      <Spinner size={32} />
    </div>
  );
}
