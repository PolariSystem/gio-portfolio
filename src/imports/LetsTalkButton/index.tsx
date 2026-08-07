type LetsTalkButtonProps = {
  className?: string;
  property1?: "Default" | "Variant3";
};

export default function LetsTalkButton({ className, property1 = "Default" }: LetsTalkButtonProps) {
  const isDefault = property1 === "Default";
  return (
    <div className={className || isDefault ? "bg-[rgba(255,255,255,0.04)] relative" : undefined}>
      <div aria-hidden className={isDefault ? "absolute border-0 border-dashed border-white inset-0 pointer-events-none" : undefined} />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[32px] py-[16px] relative size-full">
          <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['Helvetica_Neue_LT_Pro:57_Condensed',sans-serif] leading-[1.04] not-italic relative shrink-0 text-[16px] text-white tracking-[0.32px] uppercase whitespace-nowrap">{`let's talk.`}</p>
        </div>
      </div>
    </div>
  );
}