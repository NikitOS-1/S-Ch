interface InfoCardProps {
  children: React.ReactNode;
}

export function InfoCard({ children }: InfoCardProps) {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 shadow-sm">
      {children}
    </div>
  );
}
