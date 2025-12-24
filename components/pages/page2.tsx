"use client";
import { useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import styles from "./styles/page2.module.css";

export default function Page2() {
  const PAGE_NUMBER = 2;
  const { appendNextPage } = usePageManager();
  // 暂时强制显示 Day 模式以还原设计稿，实际逻辑可保留
  const [variant] = useState<"day" | "night">("day"); 
  const [isGrowing, setIsGrowing] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  const handleTreeClick = () => {
    if (!isGrowing) {
      setIsGrowing(true);
    }
  };

  // 动画触发函数 - 文本从左到右浮现
  function reveal(selector: string, delayMs: number, durationMs = 800) {
    setTimeout(() => {
      if (typeof document === "undefined") return;
      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach((el) => {
        el.classList.remove("hide");
        el.classList.add("reveal-line");
        el.style.setProperty("--reveal-duration", `${durationMs}ms`);
      });
    }, delayMs);
  }

  // 淡入动画
  function fadeIn(selector: string, delayMs: number, durationMs = 600) {
    setTimeout(() => {
      if (typeof document === "undefined") return;
      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach((el) => {
        el.style.transition = `opacity ${durationMs}ms ease-out, transform ${durationMs}ms ease-out`;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    }, delayMs);
  }

  // 从下往上滑入
  function slideUp(selector: string, delayMs: number, durationMs = 800) {
    setTimeout(() => {
      if (typeof document === "undefined") return;
      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach((el) => {
        el.style.transition = `transform ${durationMs}ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity ${durationMs}ms ease-out`;
        el.style.transform = "translateY(0)";
        el.style.opacity = "1";
      });
    }, delayMs);
  }

  // 缩放进入
  function scaleIn(selector: string, delayMs: number, durationMs = 600) {
    setTimeout(() => {
      if (typeof document === "undefined") return;
      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach((el) => {
        el.style.transition = `transform ${durationMs}ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity ${durationMs}ms ease-out`;
        el.style.transform = "scale(1)";
        el.style.opacity = "1";
      });
    }, delayMs);
  }

  function onShow() {
    if (isAnimated) return;
    setIsAnimated(true);
    
    let t = 0;
    const step = 200; // 动画间隔时间

    // 1. 云朵1淡入（左上）
    fadeIn(`.${styles.cloud1}`, (t += step), 800);

    // 2. 文本组1逐行出现
    reveal(`.${styles.textGroup1} .${styles.greetingRow} span:nth-child(1)`, (t += step * 2), 600);
    reveal(`.${styles.textGroup1} .${styles.greetingRow} span:nth-child(2)`, (t += step), 600);
    reveal(`.${styles.textGroup1} > span`, (t += step * 2), 800);

    // 3. 文本组2逐行出现
    reveal(`.${styles.textGroup2} span:nth-child(1)`, (t += step * 2), 700);
    reveal(`.${styles.textGroup2} span:nth-child(2)`, (t += step * 1.5), 700);

    // 4. 视觉区域元素
    // 云朵2（右上）
    fadeIn(`.${styles.cloud2}`, (t += step), 1000);
    
    // 太阳缩放进入
    scaleIn(`.${styles.sun}`, (t += step * 1.5), 1000);
    
    // 树苗淡入
    fadeIn(`.${styles.treeWrapper}`, (t += step * 2), 800);
    
    // 提示箭头和文字
    fadeIn(`.${styles.arrow}`, (t += step * 2), 600);
    fadeIn(`.${styles.clickHint}`, (t += step), 600);

    // 5. 云朵3（左下）
    fadeIn(`.${styles.cloud3}`, (t += step * 1.5), 1000);

    // 6. 地面从下往上滑入
    slideUp(`.${styles.field}`, (t += step * 2), 1000);
  }

  function handleShow() {
    onShow();
  }

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={handleShow}>
      {variant === "day" ? (
        <div className={styles.container}>
          {/* Top Cloud */}
          <div className={`${styles.cloud1} hide`}>
            <Image 
              src="/imgs/page2Day/cloud1.svg" 
              alt="Cloud" 
              fill 
              className={styles.objectContain}
            />
          </div>

          {/* Text Group 1 */}
          <div className={styles.textGroup1}>
            <div className={styles.greetingRow}>
              <span className={`${styles.fontPrimary} hide`}>嘿！</span>
              <span className={`${styles.fontPrimary} hide`}>【用户名称】</span>
            </div>
            <span className={`${styles.fontPrimary} hide`}>你的25-26年度旅程即将开启——</span>
          </div>

          {/* Text Group 2 */}
          <div className={styles.textGroup2}>
            <span className={`${styles.fontPrimary} hide`}>阳光正好</span>
            <span className={`${styles.fontPrimary} hide`}>一起来回顾你的成长吧！</span>
          </div>

          {/* Visual Area */}
          <div className={styles.visualArea}>
            <div className={`${styles.cloud2} hide`}>
              <Image src="/imgs/page2Day/cloud2.svg" alt="Cloud" fill />
            </div>

            <div className={`${styles.sun} hide`} style={{ transform: "scale(0.8)", opacity: "0" }}>
               <div 
                 className={styles.treeWrapper} 
                 onClick={handleTreeClick}
                 data-next-ignore="true"
               >
                  {/* Small Tree (Sapling) */}
                  <Image 
                    src="/imgs/page2Day/tree.svg" 
                    alt="Small Tree" 
                    fill 
                    className={`${styles.smallTree} ${isGrowing ? styles.smallTreeHidden : ""}`}
                  />
                  
                  {/* Big Tree (Grown) */}
                  <Image 
                    src="/imgs/page2Day/bigTree.svg" 
                    alt="Big Tree" 
                    fill 
                    className={`${styles.bigTree} ${isGrowing ? styles.bigTreeActive : ""}`}
                  />

                  {/* Hints */}
                  <div className={`${styles.arrow} hide ${isGrowing ? styles.fadeOut : ""}`}>
                    <Image src="/imgs/page2Day/arrow.svg" alt="Arrow" fill />
                  </div>
                  <span className={`${styles.clickHint} hide ${isGrowing ? styles.fadeOut : ""}`}>
                    点击树苗
                  </span>
               </div>
            </div>

            <div className={`${styles.cloud3} hide`}>
              <Image src="/imgs/page2Day/cloud3.svg" alt="Cloud" fill />
            </div>

            <div className={`${styles.field} hide`} style={{ transform: "translateY(50px)", opacity: "0" }}>
              <Image 
                src="/imgs/page2Day/field.png" 
                alt="Field" 
                fill 
                style={{ objectFit: "cover", objectPosition: "top" }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div>Night Mode (TODO)</div>
      )}
    </PageWrapper>
  );
}
