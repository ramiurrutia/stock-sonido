export function Skeleton({ 
  width = "",
  height = "",
  className = "" 
}: { 
  width?: string;
  height?: string;
  className?: string;
}) {
  return (
    <div className={`bg-zinc-700 rounded-lg animate-pulse ${width} ${height} ${className}`} />
  );
}