import svgPaths from "./svg-dcorgc5o5g";

function Heading() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-name="Heading 2">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#131313] text-[24px] w-full">NetEvent Demo Conference 2026</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[13.998px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="13.9981" preserveAspectRatio="none" viewBox="0 0 13.9981 13.9981" width="13.9981">
        <g clipPath="url(#clip0_0_4)" id="Icon">
          <path d={svgPaths.p21fe3f00} id="Vector" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16651" />
          <path d={svgPaths.p3d535640} id="Vector_2" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16651" />
        </g>
        <defs>
          <clipPath id="clip0_0_4">
            <rect fill="white" height="13.9981" width="13.9981" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white border-[#e4e9f3] border-[0.547px] border-solid content-stretch flex gap-[6px] h-[31.996px] items-center justify-center px-[10px] relative rounded-[14px] shrink-0" data-name="Button">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[17.143px] not-italic relative shrink-0 text-[#131313] text-[12px] text-center whitespace-nowrap">Trang sự kiện</p>
      <Icon />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative" data-name="Container">
      <Heading />
      <Button />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-w-px relative" data-name="Container">
      <Container2 />
    </div>
  );
}

export default function Container() {
  return (
    <div className="content-stretch flex items-center justify-between py-[16px] relative size-full" data-name="Container">
      <Container1 />
    </div>
  );
}