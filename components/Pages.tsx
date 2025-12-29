"use client";
import usePageManager from "@/hooks/usePageManager";
import Page1 from "@/components/pages/page1";
import Page2 from "@/components/pages/page2";
import Page3 from "@/components/pages/page3";
import Page4 from "@/components/pages/page4";
import Page5 from "@/components/pages/page5";
import Page6 from "@/components/pages/page6";
import Page7 from "@/components/pages/page7";
import Page8 from "@/components/pages/page8";
import Page9 from "@/components/pages/page9";
import Page10 from "@/components/pages/page10";
import Page11 from "@/components/pages/page11";
import Page12 from "@/components/pages/page12";
import Page13 from "@/components/pages/page13";
import Page14 from "@/components/pages/page14";
import Page15 from "@/components/pages/page15";
import Page16 from "@/components/pages/page16";
import Page17 from "@/components/pages/page17";
import Page18 from "@/components/pages/page18";
import Page19 from "@/components/pages/page19";
import Page20 from "@/components/pages/page20";
import Page21 from "@/components/pages/page21";
import Page22 from "@/components/pages/page22";
import Page23 from "@/components/pages/page23";
import Page24 from "@/components/pages/page24";

const PAGES = [
  Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8,
  Page9, Page10, Page11, Page12, Page13, Page14, Page15, Page16,
  Page17, Page18, Page19, Page20, Page21, Page22, Page23, Page24
];

export const TOTAL_PAGES = PAGES.length;

export default function Pages() {
  const { currentPage } = usePageManager(); 
  
  return (
    <>
      {PAGES.map((Comp, idx) => (
        <div key={idx} className={`page ${idx + 1 === currentPage ? "active" : ""}`}>
           <Comp />
        </div>
      ))}
    </>
  );
}
