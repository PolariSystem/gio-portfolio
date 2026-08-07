import svgPaths from "./svg-b18f96x1xv";
type WorkButtonProps = {
  className?: string;
  property1?: "Frame 2" | "Frame 3";
};

function WorkButton({ className, property1 = "Frame 3" }: WorkButtonProps) {
  const isFrame3 = property1 === "Frame 3";
  return (
    <div className={className || `relative ${isFrame3 ? "opacity-80" : ""}`}>
      <div aria-hidden className={`absolute border-dashed inset-0 pointer-events-none ${isFrame3 ? "border-0 border-[#121316]" : "border-2 border-[#141518]"}`} />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[20px] py-[10px] relative size-full">
          <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['Helvetica_Neue_LT_Pro:57_Condensed',sans-serif] leading-[1.04] not-italic relative shrink-0 text-[#121316] text-[16px] tracking-[0.32px] uppercase whitespace-nowrap">Work.</p>
        </div>
      </div>
    </div>
  );
}
type AboutButtonProps = {
  className?: string;
  property1?: "Frame 2" | "Frame 3";
};

function AboutButton({ className, property1 = "Frame 3" }: AboutButtonProps) {
  const isFrame3 = property1 === "Frame 3";
  return (
    <div className={className || "relative"}>
      <div aria-hidden className={`absolute border-dashed border-white inset-0 pointer-events-none ${isFrame3 ? "border-0" : "border-2"}`} />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[20px] py-[10px] relative size-full">
          <p className={`[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-["Helvetica_Neue_LT_Pro:57_Condensed",sans-serif] leading-[1.04] not-italic relative shrink-0 text-[16px] text-white tracking-[0.32px] uppercase whitespace-nowrap ${isFrame3 ? "opacity-80" : ""}`}>About.</p>
        </div>
      </div>
    </div>
  );
}
type ContactButtonProps = {
  className?: string;
  property1?: "Frame 2" | "Frame 3";
};

function ContactButton({ className, property1 = "Frame 3" }: ContactButtonProps) {
  const isFrame3 = property1 === "Frame 3";
  return (
    <div className={className || "relative"}>
      <div aria-hidden className={`absolute border-dashed border-white inset-0 pointer-events-none ${isFrame3 ? "border-0" : "border-2"}`} />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[20px] py-[10px] relative size-full">
          <p className={`[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-["Helvetica_Neue_LT_Pro:57_Condensed",sans-serif] leading-[1.04] not-italic relative shrink-0 text-[16px] text-white tracking-[0.32px] uppercase whitespace-nowrap ${isFrame3 ? "opacity-80" : ""}`}>C0ntact.</p>
        </div>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative">
      <div aria-hidden className="absolute border-[#252628] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame13() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative">
      <div aria-hidden className="absolute border-[#252628] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame10() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative">
      <div aria-hidden className="absolute border-[#252628] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame9() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative">
      <div aria-hidden className="absolute border-[#252628] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame12() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative">
      <div aria-hidden className="absolute border-[#252628] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame7() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative">
      <div aria-hidden className="absolute border-[#252628] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame8() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative">
      <div aria-hidden className="absolute border-[#252628] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame11() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative">
      <div aria-hidden className="absolute border-[#252628] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame6() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative">
      <div aria-hidden className="absolute border-[#252628] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame14() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative">
      <div aria-hidden className="absolute border-[#252628] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame5() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative">
      <div aria-hidden className="absolute border-[#252628] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#fafafa] h-full relative shrink-0 w-[148px]">
      <div aria-hidden className="absolute border-[#252628] border-r border-solid inset-0 pointer-events-none" />
      <div className="-translate-x-1/2 absolute left-[calc(50%-0.33px)] size-[72px] top-[880px]" data-name="Work button">
        <div aria-hidden className="absolute border-2 border-[#121316] border-dashed inset-0 pointer-events-none" />
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center p-[16px] relative size-full">
            <div className="aspect-[24/24] flex-[1_0_0] min-w-px overflow-clip relative" data-name="arrow-down-to-line">
              <div className="absolute inset-[12.5%_20.83%]" data-name="Vector">
                <div className="absolute inset-[-3.33%_-4.29%]">
                  <svg className="block size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 25.3333 32" width="25.3333">
                    <path d={svgPaths.p2c87b6c0} id="Vector" stroke="#121316" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative">
      <div aria-hidden className="absolute border-[#252628] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Grid() {
  return (
    <div className="absolute content-stretch flex inset-0 items-center justify-between" data-name="Grid">
      <Frame15 />
      <Frame13 />
      <Frame10 />
      <Frame9 />
      <Frame12 />
      <Frame7 />
      <Frame8 />
      <Frame11 />
      <Frame6 />
      <Frame14 />
      <Frame5 />
      <Frame3 />
      <Frame4 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="[word-break:break-word] font-['Helvetica_Neue_LT_Pro:67_Medium_Condensed',sans-serif] leading-[0] not-italic relative shrink-0 text-[#fafafa] text-[80px] uppercase whitespace-nowrap">
        <p className="leading-[1.2] mb-0">Hello</p>
        <p className="leading-[1.2] mb-0">{`I'm Giovany Cruz`}</p>
        <p className="leading-[1.2]">{`and i'm Product designer.`}</p>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[590px]">
      <p className="[word-break:break-word] flex-[1_0_0] font-['Helvetica_Neue_LT_Pro:55_Roman',sans-serif] leading-[1.2] min-w-px not-italic relative text-[#fafafa] text-[24px] whitespace-pre-wrap">{`Product Designer specializing in high-conversion Landing Pages, SaaS  platforms, and Mobile Applications`}</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
      <Frame1 />
      <Frame16 />
      <div className="relative shrink-0 w-[147px]" data-name="Lets talk button">
        <div aria-hidden className="absolute border-0 border-[#fafafa] border-dashed inset-0 pointer-events-none" />
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center px-[32px] py-[16px] relative size-full">
            <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] font-['Helvetica_Neue_LT_Pro:57_Condensed',sans-serif] leading-[1.04] not-italic relative shrink-0 text-[#fafafa] text-[16px] tracking-[0.32px] uppercase whitespace-nowrap">{`let's talk.`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full">
      <div className="flex flex-col justify-end size-full">
        <div className="content-stretch flex flex-col items-start justify-end py-[128px] relative size-full">
          <Frame2 />
        </div>
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Main Content">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center px-[148px] relative size-full">
          <Frame />
        </div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="h-[20px] relative shrink-0 w-[50.093px]" data-name="Logo">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 50.0926 20" width="50.0926">
        <g id="Logo">
          <path d={svgPaths.p7e04a00} fill="white" id="Vector" />
          <path d={svgPaths.p370b9680} fill="white" id="Vector_2" />
          <path d={svgPaths.p1d8cae00} fill="white" id="Vector_3" />
          <path d={svgPaths.p3c13080} fill="white" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Gio() {
  return (
    <div className="content-stretch flex items-end relative shrink-0" data-name="Gio.">
      <Logo />
    </div>
  );
}

function NavigationLinks() {
  return (
    <div className="content-stretch flex gap-[32px] items-center px-[16px] relative shrink-0 w-[442px]" data-name="Navigation Links">
      <ContactButton className="flex-[1_0_0] min-w-px relative" />
      <AboutButton className="flex-[1_0_0] min-w-px relative" />
      <WorkButton className="flex-[1_0_0] min-w-px opacity-80 relative" />
    </div>
  );
}

function NavigationBar() {
  return (
    <div className="absolute content-stretch flex h-[80px] items-center justify-between left-0 px-[148px] py-[10px] top-0 w-[1920px]" data-name="Navigation Bar">
      <Gio />
      <NavigationLinks />
    </div>
  );
}

export default function Landing() {
  return (
    <div className="bg-[#121316] content-stretch flex flex-col items-start relative size-full" data-name="Landing">
      <Grid />
      <MainContent />
      <NavigationBar />
    </div>
  );
}