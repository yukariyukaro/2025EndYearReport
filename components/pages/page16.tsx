"use client";
import { useCallback, useRef, useEffect, useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import styles from "./styles/page16.module.css";

export default function Page16() {
  const PAGE_NUMBER = 16;
  const { currentPage } = usePageManager();
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const [showHint, setShowHint] = useState(false);

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
      document.querySelectorAll('[class*="page16-reveal"]').forEach((el) => {
        el.classList.remove(styles.visible);
      });
    }
  }, [currentPage, PAGE_NUMBER, clearTimers]);

  const reveal = useCallback((selector: string, delayMs: number) => {
    const timer = setTimeout(() => {
      document.querySelectorAll(selector).forEach((el) => {
        el.classList.add(styles.visible);
      });
    }, delayMs);
    timersRef.current.push(timer);
  }, []);

  function onShow() {
    clearTimers();
    setShowHint(false);

    reveal(`.page16-reveal-spring`, 100);
    reveal(`.page16-reveal-title`, 400);
    reveal(`.page16-reveal-summer`, 700);
    reveal(`.page16-reveal-autumn`, 1000);
    reveal(`.page16-reveal-rabbit-pair`, 1300);
    reveal(`.page16-reveal-winter`, 1600);
    reveal(`.page16-reveal-rabbit-single`, 1900);
    reveal(`.page16-reveal-bottom-text`, 2200);

    const hintTimer = setTimeout(() => setShowHint(true), 2500);
    timersRef.current.push(hintTimer);
  }

  // Text variables extracted
  const POST_EMOTION_TITLE_LINE1 = "你的发帖情绪";
  const POST_EMOTION_TITLE_LINE2 = "随季节流转";
  const FREQ_WORD1 = "高频词1";
  const FREQ_WORD2 = "高频词2";
  const FREQ_WORD3 = "高频词3";

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container}>
        {/* Spring Tree */}
        <div className={`${styles.springWrapper} page16-reveal-spring`}>
          <Image src="/imgs/page16/springTree.png" alt="springTree" fill style={{objectFit: "contain"}} />
        </div>

        {/* Summer Tree */}
        <div className={`${styles.summerTree} page16-reveal-summer`}>
          <Image src="/imgs/page16/summerTree.png" alt="summer" fill style={{objectFit: "contain"}} />
        </div>

        {/* Autumn Tree */}
        <div className={`${styles.autumnTree} page16-reveal-autumn`}>
          <Image src="/imgs/page16/autumnTree.png" alt="autumn" fill style={{objectFit: "contain"}} />
        </div>

        {/* Rabbit Pair (Sitting + Standing) - Using Rabbits.png based on plural name */}
        <div className={`${styles.rabbitPair} page16-reveal-rabbit-pair`}>
          <Image src="/imgs/page16/rabbits.png" alt="rabbits" fill style={{objectFit: "contain"}} />
        </div>

        {/* Winter Tree */}
        <div className={`${styles.winterTree} page16-reveal-winter`}>
          <Image src="/imgs/page16/winterTree.png" alt="winter" fill style={{objectFit: "contain"}} />
        </div>

        {/* Bottom Rabbit (Single) - Using Rabbit.png based on singular name */}
        <div className={`${styles.rabbitSingle} page16-reveal-rabbit-single`}>
          <Image src="/imgs/page16/rabbit.png" alt="rabbit" fill style={{objectFit: "contain"}} />
        </div>

        {/* Top Text */}
        <div className={`${styles.topText} page16-reveal-title`}>
          <div className={styles.topTextLine1}>{POST_EMOTION_TITLE_LINE1}</div>
          <div className={styles.topTextLine2}>{POST_EMOTION_TITLE_LINE2}</div>
        </div>

        {/* Bottom Text */}
        <div className={`${styles.bottomText} page16-reveal-bottom-text`}>
          <div className={styles.bottomTextTitle}>这一年</div>
          <div className={styles.bottomTextTitle}>你最常提起的词是</div>
          <div className={styles.keyword}>[{FREQ_WORD1}]</div>
          <div className={styles.keyword}>[{FREQ_WORD2}]</div>
          <div className={styles.keyword}>[{FREQ_WORD3}]</div>
        </div>

        {showHint && (
          <div className={styles.hintWrap}>
            <ScrollUpHint />
          </div>
        )}
        
        {/* Footer handled globally or manually if needed, checking design */}
        <div style={{ position: 'absolute', bottom: '2%', right: '50%', transform: 'translateX(50%)', opacity: 0.6, pointerEvents: 'none' }}>
           {/* Global footer is typically enough, but design shows specific placement. 
               The global footer might be overlaying. 
               Let's rely on global footer unless user asked specific. 
               User asked to check Footer.tsx. 
           */}
        </div>
      </div>
    </PageWrapper>
  );
}

