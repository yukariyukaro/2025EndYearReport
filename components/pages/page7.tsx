"use client";
import { useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import { useSummary } from "@/contexts/SummaryContext";
import styles from "./styles/page7.module.css";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";

export default function Page7() {
  const PAGE_NUMBER = 7;
  const { appendNextPage } = usePageManager();
  const { data } = useSummary();

  const lateNightRatio = data?.pages?.page4?.late_night_ratio ?? 0;
  const beatPercentage = data?.pages?.page5?.beat_percentage ?? 0;
  const earliestContentRaw = data?.pages?.page5?.earliest_content;

  // 智能截断逻辑：一句话或15字
  const formatEarliestContent = (text: string | undefined | null) => {
    if (!text) return "（树洞）";
    
    const MAX_LENGTH = 15;
    
    // 1. 找第一句结束位置
    const punctuationRegex = /[。！？.!?\n]/;
    const match = punctuationRegex.exec(text);
    
    let cutIndex = text.length;

    if (match) {
      // 如果有标点
      if (match.index + 1 <= MAX_LENGTH) {
         // 第一句在限制内，完美
         return text.substring(0, match.index + 1);
      } else {
         // 第一句太长，强制截断
         cutIndex = MAX_LENGTH;
      }
    } else {
      // 无标点，检查长度
      if (text.length > MAX_LENGTH) {
        cutIndex = MAX_LENGTH;
      } else {
        return text;
      }
    }

    return text.substring(0, cutIndex) + "...";
  };

  const earliestContent = formatEarliestContent(earliestContentRaw);
  
  const [showHint, setShowHint] = useState(false);
  const [capsuleOpened, setCapsuleOpened] = useState(false);
  const { reveal, clearTimers, addTimer } = useRevealAnimation(PAGE_NUMBER);

  function onShow() {
    clearTimers();
    setShowHint(false);
    setCapsuleOpened(false);

    let t = 100;
    const step = 300;

    // 1. Top stats
    reveal(".page7-reveal-1", t);
    reveal(".page7-reveal-2", (t += step));
    reveal(".page7-reveal-3", (t += step));
    
    // 2. Question section - Only title
    reveal(".page7-reveal-4", (t += step)); // Subtitle

    // 3. Bottom interaction
    reveal(".page7-reveal-7", (t += step)); // Time travel text
    reveal(".page7-reveal-8", (t += step)); // Button & Arrow

    const hintTimer = setTimeout(() => setShowHint(true), (t += 600));
    addTimer(hintTimer);
  }

  const handleCapsuleClick = () => {
    if (!capsuleOpened) {
      setCapsuleOpened(true);
      return;
    }
    // Already opened, allow next page? Or just do nothing?
    // User said: "不需要修改page7时间胶囊的位置...点击按钮后显示"
    // Original behavior was handleNext -> appendNextPage
    // Let's keep it so second click goes to next page, similar to Page4 logic we added.
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
            src="imgs/page7/background.png" 
            alt="Page 7 Background" 
            fill 
            style={{ objectFit: "cover" }} 
            priority
          />
        </div>

        <div className={styles.content}>
          {/* Top Text Group */}
          <div className={styles.topTextGroup}>
            <p className={`${styles.topText} hide page7-reveal-1`}>今年</p>
            <p className={`${styles.topText} hide page7-reveal-2`}>
              你熬夜的比例是 {lateNightRatio}%
            </p>
            <p className={`${styles.topText} hide page7-reveal-3`}>
              你的作息打败了 {beatPercentage}% 的用户！
            </p>
            
            <p className={`${styles.topText} ${styles.subTitle} hide page7-reveal-4`}>
              还记得你的第一条浏览吗？
            </p>
          </div>

          {/* Tree Hole Box & Open Question - Hidden initially */}
          <div className={`${styles.hiddenPlaceholder} ${capsuleOpened ? styles.visible : ''}`}>
             <div className={`${styles.treeHoleBox} ${capsuleOpened ? styles.expandActive : ''}`}>
               <span className={styles.treeHoleText}>{earliestContent}</span>
             </div>

             <div className={`${styles.openQuestionBox} ${capsuleOpened ? styles.expandActiveDelayed : ''}`}>
               <div className={styles.questionHeader}>
                 <div className={styles.questionIcon}>
                   <Image src="imgs/page7/questionIcon.svg" alt="Question" fill />
                 </div>
                 <span className={styles.questionLabel}>Open Question</span>
               </div>
               <p className={styles.questionText}>那时的你在想什么？🤔</p>
             </div>
          </div>

          {/* Bottom Area */}
          <div className={styles.bottomArea}>
            <p className={`${styles.timeTravelText} hide page7-reveal-7`}>
              时间旅行，回到那天
            </p>
            
            <div 
              className={`${styles.playButtonWrapper} ${!capsuleOpened ? styles.pulseGlow : ""} hide page7-reveal-8`}
              onClick={handleCapsuleClick}
              data-next-ignore="true"
            >
              <div className={styles.playButton}>
                <div className={styles.playIcon}>
                  {capsuleOpened ? (
                     <div className={styles.pauseIconCircle}>
                        <div className={styles.pauseBars}>
                           <div className={styles.pauseBar} />
                           <div className={styles.pauseBar} />
                        </div>
                     </div>
                  ) : (
                     <Image src="imgs/page7/PlayCircle.svg" alt="Play" fill />
                  )}
                </div>
              </div>
              
              <div className={styles.arrowDecor}>
                 <Image src="imgs/page7/arrow.svg" alt="Arrow" fill />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showHint && (
        <div 
          className="fade-in" 
          style={{ 
            position: 'absolute', 
            zIndex: 10, 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            pointerEvents: 'none' 
          }}
        >
          <ScrollUpHint />
        </div>
      )}
    </PageWrapper>
  );
}
