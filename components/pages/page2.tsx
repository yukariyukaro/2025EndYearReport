"use client";
import { useCallback, useState, useRef, useEffect } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import styles from "./styles/page2.module.css";

export default function Page2() {
  const PAGE_NUMBER = 2;
  const { appendNextPage } = usePageManager();
  // 暂时强制显示 Night 模式以还原设计稿
  const [variant] = useState<"day" | "night">("night"); 
  const [isGrowing, setIsGrowing] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const handleTreeClick = () => {
    if (!isGrowing) {
      setIsGrowing(true);
    }
  };

  // 清理所有 pending 的动画定时器
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  // 组件卸载时清理
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  // 文本逐行浮现 (复用 page3 逻辑)
  function reveal(selector: string, delayMs: number, durationMs = 1500) {
    // 先重置（如果还在显示的话），确保动画能重新播放
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      el.classList.remove("reveal-line");
      el.classList.add("hide");
      // 强制重绘 (Reflow) 以确保 remove -> add 生效
      void el.offsetWidth;
    });

    const timer = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.classList.remove("hide");
        el.classList.add("reveal-line");
        el.style.setProperty("--reveal-duration", `${durationMs}ms`);
      });
    }, delayMs);
    
    timersRef.current.push(timer);
  }

  function onShow() {
    clearTimers(); // 每次开始新一轮动画前，清理旧的
    setShowHint(false); // 强制重置 Hint 状态
    
    let t = 100; // 初始延迟缩短为 100ms，确保进入页面后立即播放
    const stepSlow = 300;

    if (variant === "day") {
      // Day Mode Text
      reveal(".page2-day-reveal-1", t); 
      reveal(".page2-day-reveal-2", (t += stepSlow)); 
      reveal(".page2-day-reveal-3", (t += stepSlow)); 
      reveal(".page2-day-reveal-4", (t += stepSlow)); 
    } else {
      // Night Mode Text
      reveal(".page2-night-reveal-1", t);
      reveal(".page2-night-reveal-2", (t += stepSlow));
      reveal(".page2-night-reveal-3", (t += stepSlow));
      reveal(".page2-night-reveal-4", (t += stepSlow));
    }

    // 此时 t 是最后一行文字开始浮现的时间
    // 我们希望 hint 在最后一行文字浮现动画（duration=1500ms）大部分完成或结束后显示
    // 之前是 t += 600，即在最后一行开始后 600ms 显示，此时动画刚进行 40%
    // 建议增加到 t += 800 或更多，让文字更清晰后再出 hint
    const hintTimer = setTimeout(() => setShowHint(true), (t += 800));
    timersRef.current.push(hintTimer);
  }

  return (
    <PageWrapper 
      pageNumber={PAGE_NUMBER} 
      onShow={onShow}
      onAppendNext={() => setShowHint(false)}
    >
      {variant === "day" ? (
        <div className={styles.container}>
          {/* Top Cloud */}
          <div className={styles.cloud1}>
            <Image 
              src="/imgs/page2/page2Day/cloud1.svg" 
              alt="Cloud" 
              fill 
              className={styles.objectContain}
            />
          </div>

          {/* Text Group 1 */}
          <div className={styles.textGroup1}>
            <div className={`${styles.greetingRow} hide page2-day-reveal-1`}>
              <span className={styles.fontPrimary}>嘿！</span>
              <span className={styles.fontPrimary}>【用户名称】</span>
            </div>
            <span className={`${styles.fontPrimary} hide page2-day-reveal-2`}>你的25-26年度旅程即将开启——</span>
          </div>

          {/* Text Group 2 */}
          <div className={styles.textGroup2}>
            <span className={`${styles.fontPrimary} hide page2-day-reveal-3`}>阳光正好</span>
            <span className={`${styles.fontPrimary} hide page2-day-reveal-4`}>一起来回顾你的成长吧！</span>
          </div>

          {/* Visual Area */}
          <div className={styles.visualArea}>
            <div className={styles.cloud2}>
              <Image src="/imgs/page2/page2Day/cloud2.svg" alt="Cloud" fill />
            </div>

            <div className={styles.sun}>
               <div 
                 className={styles.treeWrapper} 
                 onClick={handleTreeClick}
                 data-next-ignore="true"
               >
                  {/* Small Tree (Sapling) */}
                  <Image 
                    src="/imgs/page2/tree.svg" 
                    alt="Small Tree" 
                    fill 
                    className={`${styles.smallTree} ${isGrowing ? styles.smallTreeHidden : ""}`}
                  />
                  
                  {/* Big Tree (Grown) */}
                  <Image 
                    src="/imgs/page2/page2Day/bigTree.svg" 
                    alt="Big Tree" 
                    fill 
                    className={`${styles.bigTree} ${isGrowing ? styles.bigTreeActive : ""}`}
                  />

                  {/* Hints */}
                  <div className={`${styles.arrow} ${isGrowing ? styles.fadeOut : ""}`}>
                    <Image src="/imgs/page2/arrow.svg" alt="Arrow" fill />
                  </div>
                  <span className={`${styles.clickHint} ${isGrowing ? styles.fadeOut : ""}`}>
                    点击树苗
                  </span>
               </div>
            </div>

            <div className={styles.cloud3}>
              <Image src="/imgs/page2/page2Day/cloud3.svg" alt="Cloud" fill />
            </div>

            <div className={styles.field}>
              <Image 
                src="/imgs/page2/field.png" 
                alt="Field" 
                fill 
                style={{ objectFit: "cover", objectPosition: "top" }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.nightContainer}>
          {/* Background */}
          <div className={styles.nightBackground}>
            <Image 
              src="/imgs/page2/page2Night/background.png" 
              alt="Night Background" 
              fill 
              style={{ objectFit: "cover" }} 
            />
          </div>

          {/* Text Group */}
          <div className={styles.nightTextGroup}>
            <div className={styles.nightTextBlock}>
               <div className={`${styles.greetingRow} hide page2-night-reveal-1`}>
                  <span className={styles.fontNight}>嘿！</span>
                  <span className={styles.fontNight}>【用户名称】</span>
               </div>
               <span className={`${styles.fontNight} hide page2-night-reveal-2`}>你的25-26年度旅程即将开启——</span>
            </div>
            
            <div className={styles.nightTextBlock}>
               <span className={`${styles.fontNight} hide page2-night-reveal-3`}>夜深了</span>
               <span className={`${styles.fontNight} hide page2-night-reveal-4`}>准备好回顾这一年了吗？</span>
            </div>
          </div>

          {/* Visual Area */}
          <div className={styles.visualArea}>
             <div className={styles.nightTreeContainer}>
                <div 
                   className={styles.treeWrapper} 
                   onClick={handleTreeClick}
                   data-next-ignore="true"
                >
                    {/* Small Tree (Sapling) - Same as Day */}
                    <Image 
                      src="/imgs/page2/page2Day/tree.png" 
                      alt="Small Tree" 
                      fill 
                      className={`${styles.smallTree} ${isGrowing ? styles.smallTreeHidden : ""}`}
                    />
                    
                    {/* Big Tree Night */}
                    <Image 
                      src="/imgs/page2/page2Night/bigTreeNight.svg" 
                      alt="Big Tree Night" 
                      fill 
                      className={`${styles.bigTree} ${isGrowing ? styles.bigTreeActive : ""}`}
                    />

                    {/* Hints */}
                    <div className={`${styles.arrow} ${isGrowing ? styles.fadeOut : ""}`}>
                      <Image src="/imgs/page2/arrow.svg" alt="Arrow" fill />
                    </div>
                    <span 
                      className={`${styles.clickHint} ${isGrowing ? styles.fadeOut : ""}`}
                      style={{ color: '#fff' }}
                    >
                      点击树苗
                    </span>
                </div>
             </div>

             <div className={styles.field}>
                <Image 
                  src="/imgs/page2/field.png" 
                  alt="Field" 
                  fill 
                  style={{ objectFit: "cover", objectPosition: "top" }}
                />
             </div>
          </div>
        </div>
      )}
      
      {showHint && (
        <div className="fade-in">
          <ScrollUpHint />
        </div>
      )}
    </PageWrapper>
  );
}
