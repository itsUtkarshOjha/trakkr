type Props = {
  heading: string;
  value: number | null;
  className?: string;
};

export default function AnalysisStatSmallBox({
  heading,
  value,
  className,
}: Props) {
  return (
    <div
      className={`bg-primary-foreground h-auto xl:h-full rounded-xl px-2 py-1 lg:px-4 lg:py-3 xl:px-8 xl:py-6 ${className}`}
    >
      <div className="flex flex-col h-full items-end gap-2 sm:gap-4 justify-evenly">
        <h4 className="uppercase tracking-widest sm:tracking-wider text-[10px] sm:text-[12px] font-extralight text-right">
          {heading}
        </h4>
        <p className="text-2xl sm:text-4xl font-black">{value?.toFixed(2)}</p>
      </div>
    </div>
  );
}
