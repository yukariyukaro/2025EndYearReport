"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import ScrollUpHint from "@/components/ScrollUpHint";
import { sendViewPageTracking } from "@/utils/dom";
import styles from "./styles/page22.module.css";
import usePageManager from "@/hooks/usePageManager";

// Component24 (Page22) - 成就总结页组件
// 进入页面时，图片元素从四周滑动出现
export default function Page22() {
  const PAGE_NUMBER = 22;
  const { appendNextPage } = usePageManager();

  // 模拟数据 - 实际应从 props 或 API 获取
  const achievementCount = 15; // 成就数量
  const growthPercentage = 25; // 成长百分比
  const [showHint, setShowHint] = useState(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const handleTreeTrunkClick = () => {
    // 点击树干查看成长足迹的逻辑
    // advance to next page (page23)
    try {
      appendNextPage(PAGE_NUMBER, true);
    } catch (e) {
      // fallback: log
      console.log("点击树干查看成长足迹");
    }
  };

  

  // 图片滑动出现动画 - 参考example.tsx的reveal方式
  function slideIn(selector: string, delayMs: number, fromDirection: 'left' | 'right' | 'top' | 'bottom' = 'bottom', durationMs = 800) {
    setTimeout(() => {
      if (typeof document === "undefined") return;
      const pageElement = document.getElementById(`page${PAGE_NUMBER}`);
      if (!pageElement) return;
      
      const elements = pageElement.querySelectorAll<HTMLElement>(selector);
      elements.forEach((el) => {
        el.classList.remove("hide");
        
        // 根据方向设置初始位置
        let initialTransform = "";
        switch (fromDirection) {
          case 'left':
            initialTransform = "translateX(-100px)";
            break;
          case 'right':
            initialTransform = "translateX(100px)";
            break;
          case 'top':
            initialTransform = "translateY(-100px)";
            break;
          case 'bottom':
            initialTransform = "translateY(100px)";
            break;
        }
        
        // 设置初始状态
        el.style.transform = initialTransform;
        el.style.opacity = "0";
        el.style.transition = `transform ${durationMs}ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity ${durationMs}ms ease-out`;
        
        // 触发动画
        requestAnimationFrame(() => {
          el.style.transform = "translate(0, 0)";
          el.style.opacity = "1";
        });
      });
    }, delayMs);
  }

  // 淡入动画 - 参考Page2
  function fadeIn(selector: string, delayMs: number, durationMs = 600) {
    setTimeout(() => {
      if (typeof document === "undefined") return;
      const pageElement = document.getElementById(`page${PAGE_NUMBER}`);
      if (!pageElement) return;
      
      const elements = pageElement.querySelectorAll<HTMLElement>(selector);
      elements.forEach((el) => {
        el.classList.remove("hide");
        el.style.transition = `opacity ${durationMs}ms ease-out, transform ${durationMs}ms ease-out`;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    }, delayMs);
  }

  // 缩放进入动画
  function scaleIn(selector: string, delayMs: number, durationMs = 600) {
    setTimeout(() => {
      if (typeof document === "undefined") return;
      const pageElement = document.getElementById(`page${PAGE_NUMBER}`);
      if (!pageElement) return;
      
      const elements = pageElement.querySelectorAll<HTMLElement>(selector);
      elements.forEach((el) => {
        el.classList.remove("hide");
        el.style.transition = `transform ${durationMs}ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity ${durationMs}ms ease-out`;
        el.style.transform = "scale(1)";
        el.style.opacity = "1";
      });
    }, delayMs);
  }

  // 页面进入视口时触发动画 - 参考example.tsx
  function onShow() {
    let t = 0;
    const step = 200; // 动画间隔时间
    setShowHint(false);

    // 第一部分：今年成就区域
    // 文本从左侧滑入
    slideIn(".page22-text-1", (t += step), 'left', 800);
    slideIn(".page22-text-2", (t += step), 'left', 800);
    
    // 树从下方滑入
    slideIn(".page22-tree-1", (t += step * 1.5), 'bottom', 1000);
    
    // 提示文字和箭头从右侧滑入
    slideIn(".page22-hint", (t += step * 1.2), 'right', 800);
    
    // 叶子装饰从不同方向滑入
    slideIn(".page22-leaf-1", (t += step), 'top', 700);
    slideIn(".page22-leaf-2", (t += step), 'left', 700);
    slideIn(".page22-leaf-3", (t += step), 'right', 700);
    slideIn(".page22-leaf-4", (t += step), 'bottom', 700);
    slideIn(".page22-leaf-5", (t += step), 'top', 700);
    slideIn(".page22-leaf-6", (t += step), 'top', 700);


    // 页脚从下方滑入
    /*slideIn(".page22-footer", (t += step), 'bottom', 600);*/
  }

  function handleShow() {
    onShow();
    sendViewPageTracking(PAGE_NUMBER);
    const hintTimer = setTimeout(() => setShowHint(true),  900);
    timersRef.current.push(hintTimer);
  }

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={handleShow} onAppendNext={() => setShowHint(false)} className={styles.container}>
      {/* 第一部分：今年成就 */}
      <div className="content-block">
        {/* 文本内容 */}
        <div className="page22-text-1 hide">
          <p>今年你收获了
            <span className="figure"><data>{achievementCount}</data></span>个成就</p>
        </div>
        <div className="page22-text-2 hide">
          <p>比去年增长了<span className="figure"><data>{growthPercentage}</data></span>%</p>
        </div>

        {/* 树图片 - 从下方滑入 */}
        <div className="page22-tree-1 hide" onClick={handleTreeTrunkClick} data-next-ignore="true">
          <div className="relative">
            <Image 
              src="/imgs/page22/tree.png" 
              alt="Tree" 
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* 提示文字和箭头 - 从右侧滑入 */}
        <div className="page22-hint hide flex items-center justify-start gap-3 mt-6">
          <div className="relative w-[2.85rem] h-[2.65rem]" style={{ animation: "float 2s ease-in-out infinite" }}>
            <Image src="/imgs/page22/arrow.png" alt="Arrow" width={51} height={80} />
          </div>
          <span className="text-[0.6rem] text-[#87CEEB] whitespace-nowrap">
            <p>点击树干</p> 
            <p>看看你的成长足迹</p>
          </span>
        </div>

        {/* 叶子装饰 - 从不同方向滑入 */}
        <div className="relative w-full min-h-[400px]">
          <div className="page22-leaf-1 hide">
            <Image src="/imgs/page22/leaf1.png" alt="Leaf 1" width={180} height={150} className="object-contain" />
          </div>
          <div className="page22-leaf-2 hide">
            <Image src="/imgs/page22/leaf2.png" alt="Leaf 2" width={140} height={120} className="object-contain" />
          </div>
          <div className="page22-leaf-3 hide">
            <Image src="/imgs/page22/leaf3.png" alt="Leaf 3" width={104} height={173} className="object-contain" />
          </div>
          <div className="page22-leaf-4 hide">
            <Image src="/imgs/page22/leaf4.png" alt="Leaf 4" width={72} height={234} className="object-contain" />
          </div>
          <div className="page22-leaf-5 hide">
            <Image src="/imgs/page22/leaf5.png" alt="Leaf 5" width={130} height={200} className="object-contain" />
          </div>
          <div className="page22-leaf-6 hide">
            <Image src="/imgs/page22/leaf6.png" alt="Leaf 6" width={85} height={174} className="object-contain" />
          </div>
        </div>
      </div>

      {showHint && (
          <div className="fade-in">
            <ScrollUpHint />
          </div>
        )}
    </PageWrapper>
  );
}
