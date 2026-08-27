import svgPaths from "./svg-we5ob6tcdi";

function Text() {
  return (
    <div className="bg-[#1eaaff] content-stretch flex flex-col items-center px-[7px] py-px relative rounded-[999px] shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:SemiBold',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">7</p>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute border-[#1eaaff] border-b-2 border-solid content-stretch flex gap-[6px] h-[35px] items-center left-0 pb-[12px] px-[4px] top-0 w-[81.109px]" data-name="Button">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:SemiBold',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#1eaaff] text-[14px] text-center whitespace-nowrap">Tất cả</p>
      <Text />
    </div>
  );
}

function ButtonMargin() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0 w-[105.109px]" data-name="Button:margin">
      <Button />
    </div>
  );
}

function Text1() {
  return (
    <div className="bg-[#eef3fb] content-stretch flex flex-col items-center px-[7px] py-px relative rounded-[999px] shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] text-center whitespace-nowrap">4</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute border-[rgba(0,0,0,0)] border-b-2 border-solid content-stretch flex gap-[6px] items-center left-0 pb-[12px] px-[4px] top-0" data-name="Button">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#595959] text-[14px] text-center whitespace-nowrap">Của tôi</p>
      <Text1 />
    </div>
  );
}

function ButtonMargin1() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0 w-[111px]" data-name="Button:margin">
      <Button1 />
    </div>
  );
}

function Text2() {
  return (
    <div className="bg-[#eef3fb] content-stretch flex flex-col items-center px-[7px] py-px relative rounded-[999px] shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] text-center whitespace-nowrap">3</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute border-[rgba(0,0,0,0)] border-b-2 border-solid content-stretch flex gap-[6px] h-[35px] items-center left-0 pb-[12px] px-[4px] top-0 w-[206.094px]" data-name="Button">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#595959] text-[14px] text-center whitespace-nowrap">Được phân quyền cho tôi</p>
      <Text2 />
    </div>
  );
}

function ButtonMargin2() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0 w-[230.094px]" data-name="Button:margin">
      <Button2 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex h-[34px] items-start relative shrink-0 w-[1200px]" data-name="Container">
      <ButtonMargin />
      <ButtonMargin1 />
      <ButtonMargin2 />
    </div>
  );
}

function Container() {
  return (
    <div className="border-[#e4e9f3] border-b border-solid content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Container1 />
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#f3f7fd] border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[36px] items-start justify-center overflow-clip pl-[32px] pr-[12px] py-[4px] relative rounded-[14px] shrink-0 w-full" data-name="Input">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#595959] text-[14px] w-full">Tìm sự kiện...</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[12px] size-[14px] top-[11px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
        <g id="Icon">
          <path d={svgPaths.p8cdb700} id="Vector" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M12.25 12.25L9.74167 9.74167" id="Vector_2" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-[320_0_0] flex-col items-start max-w-[320px] min-w-[180px] relative" data-name="Container">
      <Input />
      <Icon />
    </div>
  );
}

function Text3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[20px] items-center min-w-px overflow-clip relative" data-name="Text">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#131313] text-[14px] text-center whitespace-nowrap">Tất cả trạng thái</p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="Icon" opacity="0.5">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#f3f7fd] border border-[rgba(0,0,0,0)] border-solid content-stretch flex h-[36px] items-center justify-between px-[12px] py-[8px] relative rounded-[14px] shrink-0 w-[160px]" data-name="Button">
      <Text3 />
      <Icon1 />
    </div>
  );
}

function Text4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[20px] items-center min-w-px overflow-clip relative" data-name="Text">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#131313] text-[14px] text-center whitespace-nowrap">Tất cả thời gian</p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="Icon" opacity="0.5">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#f3f7fd] border border-[rgba(0,0,0,0)] border-solid content-stretch flex h-[36px] items-center justify-between px-[12px] py-[8px] relative rounded-[14px] shrink-0 w-[160px]" data-name="Button">
      <Text4 />
      <Icon2 />
    </div>
  );
}

