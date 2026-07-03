type RewardCountBadgeProps = {
  count: number;
  ringClassName?: string;
};

export default function RewardCountBadge({
  count,
  ringClassName = "border-[#fcf2dd]",
}: RewardCountBadgeProps) {
  if (count <= 0) return null;

  const label = count > 99 ? "99+" : String(count);

  return (
    <span
      className={`absolute -right-0.5 -top-0.5 z-10 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 bg-[#e02b1d] px-1 text-[10px] font-bold leading-none text-white shadow-sm ${ringClassName}`}
      aria-label={`${count} rewards available`}
    >
      {label}
    </span>
  );
}
