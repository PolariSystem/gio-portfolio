import svgPaths from "./svg-mmaha0ywti";
import imgProjectImage from "./9e1b53f5960279f7bbf70c5f9b02f1e90a341d11.png";

function ProjectHeader() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start not-italic relative shrink-0 text-[#121316] w-full" data-name="Project Header">
      <p className="font-['Helvetica_Neue_LT_Pro:73_Bold_Extended',sans-serif] leading-none relative shrink-0 text-[40px] uppercase whitespace-nowrap">Compra Today</p>
      <p className="font-['Helvetica_Neue_LT_Pro:55_Roman',sans-serif] leading-[1.2] min-w-full relative shrink-0 text-[24px] w-[min-content]">The best online store with the best prices in Cuba</p>
    </div>
  );
}

function ClientDetails() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[1.2] not-italic relative shrink-0 text-[#121316] text-[20px] w-full whitespace-nowrap" data-name="Client Details">
      <p className="font-['Helvetica_Neue_LT_Pro:55_Roman',sans-serif] relative shrink-0">Client:</p>
      <p className="font-['Helvetica_Neue_LT_Pro:73_Bold_Extended',sans-serif] relative shrink-0 uppercase">Híper Logística</p>
    </div>
  );
}

function ClientInfo() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Client Info">
      <ClientDetails />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 420 1" width="420">
            <line id="Line 12" stroke="#E7E7E8" x2="420" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function RoleDetails() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[1.2] not-italic relative shrink-0 text-[#121316] text-[20px] w-full whitespace-nowrap" data-name="Role Details">
      <p className="font-['Helvetica_Neue_LT_Pro:55_Roman',sans-serif] relative shrink-0">Role:</p>
      <p className="font-['Helvetica_Neue_LT_Pro:73_Bold_Extended',sans-serif] relative shrink-0 uppercase">Web/Graphic Designer</p>
    </div>
  );
}

function RoleInfo() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Role Info">
      <RoleDetails />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 420 1" width="420">
            <line id="Line 12" stroke="#E7E7E8" x2="420" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function YearDetails() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[1.2] not-italic relative shrink-0 text-[#121316] text-[20px] w-full whitespace-nowrap" data-name="Year Details">
      <p className="font-['Helvetica_Neue_LT_Pro:55_Roman',sans-serif] relative shrink-0">Year:</p>
      <p className="font-['Helvetica_Neue_LT_Pro:73_Bold_Extended',sans-serif] relative shrink-0 uppercase">2023</p>
    </div>
  );
}

function YearInfo() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Year Info">
      <YearDetails />
    </div>
  );
}

function ProjectDetails() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Project Details">
      <ClientInfo />
      <RoleInfo />
      <YearInfo />
    </div>
  );
}

function ArrowOutward() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="arrow_outward">
      <svg className="absolute block inset-0 size-full" fill="none" height="24" preserveAspectRatio="none" viewBox="0 0 24 24" width="24">
        <g id="arrow_outward">
          <mask height="24" id="mask0_0_4" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="24" x="0" y="0">
            <rect fill="#D9D9D9" height="24" id="Bounding box" width="24" />
          </mask>
          <g mask="url(#mask0_0_4)">
            <path d={svgPaths.p2ebbb700} fill="#121316" id="arrow_outward_2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <a className="[word-break:break-word] block font-['Helvetica_Neue_LT_Pro:63_Medium_Extended',sans-serif] leading-[0] not-italic relative shrink-0 text-[#121316] text-[20px] whitespace-nowrap" href="https://compratoday.com/" target="_blank">
        <p className="[text-underline-position:from-font] cursor-pointer decoration-from-font decoration-solid leading-[1.1] underline">View live website</p>
      </a>
      <ArrowOutward />
    </div>
  );
}

function ProjectSection() {
  return (
    <div className="relative shrink-0 w-full" data-name="Project Section">
      <div className="content-stretch flex flex-col gap-[24px] items-start pr-[24px] py-[24px] relative size-full">
        <ProjectHeader />
        <ProjectDetails />
        <p className="[word-break:break-word] font-['Helvetica_Neue_LT_Pro:55_Roman',sans-serif] leading-[1.2] min-w-full not-italic relative shrink-0 text-[#121316] text-[20px] w-[min-content]">CompraToday provides Híper Logística customers with a user-friendly platform, boosting online sales by 40% and expanding market reach across Cuba.</p>
        <Frame />
      </div>
    </div>
  );
}

function VerticalContainer() {
  return (
    <div className="content-stretch flex flex-col h-full items-start justify-end relative shrink-0 w-[444px]" data-name="Vertical Container">
      <ProjectSection />
    </div>
  );
}

function ProjectImageContainer() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative shadow-[0px_4px_16px_0px_rgba(0,0,0,0.16)]" style={{ backgroundImage: "linear-gradient(90deg, rgba(18, 19, 22, 0.08) 0%, rgba(18, 19, 22, 0.08) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Project Image Container">
      <div className="flex flex-col justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[48px] relative size-full">
          <div className="aspect-[1920/945] flex-[1_0_0] min-h-px relative shadow-[0px_4px_16px_2px_rgba(0,0,0,0.24)]" data-name="Project Image">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[114.29%] left-0 max-w-none top-[-9.21%] w-full" src={imgProjectImage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InnerContainer() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px relative w-full" data-name="Inner Container">
      <VerticalContainer />
      <ProjectImageContainer />
    </div>
  );
}

export default function Container() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-name="Container">
      <InnerContainer />
    </div>
  );
}