function Text5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[20px] items-center min-w-px overflow-clip relative" data-name="Text">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#131313] text-[14px] text-center whitespace-nowrap">Tất cả</p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="Icon" opacity="0.5">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#f3f7fd] border border-[rgba(0,0,0,0)] border-solid content-stretch flex h-[36px] items-center justify-between px-[12px] py-[8px] relative rounded-[14px] shrink-0 w-[160px]" data-name="Button">
      <Text5 />
      <Icon3 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Button3 />
      <Button4 />
      <Button5 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="Icon">
          <path d="M5.33333 1.33333V4" id="Vector" stroke="#1EAAFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 1.33333V4" id="Vector_2" stroke="#1EAAFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3ee34580} id="Vector_3" stroke="#1EAAFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 6.66667H14" id="Vector_4" stroke="#1EAAFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-[rgba(30,170,255,0.08)] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="Container">
      <Icon4 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">Tổng sự kiện</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Container">
      <Container6 />
      <Paragraph />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Bold',sans-serif] leading-[30px] not-italic relative shrink-0 text-[#131313] text-[20px] whitespace-nowrap">7</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pt-[2px] relative shrink-0 w-[257px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">Trong workspace</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph1 />
      <Paragraph2 />
    </div>
  );
}

function StatCard() {
  return (
    <div className="bg-white border border-[#e4e9f3] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px p-[16px] relative rounded-[16px] self-stretch" data-name="StatCard">
      <Container5 />
      <Container7 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g clipPath="url(#clip0_0_42)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="#1EAAFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 4V8L10.6667 9.33333" id="Vector_2" stroke="#1EAAFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_0_42">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-[rgba(30,170,255,0.08)] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="Container">
      <Icon5 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">Sắp diễn ra</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Container">
      <Container9 />
      <Paragraph3 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Bold',sans-serif] leading-[30px] not-italic relative shrink-0 text-[#131313] text-[20px] whitespace-nowrap">2</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pt-[2px] relative shrink-0 w-[257px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">Trong 30 ngày tới</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph4 />
      <Paragraph5 />
    </div>
  );
}

function StatCard1() {
  return (
    <div className="bg-white border border-[#e4e9f3] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px p-[16px] relative rounded-[16px] self-stretch" data-name="StatCard">
      <Container8 />
      <Container10 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="Icon">
          <path d={svgPaths.p4750080} id="Vector" stroke="#DC2626" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p15535600} id="Vector_2" stroke="#DC2626" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p18635ff0} id="Vector_3" stroke="#DC2626" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p280f7fc0} id="Vector_4" stroke="#DC2626" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p53c4ca0} id="Vector_5" stroke="#DC2626" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-[rgba(239,68,68,0.08)] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="Container">
      <Icon6 />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">Đang diễn ra</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Container">
      <Container12 />
      <Paragraph6 />
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Bold',sans-serif] leading-[30px] not-italic relative shrink-0 text-[#131313] text-[20px] whitespace-nowrap">1</p>
    </div>
  );
}

