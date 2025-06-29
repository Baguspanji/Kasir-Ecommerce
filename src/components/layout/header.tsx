import SyncStatusIndicator from "@/components/sync-status-indicator";

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

export default function Header({ title, children }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <div className="flex items-center gap-4">
        <SyncStatusIndicator />
        {children}
      </div>
    </div>
  );
}
