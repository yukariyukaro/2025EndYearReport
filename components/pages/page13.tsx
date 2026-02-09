"use client";
import React, { useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import styles from "./styles/page13.module.css";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";
import { useSummary } from "@/contexts/SummaryContext";
import ScrollUpHint from "@/components/ScrollUpHint";

export default function Page13() {
  const PAGE_NUMBER = 13;
  const { appendNextPage } = usePageManager();
  const { data } = useSummary();
  
  const [showHint, setShowHint] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const { reveal, clearTimers, addTimer } = useRevealAnimation(PAGE_NUMBER);

  const postContent = data?.pages?.page9?.forget_follow_post_content || "这里似乎有一段被遗忘的记忆...";

  const onShow = () => {
    clearTimers();
    setShowHint(false);
    setShowPost(false);
    // Animation sequence
    reveal(`.page13-reveal-1`, 300);  // Title "BONUS TIME"
    // Question Text
    reveal(`.page13-reveal-2-1`, 800);
    reveal(`.page13-reveal-2-2`, 1000);
    reveal(`.page13-reveal-2-3`, 1200);
    // Hint Text
    reveal(`.page13-reveal-3-1`, 1500);
    reveal(`.page13-reveal-3-2`, 1700);
    // Other elements
    reveal(`.page13-reveal-4`, 2000); // Arrow
    reveal(`.page13-reveal-5`, 2200); // Button
    reveal(`.page13-reveal-6`, 2400); // Footer

    const hintTimer = setTimeout(() => setShowHint(true), 3000);
    addTimer(hintTimer);
  };

  const handlePress = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPost(true);
    setShowHint(false);
  };

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container}>
        {/* Background */}
        <div className={styles.background}>
          <Image
            src="imgs/page13/background.png"
            alt="Background"
            fill
            className={styles.backgroundImage}
            priority
          />
        </div>

        <div className={styles.content}>
          {/* Title Section */}
          <div className={`${styles.titleGroup} ${showPost ? styles.blur : ''}`}>
            <h1 className={`${styles.bonusText} hide page13-reveal-1`}>BONUS</h1>
            <h1 className={`${styles.bonusText} hide page13-reveal-1`}>TIME</h1>
          </div>

          {/* Question Text */}
          <div className={`${styles.questionGroup} ${showPost ? styles.blur : ''}`}>
            <p className={`${styles.questionText} hide page13-reveal-2-1`}>还记得</p>
            <p className={`${styles.questionText} hide page13-reveal-2-2`}>这条</p>
            <p className={`${styles.questionText} hide page13-reveal-2-3`}>
              被你珍藏的 <span className={styles.highlight}>「回忆」</span> 吗？
            </p>
          </div>

          {/* Interaction Area */}
          <div className={styles.interactionArea}>
            {!showPost && (
              <>
                <div className={styles.hintText}>
                    <div className={`hide page13-reveal-3-1`}>点击后随机推荐</div>
                    <div className={`hide page13-reveal-3-2`}>一条被遗忘的收藏</div>
                </div>

                <div className={`${styles.arrowWrapper} hide ${styles.bounce} page13-reveal-4`}>
                  <Image 
                    src="imgs/page13/arrow.svg" 
                    alt="Arrow" 
                    fill 
                    style={{ objectFit: "contain" }}
                  />
                </div>

                <div className={`${styles.buttonWrapper} hide page13-reveal-5`}>
                  <button className={`${styles.pressButton} ${styles.pulse}`} onClick={handlePress}>
                    <span className={styles.buttonText}>PRESS</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {showPost && (
             <div className={styles.postCardContainer}>
                <div className={styles.postCard}>
                   <div className={styles.postDecor}>“</div>
                   <div className={styles.postContent}>{postContent}</div>
                   <div className={styles.postDecorBottom}>”</div>
                </div>
                <div className={styles.tapContinue}>点击屏幕继续</div>
             </div>
          )}

          {/* Footer */}
        </div>

        {showHint && !showPost && (
          <div className="fade-in">
            <ScrollUpHint />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