function StatCard2() {
  return (
    <div className="bg-white border border-[#e4e9f3] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px p-[16px] relative rounded-[16px] self-stretch" data-name="StatCard">
      <Container11 />
      <Container13 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g clipPath="url(#clip0_0_24)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="#B45309" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333V8" id="Vector_2" stroke="#B45309" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667H8.00667" id="Vector_3" stroke="#B45309" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_0_24">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container15() {
  return (
    <div className="bg-[#fffbeb] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="Container">
      <Icon7 />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">Bản nháp cần xử lý</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Container">
      <Container15 />
      <Paragraph7 />
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Bold',sans-serif] leading-[30px] not-italic relative shrink-0 text-[#131313] text-[20px] whitespace-nowrap">2</p>
    </div>
  );
}

function StatCard3() {
  return (
    <div className="bg-white border border-[#e4e9f3] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px p-[16px] relative rounded-[16px] self-stretch" data-name="StatCard">
      <Container14 />
      <Container16 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <StatCard />
      <StatCard1 />
      <StatCard2 />
      <StatCard3 />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:SemiBold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#131313] text-[16px] whitespace-nowrap">Danh sách sự kiện</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pt-[2px] relative shrink-0 w-[814px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">7 sự kiện</p>
    </div>
  );
}

function Container20() {
  return (
    <div className="border-[#e4e9f3] border-b border-solid content-stretch flex flex-col items-start px-[20px] py-[16px] relative shrink-0 w-full" data-name="Container">
      <Heading />
      <Paragraph8 />
    </div>
  );
}

function TableHeader() {
  return (
    <div className="[word-break:break-word] absolute bg-[#eef3fb] font-['Be_Vietnam_Pro:Medium',sans-serif] h-[38.5px] leading-[18px] left-0 not-italic text-[#595959] text-[12px] top-0 w-[854px] whitespace-nowrap" data-name="Table Header">
      <p className="absolute left-[16px] top-[10px]">Sự kiện</p>
      <p className="absolute left-[287.95px] top-[10px]">Vai trò</p>
      <p className="absolute left-[442.92px] top-[10px]">Trạng thái</p>
      <p className="absolute left-[569.97px] top-[10px]">Đăng ký</p>
      <p className="absolute left-[653.2px] top-[10px]">Check-in</p>
      <p className="absolute left-[743.38px] top-[10px]">Thao tác</p>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d="M4 1V3" id="Vector" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 1V3" id="Vector_2" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p333d5300} id="Vector_3" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1.5 5H10.5" id="Vector_4" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="content-stretch flex flex-col h-[18px] items-start px-px relative shrink-0 w-[6px]" data-name="Text">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">·</p>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d={svgPaths.p7c73480} id="Vector" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p2d617c80} id="Vector_2" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center left-[16px] top-[35.5px] w-[239.953px]" data-name="Paragraph">
      <Icon8 />
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">01/08/2026</p>
      <Text6 />
      <Icon9 />
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">Offline</p>
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute h-[66px] left-0 top-[-1px] w-[271.953px]" data-name="Table Cell">
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[21px] left-[16px] not-italic text-[#131313] text-[14px] top-[12.5px] whitespace-nowrap">NetEvent Demo Conference 2026</p>
      <Paragraph9 />
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute bg-[#eef3fb] border border-[#e4e9f3] border-solid h-[21px] left-[287.95px] rounded-[999px] top-[23px] w-[118.25px]" data-name="Text">
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] left-[8px] not-italic text-[#595959] text-[12px] top-px whitespace-nowrap">Nhân viên sự kiện</p>
    </div>
  );
}

function StatusBadge() {
  return (
    <div className="absolute bg-[rgba(30,170,255,0.1)] h-[19px] left-[442.92px] rounded-[999px] top-[24px] w-[82.734px]" data-name="StatusBadge">
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[18px] left-[8px] not-italic text-[#1eaaff] text-[12px] top-px whitespace-nowrap">Sắp diễn ra</p>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d="M7.5 1.5H10.5V4.5" id="Vector" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 7L10.5 1.5" id="Vector_2" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.pc1a2200} id="Vector_3" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute bg-white border border-[#e4e9f3] border-solid content-stretch flex gap-[6px] h-[32px] items-center justify-center left-[743.38px] px-[10px] rounded-[14px] top-[16px]" data-name="Button">
      <Icon10 />
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#131313] text-[14px] text-center whitespace-nowrap">Chi tiết</p>
    </div>
  );
}

function TableRow() {
  return (
    <div className="absolute border-[#e4e9f3] border-solid border-t h-[66px] left-0 top-[38.5px] w-[854px]" data-name="Table Row">
      <TableCell />
      <Text7 />
      <StatusBadge />
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[21px] left-[569.97px] not-italic text-[#131313] text-[14px] top-[22px] whitespace-nowrap">328</p>
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[21px] left-[653.2px] not-italic text-[#131313] text-[14px] top-[22px] whitespace-nowrap">—</p>
      <Button6 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d="M4 1V3" id="Vector" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 1V3" id="Vector_2" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p333d5300} id="Vector_3" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1.5 5H10.5" id="Vector_4" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="content-stretch flex flex-col h-[18px] items-start px-px relative shrink-0 w-[6px]" data-name="Text">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">·</p>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d={svgPaths.p2a6cb180} id="Vector" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p2eadb480} id="Vector_2" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p62fc9c0} id="Vector_3" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p314f798} id="Vector_4" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p3729ab00} id="Vector_5" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center left-[16px] top-[35.5px] w-[239.953px]" data-name="Paragraph">
      <Icon11 />
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">15/08/2026</p>
      <Text8 />
      <Icon12 />
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">Hybrid</p>
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute h-[66px] left-0 top-[-1px] w-[271.953px]" data-name="Table Cell">
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[21px] left-[16px] not-italic text-[#131313] text-[14px] top-[12.5px] whitespace-nowrap">{`Hội thảo AI & Tương lai 2026`}</p>
      <Paragraph10 />
    </div>
  );
}

function Text9() {
  return (
    <div className="absolute bg-[#eef3fb] border border-[#e4e9f3] border-solid h-[21px] left-[287.95px] rounded-[999px] top-[23px] w-[118.25px]" data-name="Text">
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] left-[8px] not-italic text-[#595959] text-[12px] top-px whitespace-nowrap">Nhân viên sự kiện</p>
    </div>
  );
}

function StatusBadge1() {
  return (
    <div className="absolute bg-[#fffbeb] h-[19px] left-[442.92px] rounded-[999px] top-[24px] w-[71.656px]" data-name="StatusBadge">
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[18px] left-[8px] not-italic text-[#b45309] text-[12px] top-px whitespace-nowrap">Bản nháp</p>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d="M7.5 1.5H10.5V4.5" id="Vector" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 7L10.5 1.5" id="Vector_2" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.pc1a2200} id="Vector_3" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute bg-white border border-[#e4e9f3] border-solid content-stretch flex gap-[6px] h-[32px] items-center justify-center left-[743.38px] px-[10px] rounded-[14px] top-[16px]" data-name="Button">
      <Icon13 />
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#131313] text-[14px] text-center whitespace-nowrap">Chi tiết</p>
    </div>
  );
}

function TableRow1() {
  return (
    <div className="absolute border-[#e4e9f3] border-solid border-t h-[66px] left-0 top-[104.5px] w-[854px]" data-name="Table Row">
      <TableCell1 />
      <Text9 />
      <StatusBadge1 />
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[21px] left-[569.97px] not-italic text-[#131313] text-[14px] top-[22px] whitespace-nowrap">—</p>
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[21px] left-[653.2px] not-italic text-[#131313] text-[14px] top-[22px] whitespace-nowrap">—</p>
      <Button7 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d="M4 1V3" id="Vector" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 1V3" id="Vector_2" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p333d5300} id="Vector_3" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1.5 5H10.5" id="Vector_4" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div className="content-stretch flex flex-col h-[18px] items-start px-px relative shrink-0 w-[6px]" data-name="Text">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">·</p>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d={svgPaths.p7c73480} id="Vector" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p2d617c80} id="Vector_2" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center left-[16px] top-[35.5px] w-[239.953px]" data-name="Paragraph">
      <Icon14 />
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">22/09/2026</p>
      <Text10 />
      <Icon15 />
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">Offline</p>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute h-[66px] left-0 top-[-1px] w-[271.953px]" data-name="Table Cell">
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[21px] left-[16px] not-italic text-[#131313] text-[14px] top-[12.5px] whitespace-nowrap">Tech Summit Hà Nội</p>
      <Paragraph11 />
    </div>
  );
}

function Text11() {
  return (
    <div className="absolute bg-[#eef3fb] border border-[#e4e9f3] border-solid h-[21px] left-[287.95px] rounded-[999px] top-[23px] w-[118.25px]" data-name="Text">
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] left-[8px] not-italic text-[#595959] text-[12px] top-px whitespace-nowrap">Nhân viên sự kiện</p>
    </div>
  );
}

function StatusBadge2() {
  return (
    <div className="absolute bg-[#fffbeb] h-[19px] left-[442.92px] rounded-[999px] top-[24px] w-[71.656px]" data-name="StatusBadge">
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[18px] left-[8px] not-italic text-[#b45309] text-[12px] top-px whitespace-nowrap">Bản nháp</p>
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d="M7.5 1.5H10.5V4.5" id="Vector" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 7L10.5 1.5" id="Vector_2" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.pc1a2200} id="Vector_3" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute bg-white border border-[#e4e9f3] border-solid content-stretch flex gap-[6px] h-[32px] items-center justify-center left-[743.38px] px-[10px] rounded-[14px] top-[16px]" data-name="Button">
      <Icon16 />
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#131313] text-[14px] text-center whitespace-nowrap">Chi tiết</p>
    </div>
  );
}

function TableRow2() {
  return (
    <div className="absolute border-[#e4e9f3] border-solid border-t h-[66px] left-0 top-[170.5px] w-[854px]" data-name="Table Row">
      <TableCell2 />
      <Text11 />
      <StatusBadge2 />
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[21px] left-[569.97px] not-italic text-[#131313] text-[14px] top-[22px] whitespace-nowrap">—</p>
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[21px] left-[653.2px] not-italic text-[#131313] text-[14px] top-[22px] whitespace-nowrap">—</p>
      <Button8 />
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d="M4 1V3" id="Vector" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 1V3" id="Vector_2" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p333d5300} id="Vector_3" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1.5 5H10.5" id="Vector_4" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text12() {
  return (
    <div className="content-stretch flex flex-col h-[18px] items-start px-px relative shrink-0 w-[6px]" data-name="Text">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">·</p>
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d={svgPaths.p7c73480} id="Vector" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p2d617c80} id="Vector_2" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center left-[16px] top-[35.5px] w-[239.953px]" data-name="Paragraph">
      <Icon17 />
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">20/07/2026</p>
      <Text12 />
      <Icon18 />
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">Offline</p>
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute h-[66px] left-0 top-[-1px] w-[271.953px]" data-name="Table Cell">
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[21px] left-[16px] not-italic text-[#131313] text-[14px] top-[12.5px] whitespace-nowrap">Sun Music Festival 2026</p>
      <Paragraph12 />
    </div>
  );
}

function Text13() {
  return (
    <div className="absolute bg-[#eef3fb] border border-[#e4e9f3] border-solid h-[21px] left-[287.95px] rounded-[999px] top-[23px] w-[118.25px]" data-name="Text">
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] left-[8px] not-italic text-[#595959] text-[12px] top-px whitespace-nowrap">Nhân viên sự kiện</p>
    </div>
  );
}

function StatusBadge3() {
  return (
    <div className="absolute bg-[rgba(239,68,68,0.08)] h-[19px] left-[442.92px] rounded-[999px] top-[24px] w-[91.172px]" data-name="StatusBadge">
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[18px] left-[8px] not-italic text-[#dc2626] text-[12px] top-px whitespace-nowrap">Đang diễn ra</p>
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d="M7.5 1.5H10.5V4.5" id="Vector" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 7L10.5 1.5" id="Vector_2" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.pc1a2200} id="Vector_3" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute bg-white border border-[#e4e9f3] border-solid content-stretch flex gap-[6px] h-[32px] items-center justify-center left-[743.38px] px-[10px] rounded-[14px] top-[16px]" data-name="Button">
      <Icon19 />
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#131313] text-[14px] text-center whitespace-nowrap">Chi tiết</p>
    </div>
  );
}

function TableRow3() {
  return (
    <div className="absolute border-[#e4e9f3] border-solid border-t h-[66px] left-0 top-[236.5px] w-[854px]" data-name="Table Row">
      <TableCell3 />
      <Text13 />
      <StatusBadge3 />
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[21px] left-[569.97px] not-italic text-[#131313] text-[14px] top-[22px] whitespace-nowrap">1,200</p>
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[21px] left-[653.2px] not-italic text-[#131313] text-[14px] top-[22px] whitespace-nowrap">874</p>
      <Button9 />
    </div>
  );
}

function Icon20() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d="M4 1V3" id="Vector" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 1V3" id="Vector_2" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p333d5300} id="Vector_3" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1.5 5H10.5" id="Vector_4" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text14() {
  return (
    <div className="content-stretch flex flex-col h-[18px] items-start px-px relative shrink-0 w-[6px]" data-name="Text">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">·</p>
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d={svgPaths.p22fcd280} id="Vector" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center left-[16px] top-[35.5px] w-[239.953px]" data-name="Paragraph">
      <Icon20 />
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">10/08/2026</p>
      <Text14 />
      <Icon21 />
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">Online</p>
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute h-[66px] left-0 top-[-1px] w-[271.953px]" data-name="Table Cell">
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[21px] left-[16px] not-italic text-[#131313] text-[14px] top-[12.5px] whitespace-nowrap">Startup Pitch Night</p>
      <Paragraph13 />
    </div>
  );
}

function Text15() {
  return (
    <div className="absolute bg-[#eef3fb] border border-[#e4e9f3] border-solid h-[21px] left-[287.95px] rounded-[999px] top-[23px] w-[118.25px]" data-name="Text">
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] left-[8px] not-italic text-[#595959] text-[12px] top-px whitespace-nowrap">Nhân viên sự kiện</p>
    </div>
  );
}

function StatusBadge4() {
  return (
    <div className="absolute bg-[rgba(30,170,255,0.1)] h-[19px] left-[442.92px] rounded-[999px] top-[24px] w-[82.734px]" data-name="StatusBadge">
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[18px] left-[8px] not-italic text-[#1eaaff] text-[12px] top-px whitespace-nowrap">Sắp diễn ra</p>
    </div>
  );
}

function Icon22() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d="M7.5 1.5H10.5V4.5" id="Vector" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 7L10.5 1.5" id="Vector_2" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.pc1a2200} id="Vector_3" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute bg-white border border-[#e4e9f3] border-solid content-stretch flex gap-[6px] h-[32px] items-center justify-center left-[743.38px] px-[10px] rounded-[14px] top-[16px]" data-name="Button">
      <Icon22 />
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#131313] text-[14px] text-center whitespace-nowrap">Chi tiết</p>
    </div>
  );
}

function TableRow4() {
  return (
    <div className="absolute border-[#e4e9f3] border-solid border-t h-[66px] left-0 top-[302.5px] w-[854px]" data-name="Table Row">
      <TableCell4 />
      <Text15 />
      <StatusBadge4 />
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[21px] left-[569.97px] not-italic text-[#131313] text-[14px] top-[22px] whitespace-nowrap">56</p>
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[21px] left-[653.2px] not-italic text-[#131313] text-[14px] top-[22px] whitespace-nowrap">—</p>
      <Button10 />
    </div>
  );
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d="M4 1V3" id="Vector" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 1V3" id="Vector_2" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p333d5300} id="Vector_3" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1.5 5H10.5" id="Vector_4" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text16() {
  return (
    <div className="content-stretch flex flex-col h-[18px] items-start px-px relative shrink-0 w-[6px]" data-name="Text">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">·</p>
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d={svgPaths.p22fcd280} id="Vector" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center left-[16px] top-[35.5px] w-[239.953px]" data-name="Paragraph">
      <Icon23 />
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">05/07/2026</p>
      <Text16 />
      <Icon24 />
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">Online</p>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute h-[66px] left-0 top-[-1px] w-[271.953px]" data-name="Table Cell">
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[21px] left-[16px] not-italic text-[#131313] text-[14px] top-[12.5px] whitespace-nowrap">Workshop Thiết kế sản phẩm số</p>
      <Paragraph14 />
    </div>
  );
}

function Text17() {
  return (
    <div className="absolute bg-[#eef3fb] border border-[#e4e9f3] border-solid h-[21px] left-[287.95px] rounded-[999px] top-[23px] w-[118.25px]" data-name="Text">
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] left-[8px] not-italic text-[#595959] text-[12px] top-px whitespace-nowrap">Nhân viên sự kiện</p>
    </div>
  );
}

function StatusBadge5() {
  return (
    <div className="absolute bg-[#eef3fb] h-[19px] left-[442.92px] rounded-[999px] top-[24px] w-[85px]" data-name="StatusBadge">
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[18px] left-[8px] not-italic text-[#595959] text-[12px] top-px whitespace-nowrap">Đã kết thúc</p>
    </div>
  );
}

function Icon25() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d="M7.5 1.5H10.5V4.5" id="Vector" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 7L10.5 1.5" id="Vector_2" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.pc1a2200} id="Vector_3" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute bg-white border border-[#e4e9f3] border-solid content-stretch flex gap-[6px] h-[32px] items-center justify-center left-[743.38px] px-[10px] rounded-[14px] top-[16px]" data-name="Button">
      <Icon25 />
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#131313] text-[14px] text-center whitespace-nowrap">Chi tiết</p>
    </div>
  );
}

function TableRow5() {
  return (
    <div className="absolute border-[#e4e9f3] border-solid border-t h-[66px] left-0 top-[368.5px] w-[854px]" data-name="Table Row">
      <TableCell5 />
      <Text17 />
      <StatusBadge5 />
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[21px] left-[569.97px] not-italic text-[#131313] text-[14px] top-[22px] whitespace-nowrap">88</p>
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[21px] left-[653.2px] not-italic text-[#131313] text-[14px] top-[22px] whitespace-nowrap">71</p>
      <Button11 />
    </div>
  );
}

function Icon26() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d="M4 1V3" id="Vector" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 1V3" id="Vector_2" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p333d5300} id="Vector_3" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1.5 5H10.5" id="Vector_4" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text18() {
  return (
    <div className="content-stretch flex flex-col h-[18px] items-start px-px relative shrink-0 w-[6px]" data-name="Text">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">·</p>
    </div>
  );
}

function Icon27() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d={svgPaths.p7c73480} id="Vector" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p2d617c80} id="Vector_2" stroke="#595959" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center left-[16px] top-[35.5px] w-[239.953px]" data-name="Paragraph">
      <Icon26 />
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">12/06/2026</p>
      <Text18 />
      <Icon27 />
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">Offline</p>
    </div>
  );
}

function TableCell6() {
  return (
    <div className="absolute h-[65.5px] left-0 top-[-1px] w-[271.953px]" data-name="Table Cell">
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[21px] left-[16px] not-italic text-[#131313] text-[14px] top-[12.5px] whitespace-nowrap">Lễ hội Văn hoá Cộng đồng</p>
      <Paragraph15 />
    </div>
  );
}

function Text19() {
  return (
    <div className="absolute bg-[#eef3fb] border border-[#e4e9f3] border-solid h-[21px] left-[287.95px] rounded-[999px] top-[23px] w-[118.25px]" data-name="Text">
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] left-[8px] not-italic text-[#595959] text-[12px] top-px whitespace-nowrap">Nhân viên sự kiện</p>
    </div>
  );
}

function StatusBadge6() {
  return (
    <div className="absolute bg-[#eef3fb] h-[19px] left-[442.92px] rounded-[999px] top-[24px] w-[85px]" data-name="StatusBadge">
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[18px] left-[8px] not-italic text-[#595959] text-[12px] top-px whitespace-nowrap">Đã kết thúc</p>
    </div>
  );
}

function Icon28() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d="M7.5 1.5H10.5V4.5" id="Vector" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 7L10.5 1.5" id="Vector_2" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.pc1a2200} id="Vector_3" stroke="#131313" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute bg-white border border-[#e4e9f3] border-solid content-stretch flex gap-[6px] h-[32px] items-center justify-center left-[743.38px] px-[10px] rounded-[14px] top-[16px]" data-name="Button">
      <Icon28 />
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#131313] text-[14px] text-center whitespace-nowrap">Chi tiết</p>
    </div>
  );
}

function TableRow6() {
  return (
    <div className="absolute border-[#e4e9f3] border-solid border-t h-[65.5px] left-0 top-[434.5px] w-[854px]" data-name="Table Row">
      <TableCell6 />
      <Text19 />
      <StatusBadge6 />
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[21px] left-[569.97px] not-italic text-[#131313] text-[14px] top-[22px] whitespace-nowrap">420</p>
      <p className="[word-break:break-word] absolute font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[21px] left-[653.2px] not-italic text-[#131313] text-[14px] top-[22px] whitespace-nowrap">390</p>
      <Button12 />
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[500px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <TableHeader />
      <TableRow />
      <TableRow1 />
      <TableRow2 />
      <TableRow3 />
      <TableRow4 />
      <TableRow5 />
      <TableRow6 />
    </div>
  );
}

function Container19() {
  return (
    <div className="bg-white border border-[#e4e9f3] border-solid content-stretch flex flex-col h-[579px] items-start overflow-clip relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <Container20 />
      <Container21 />
    </div>
  );
}

function Container18() {
  return (
    <div className="col-1 content-stretch flex flex-col items-start justify-self-stretch relative row-1 self-start shrink-0" data-name="Container">
      <Container19 />
    </div>
  );
}

function Container17() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[__856px_320px] grid-rows-[_579px] relative shrink-0 w-full" data-name="Container">
      <Container18 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[856px]">
      <Container />
      <Container2 />
      <Container4 />
      <Container17 />
    </div>
  );
}

function Icon29() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g clipPath="url(#clip0_0_4)" id="Icon">
          <path d={svgPaths.p3227a460} id="Vector" stroke="#1EAAFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_0_4">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 3">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:SemiBold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#131313] text-[16px] whitespace-nowrap">Hoạt động gần đây</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon29 />
      <Heading1 />
    </div>
  );
}

function Container26() {
  return <div className="bg-[#1eaaff] relative rounded-[3px] shrink-0 size-[6px]" data-name="Container" />;
}

function ContainerMargin2() {
  return (
    <div className="content-stretch flex items-start pt-[6px] relative shrink-0" data-name="Container:margin">
      <Container26 />
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[0] not-italic relative shrink-0 text-[#131313] text-[0px] w-[262px]">
        <span className="leading-[18px] text-[12px]">Nguyễn Thị Lan</span>
        <span className="font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] text-[12px]">{` đã tạo sự kiện `}</span>
        <span className="leading-[18px] text-[12px]">NetEvent Demo Conference 2026</span>
      </p>
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pt-[2px] relative shrink-0 w-[262px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">2 giờ trước</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-[262_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Paragraph16 />
      <Paragraph17 />
    </div>
  );
}

function Container25() {
  return (
    <div className="border-[#e4e9f3] border-b border-solid content-stretch flex gap-[10px] items-start py-[10px] relative shrink-0 w-[278px]" data-name="Container">
      <ContainerMargin2 />
      <Container27 />
    </div>
  );
}

function ContainerMargin1() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-full" data-name="Container:margin">
      <Container25 />
    </div>
  );
}

function Container29() {
  return <div className="bg-[#1eaaff] relative rounded-[3px] shrink-0 size-[6px]" data-name="Container" />;
}

function ContainerMargin3() {
  return (
    <div className="content-stretch flex items-start pt-[6px] relative shrink-0" data-name="Container:margin">
      <Container29 />
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[0] not-italic relative shrink-0 text-[#131313] text-[0px] w-[262px]">
        <span className="leading-[18px] text-[12px]">Trần Staff A</span>
        <span className="font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] text-[12px]">{` đã check-in 24 người cho `}</span>
        <span className="leading-[18px] text-[12px]">Sun Music Festival 2026</span>
      </p>
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pt-[2px] relative shrink-0 w-[262px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">3 giờ trước</p>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-[262_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Paragraph18 />
      <Paragraph19 />
    </div>
  );
}

function Container28() {
  return (
    <div className="border-[#e4e9f3] border-b border-solid content-stretch flex gap-[10px] items-start py-[10px] relative shrink-0 w-[278px]" data-name="Container">
      <ContainerMargin3 />
      <Container30 />
    </div>
  );
}

function Container32() {
  return <div className="bg-[#1eaaff] relative rounded-[3px] shrink-0 size-[6px]" data-name="Container" />;
}

function ContainerMargin4() {
  return (
    <div className="content-stretch flex items-start pt-[6px] relative shrink-0" data-name="Container:margin">
      <Container32 />
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[0] not-italic relative shrink-0 text-[#131313] text-[0px] w-[262px]">
        <span className="leading-[18px] text-[12px]">Admin</span>
        <span className="font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] text-[12px]">{` đã bật email nhắc lịch cho `}</span>
        <span className="leading-[18px] text-[12px]">NetEvent Demo Conference 2026</span>
      </p>
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pt-[2px] relative shrink-0 w-[262px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">5 giờ trước</p>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-[262_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Paragraph20 />
      <Paragraph21 />
    </div>
  );
}

function Container31() {
  return (
    <div className="border-[#e4e9f3] border-b border-solid content-stretch flex gap-[10px] items-start py-[10px] relative shrink-0 w-[278px]" data-name="Container">
      <ContainerMargin4 />
      <Container33 />
    </div>
  );
}

function Container35() {
  return <div className="bg-[#1eaaff] relative rounded-[3px] shrink-0 size-[6px]" data-name="Container" />;
}

function ContainerMargin5() {
  return (
    <div className="content-stretch flex items-start pt-[6px] relative shrink-0" data-name="Container:margin">
      <Container35 />
    </div>
  );
}

function Paragraph22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[0] not-italic relative shrink-0 text-[#131313] text-[0px] w-[262px]">
        <span className="leading-[18px] text-[12px]">Staff B</span>
        <span className="font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] text-[12px]">{` đã xác nhận trao quà cho `}</span>
        <span className="leading-[18px] text-[12px]">Sun Music Festival 2026</span>
      </p>
    </div>
  );
}

function Paragraph23() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pt-[2px] relative shrink-0 w-[262px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">6 giờ trước</p>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-[262_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Paragraph22 />
      <Paragraph23 />
    </div>
  );
}

function Container34() {
  return (
    <div className="border-[#e4e9f3] border-b border-solid content-stretch flex gap-[10px] items-start py-[10px] relative shrink-0 w-[278px]" data-name="Container">
      <ContainerMargin5 />
      <Container36 />
    </div>
  );
}

function Container38() {
  return <div className="bg-[#1eaaff] relative rounded-[3px] shrink-0 size-[6px]" data-name="Container" />;
}

function ContainerMargin6() {
  return (
    <div className="content-stretch flex items-start pt-[6px] relative shrink-0" data-name="Container:margin">
      <Container38 />
    </div>
  );
}

function Paragraph24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Medium',sans-serif] leading-[0] not-italic relative shrink-0 text-[#131313] text-[0px] w-[262px]">
        <span className="leading-[18px] text-[12px]">Nguyễn Thị Lan</span>
        <span className="font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] text-[12px]">{` đã xuất bản `}</span>
        <span className="leading-[18px] text-[12px]">Startup Pitch Night</span>
      </p>
    </div>
  );
}

function Paragraph25() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pt-[2px] relative shrink-0 w-[262px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Be_Vietnam_Pro:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#595959] text-[12px] whitespace-nowrap">1 ngày trước</p>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-[262_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Paragraph24 />
      <Paragraph25 />
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex gap-[10px] items-start py-[10px] relative shrink-0 w-[278px]" data-name="Container">
      <ContainerMargin6 />
      <Container39 />
    </div>
  );
}

function Container23() {
  return (
    <div className="bg-white border border-[#e4e9f3] border-solid content-stretch flex flex-col items-start p-[20px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <Container24 />
      <ContainerMargin1 />
      <Container28 />
      <Container31 />
      <Container34 />
      <Container37 />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative self-stretch" data-name="Container">
      <Container23 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[24px] items-start min-w-px relative">
      <Frame />
      <Container22 />
    </div>
  );
}

function AccountOverview() {
  return (
    <div className="content-stretch flex items-start max-w-[1280px] pb-[40px] px-[40px] relative shrink-0 w-[1280px]" data-name="AccountOverview">
      <Frame1 />
    </div>
  );
}

function ContainerMargin() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container:margin">
      <AccountOverview />
    </div>
  );
}

export default function MainContent() {
  return (
    <div className="content-stretch flex flex-col items-start py-[16px] relative size-full" data-name="Main Content">
      <ContainerMargin />
    </div>
  );
}