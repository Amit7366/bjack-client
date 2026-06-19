import { providerIconSrc } from "@/lib/provider-icons";

type ProviderLogoProps = {
  providerKey: string;
  initials: string;
  color: string;
  size?: "sm" | "md";
};

const SIZE_CLASS = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-[10px]",
} as const;

export default function ProviderLogo({
  providerKey,
  initials,
  color,
  size = "md",
}: ProviderLogoProps) {
  const iconSrc = providerIconSrc(providerKey);
  const sizeClass = SIZE_CLASS[size];

  if (iconSrc) {
    return (
      <div
        className={`${sizeClass} flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#1a1a1a]`}
      >
        <img src={iconSrc} alt="" className="h-full w-full object-contain p-0.5" />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-md font-bold text-[#111]`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}
