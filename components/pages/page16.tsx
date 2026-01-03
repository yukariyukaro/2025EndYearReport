"use client";
import { useCallback, useRef, useEffect, useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import { useSummary } from "@/contexts/SummaryContext";
import ScrollUpHint from "@/components/ScrollUpHint";
import styles from "./styles/page16.module.css";

export default function Page16() {
  const PAGE_NUMBER = 16;
  const { currentPage } = usePageManager();
  const { data: summaryData } = useSummary();
  const pageData = summaryData?.pages?.page12;
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
        el.classList.remove("reveal-line");
      });
    }
  }, [currentPage, PAGE_NUMBER, clearTimers]);

  const revealVisible = useCallback((selector: string, delayMs: number) => {
    const timer = setTimeout(() => {
      document.querySelectorAll(selector).forEach((el) => {
        el.classList.add(styles.visible);
      });
    }, delayMs);
    timersRef.current.push(timer);
  }, []);

  const revealLine = useCallback((selector: string, delayMs: number) => {
    const timer = setTimeout(() => {
      document.querySelectorAll(selector).forEach((el) => {
        el.classList.add("reveal-line");
      });
    }, delayMs);
    timersRef.current.push(timer);
  }, []);

  function onShow() {
    clearTimers();
    setShowHint(false);

    revealVisible(`.page16-reveal-spring-trunk`, 100);
    revealVisible(`.page16-reveal-spring-leaves`, 300);

    revealLine(`.page16-reveal-top-1`, 200);
    revealLine(`.page16-reveal-top-2`, 450);

    revealVisible(`.page16-reveal-summer`, 450);
    revealVisible(`.page16-reveal-autumn`, 700);
    revealVisible(`.page16-reveal-rabbit-pair`, 950);
    revealVisible(`.page16-reveal-winter`, 1200);
    revealVisible(`.page16-reveal-rabbit-single`, 1450);

    revealLine(`.page16-reveal-bottom-1`, 1450);
    revealLine(`.page16-reveal-bottom-2`, 1650);
    revealLine(`.page16-reveal-bottom-3`, 1850);
    revealLine(`.page16-reveal-bottom-4`, 2050);
    revealLine(`.page16-reveal-bottom-5`, 2250);

    const hintTimer = setTimeout(() => setShowHint(true), 3700);
    timersRef.current.push(hintTimer);
  }

  const goNext = () => appendNextPage && appendNextPage(PAGE_NUMBER, true);

  // Text variables extracted
  const POST_EMOTION_TITLE_LINE1 = "你的发帖情绪";
  const POST_EMOTION_TITLE_LINE2 = "随季节流转";
  
  const keywords = pageData?.top_keywords ?? [];
  const FREQ_WORD1 = keywords[0]?.word ?? "生活";
  const FREQ_WORD2 = keywords[1]?.word ?? "探索";
  const FREQ_WORD3 = keywords[2]?.word ?? "成长";

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow}>
      <div className={styles.container}>
        <div className={`${styles.springTrunk} page16-reveal-spring-trunk`}>
          <Image src="imgs/page16/springTree.png" alt="springTree" fill style={{ objectFit: "contain" }} />
        </div>
        <div className={`${styles.springLeaves} page16-reveal-spring-leaves`}>
          <Image src="imgs/page16/springLeaves.png" alt="springLeaves" fill style={{ objectFit: "contain" }} />
        </div>

        <div className={`${styles.summerTree} page16-reveal-summer`}>
          <Image src="imgs/page16/summerTree.png" alt="summer" fill style={{ objectFit: "contain" }} />
        </div>

        <div className={`${styles.autumnTree} page16-reveal-autumn`}>
          <Image src="imgs/page16/autumnTree.png" alt="autumn" fill style={{ objectFit: "contain" }} />
        </div>

        <div className={`${styles.rabbitPair} page16-reveal-rabbit-pair`}>
          <Image src="imgs/page16/Rabbits.png" alt="rabbits" fill style={{ objectFit: "contain" }} />
        </div>

        <div className={`${styles.winterTree} page16-reveal-winter`}>
          <Image src="imgs/page16/winterTree.png" alt="winter" fill style={{ objectFit: "contain" }} />
        </div>

        <div className={`${styles.rabbitSingle} page16-reveal-rabbit-single`}>
          <Image src="imgs/page16/Rabbit.png" alt="rabbit" fill style={{ objectFit: "contain" }} />
        </div>

        <div className={styles.topText}>
          <div className={`${styles.topTextLine} page16-reveal-top-1`}>{POST_EMOTION_TITLE_LINE1}</div>
          <div className={`${styles.topTextLine} page16-reveal-top-2`}>{POST_EMOTION_TITLE_LINE2}</div>
        </div>

        <div className={styles.bottomText}>
          <div className={`${styles.bottomTextLine} page16-reveal-bottom-1`}>这一年</div>
          <div className={`${styles.bottomTextLine} page16-reveal-bottom-2`}>你最常提起的词是</div>
          <div className={`${styles.keyword} page16-reveal-bottom-3`}>[{FREQ_WORD1}]</div>
          <div className={`${styles.keyword} page16-reveal-bottom-4`}>[{FREQ_WORD2}]</div>
          <div className={`${styles.keyword} page16-reveal-bottom-5`}>[{FREQ_WORD3}]</div>
        </div>

        {showHint && (
          <div className="fade-in">
            <ScrollUpHint />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

