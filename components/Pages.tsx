"use client";
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import usePageManager from "@/hooks/usePageManager";
import Page1 from "@/components/pages/page1";

// 动态导入后续页面，减少首屏 Bundle 体积
const Page2 = dynamic(() => import("@/components/pages/page2"));
const Page3 = dynamic(() => import("@/components/pages/page3"));
const Page4 = dynamic(() => import("@/components/pages/page4"));
const Page5 = dynamic(() => import("@/components/pages/page5"));
const Page6 = dynamic(() => import("@/components/pages/page6"));
const Page7 = dynamic(() => import("@/components/pages/page7"));
const Page8 = dynamic(() => import("@/components/pages/page8"));
const Page9 = dynamic(() => import("@/components/pages/page9"));
const Page10 = dynamic(() => import("@/components/pages/page10"));
const Page11 = dynamic(() => import("@/components/pages/page11"));
const Page12 = dynamic(() => import("@/components/pages/page12"));
const Page13 = dynamic(() => import("@/components/pages/page13"));
const Page14 = dynamic(() => import("@/components/pages/page14"));
const Page15 = dynamic(() => import("@/components/pages/page15"));
const Page16 = dynamic(() => import("@/components/pages/page16"));
const Page17 = dynamic(() => import("@/components/pages/page17"));
const Page18 = dynamic(() => import("@/components/pages/page18"));
const Page19 = dynamic(() => import("@/components/pages/page19"));
const Page20 = dynamic(() => import("@/components/pages/page20"));
const Page21 = dynamic(() => import("@/components/pages/page21"));
const Page22 = dynamic(() => import("@/components/pages/page22"));
const Page23 = dynamic(() => import("@/components/pages/page23"));

const PAGES = [
  Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8,
  Page9, Page10, Page11, Page12, Page13, Page14, Page15, Page16,
  Page17, Page18, Page19, Page20, Page21, Page22, Page23,
];

export const TOTAL_PAGES = PAGES.length;

export default function Pages() {
  const { currentPage } = usePageManager(); 

  useEffect(() => {
    // 动态设置视口高度，解决移动端 Safari/Chrome 工具栏遮挡问题
    const setAppHeight = () => {
      // 优先使用 visualViewport 高度，否则回退到 innerHeight
      const visualHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      document.documentElement.style.setProperty('--app-height', `${visualHeight}px`);
    };

    if (typeof window !== 'undefined') {
      setAppHeight();
      // 监听 visualViewport 变化（iOS 键盘/地址栏）
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', setAppHeight);
        window.visualViewport.addEventListener('scroll', setAppHeight);
      }
      // 同时也监听常规 resize 作为回退
      window.addEventListener('resize', setAppHeight);
    }

    return () => {
      if (typeof window !== 'undefined') {
        if (window.visualViewport) {
          window.visualViewport.removeEventListener('resize', setAppHeight);
          window.visualViewport.removeEventListener('scroll', setAppHeight);
        }
        window.removeEventListener('resize', setAppHeight);
      }
    };
  }, []);
  
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
