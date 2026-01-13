"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import { useSummary } from "@/contexts/SummaryContext";
import styles from "./styles/page4.module.css";

export default function Page4() {
  const PAGE_NUMBER = 4;
  const { appendNextPage, currentPage } = usePageManager();
  const { data } = useSummary();
  // 绑定后端数据：注册关键词
  const keyword = data?.pages?.page2?.register_keyword || "默认";
  // 绑定后端数据：时间胶囊 Top Post
  const topPost = data?.pages?.page2?.time_capsule?.top_post;

  // 智能截断逻辑
  const formatCapsuleContent = (text: string | undefined | null) => {
    if (!text) return "那天的树洞很安静，\n大家都把心事藏在了风里...";
    
    const MAX_LENGTH = 65; // 约5-6行，留有余地
    
    // 1. 尝试寻找前两句的结束位置
    // 匹配标点：句号、问号、感叹号 (中英文) 或 换行符
    // 懒惰匹配直到找到第二个标点或字符串结束
    // 这里的逻辑是：找所有标点位置，取第二个
    const punctuationRegex = /[。！？.!?\n]/g;
    let match;
    let count = 0;
    let secondSentenceEndIndex = -1;

    while ((match = punctuationRegex.exec(text)) !== null) {
      count++;
      if (count === 2) {
        secondSentenceEndIndex = match.index;
        break;
      }
    }

    // 如果没找到两个标点，尝试找一个
    if (secondSentenceEndIndex === -1 && count === 1) {
       // 只有一个句子，如果长度合适就用它
       // 实际上 reset regex 找第一个
       punctuationRegex.lastIndex = 0;
       const firstMatch = punctuationRegex.exec(text);
       if (firstMatch) secondSentenceEndIndex = firstMatch.index;
    }

    // 2. 决策截断位置
    let cutIndex = text.length;

    if (secondSentenceEndIndex !== -1 && secondSentenceEndIndex < MAX_LENGTH) {
      // 如果前两句长度在允许范围内，就在第二句结束处截断
      cutIndex = secondSentenceEndIndex + 1; // 包含标点
    } else {
      // 否则（没有标点，或者前两句太长），直接按最大长度截断
      cutIndex = Math.min(text.length, MAX_LENGTH);
    }

    // 3. 执行截断
    let result = text.substring(0, cutIndex);
    
    // 如果发生了截断（长度小于原文本），添加省略号
    if (cutIndex < text.length) {
      result += "...";
    }

    return result;
  };

  const capsuleContent = formatCapsuleContent(topPost);

  
  const [showHint, setShowHint] = useState(false);
  const [capsuleOpened, setCapsuleOpened] = useState(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // 清理 timers
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  useEffect(() => {
    if (currentPage !== PAGE_NUMBER) {
      clearTimers();
      const t = setTimeout(() => setCapsuleOpened(false), 0);
      document.querySelectorAll<HTMLElement>(".reveal-active").forEach((el) => {
        el.classList.remove("reveal-active");
        el.classList.add("hide");
      });
      return () => clearTimeout(t);
    }
  }, [currentPage, PAGE_NUMBER, clearTimers]);

  // 复用动画逻辑
  function reveal(selector: string, delayMs: number, durationMs = 1000) {
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      el.classList.remove("reveal-active");
      el.classList.add("hide"); // Use global hide
      el.style.setProperty("--reveal-duration", `${durationMs}ms`);
    });

    const timer = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.classList.add("reveal-active");
      });
    }, delayMs);
    timersRef.current.push(timer);
  }

  function onShow() {
    clearTimers();
    setShowHint(false);
    setCapsuleOpened(false);

    let t = 100;
    const stepSlow = 300;

    // 1. Top Text
    reveal(".page4-reveal-1", t); 
    reveal(".page4-reveal-2", (t += stepSlow));

    // 2. Center Section (Button & Box)
    reveal(".page4-reveal-3", (t += stepSlow)); // Button

    // 3. Bottom Text
    reveal(".page4-reveal-5", (t += stepSlow)); 
    reveal(".page4-reveal-6", (t += stepSlow)); 

    const hintTimer = setTimeout(() => setShowHint(true), (t += 600));
    timersRef.current.push(hintTimer);
  }

  const handleCapsuleClick = () => {
    if (!capsuleOpened) {
      setCapsuleOpened(true);
      return;
    }
    appendNextPage(PAGE_NUMBER, true);
  };

  return (
    <PageWrapper 
      pageNumber={PAGE_NUMBER} 
      onShow={onShow}
      onAppendNext={() => setShowHint(false)}
    >
      <div className={styles.container}>
        {/* Background */}
        <div className={styles.background}>
          <Image 
            src="imgs/page4/background.svg" 
            alt="Background" 
            fill 
            style={{ objectFit: "cover" }} 
          />
        </div>

        <div className={styles.content}>
          {/* Top Section */}
          <div className={styles.topSection}>
            <span className={`${styles.titleText} hide page4-reveal-1`}>打开时间的胶囊</span>
            <span className={`${styles.titleText} hide page4-reveal-2`}>看看那天的树洞吧</span>
          </div>

          {/* Center Section */}
          <div className={styles.centerSection}>
            {/* Play Button */}
            <div 
              className={`${styles.playButtonWrapper} ${!capsuleOpened ? styles.pulseGlow : ""} hide page4-reveal-3`}
              onClick={handleCapsuleClick}
              data-next-ignore="true" // Ignore full page click, handle locally if needed (though here it does next page anyway)
            >
               <div className={styles.playButton}>
                  <div className={styles.playIcon}>
                    {capsuleOpened ? (
                      <div className={styles.pauseIconCircle} aria-hidden="true">
                        <div className={styles.pauseBars}>
                          <div className={styles.pauseBar} />
                          <div className={styles.pauseBar} />
                        </div>
                      </div>
                    ) : (
                      <Image src="imgs/page4/PlayCircle.svg" alt="Play" fill />
                    )}
                  </div>
               </div>
               {/* Arrow Decor */}
               <div className={styles.arrowDecor}>
                  <Image src="imgs/page4/Vector.svg" alt="Arrow" fill />
               </div>
            </div>

            {/* Tree Hole Box */}
            {capsuleOpened && (
              <div className={styles.treeHoleWrapper}>
                <div className={styles.treeHoleInner}>
                  <div className={styles.personDecor}>
                    <Image src="imgs/page4/小人儿.svg" alt="Person" fill />
                  </div>

                  <div className={styles.treeHoleBox}>
                    <span className={styles.treeHoleText}>{capsuleContent}</span>
                  </div>

                  <div className={styles.starDecor}>
                    <Image src="imgs/page4/right.svg" alt="Decor" fill />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <div className={styles.bottomSection}>
             <div className={`${styles.bottomTextGroup} hide page4-reveal-5`}>
                <span className={styles.bottomText}>
                  你注册时<br/>
                  大家最关心的是
                </span>
                <div className={styles.fingerIcon}>
                   <Image src="imgs/page4/pointUp.svg" alt="Point Up" fill />
                </div>
             </div>
             <span className={`${styles.keywordText} hide page4-reveal-6`}>【{keyword}】</span>
          </div>
          {/* Footer removed, will be handled globally */}
        </div>
      </div>

      {showHint && currentPage === PAGE_NUMBER && (
        <div className="fade-in">
          <ScrollUpHint />
        </div>
      )}
    </PageWrapper>
  );
}
