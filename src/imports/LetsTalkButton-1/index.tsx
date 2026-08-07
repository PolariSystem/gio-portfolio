type LetsTalkButtonProps = {
  className?: string;
  property1?: "Default" | "Hover" | "Press";
};

function LetsTalkButton({ className, property1 = "Default" }: LetsTalkButtonProps) {
  return (
    <div className={className || `relative ${property1 === "Press" ? "bg-[rgba(255,255,255,0.04)]" : ""}`}>
      <div aria-hidden className={`absolute border-dashed border-white inset-0 pointer-events-none ${["Hover", "Press"].includes(property1) ? "border-2" : "border-0"}`} />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[32px] py-[16px] relative size-full">
          <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['Helvetica_Neue_LT_Pro:57_Condensed',sans-serif] leading-[1.04] not-italic relative shrink-0 text-[16px] text-white tracking-[0.32px] uppercase whitespace-nowrap">{`let's talk.`}</p>
        </div>
      </div>
    </div>
  );
}

export default function LetsTalkButton1() {
  return <LetsTalkButton className="relative size-full" />;
}