"use client";
import { useCallback, useRef, useEffect, useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import styles from "./styles/page16.module.css";

export default function Page16() {
  const PAGE_NUMBER = 16;
  const { appendNextPage } = usePageManager();
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const [showHint, setShowHint] = useState(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  function revealScale(selector: string, delayMs: number, durationMs = 800) {
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      el.classList.remove("reveal-scale");
      el.classList.add("scale-hide");
      void el.offsetWidth;
    });

    const t = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.classList.remove("scale-hide");
        el.classList.add("reveal-scale");
        el.style.setProperty("--reveal-duration", `${durationMs}ms`);
      });
    }, delayMs);

    timersRef.current.push(t);
  }

  function reveal(selector: string, delayMs: number, durationMs = 1400) {
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      el.classList.remove("reveal-line");
      el.classList.add("hide");
      void el.offsetWidth;
    });

    const t = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.classList.remove("hide");
        el.classList.add("reveal-line");
        el.style.setProperty("--reveal-duration", `${durationMs}ms`);
      });
    }, delayMs);

    timersRef.current.push(t);
  }

  function onShow() {
    clearTimers();
    setShowHint(false);

    let t = 120;
    const step = 360;

    revealScale('.page16-spring', t, 700);
    revealScale('.page16-summer', (t += step), 700);
    revealScale('.page16-autumn, .page16-rabbit', (t += step), 700);
    revealScale('.page16-winter, .page16-rabbits', (t += step), 700);

    // reveal text lines using page17-style reveal
    reveal('.page16-title-reveal', 200);
    reveal('.page16-words-reveal', (t += 200));

    const hintTimer = setTimeout(() => setShowHint(true), (t += 900));
    timersRef.current.push(hintTimer);
  }

  const goNext = () => appendNextPage && appendNextPage(PAGE_NUMBER, true);

  // Text variables extracted
  const POST_EMOTION_TITLE_LINE1 = "你的发帖情绪";
  const POST_EMOTION_TITLE_LINE2 = "随季节流转";
  const FREQ_WORD1 = "高频词1";
  const FREQ_WORD2 = "高频词2";
  const FREQ_WORD3 = "高频词3";

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow}>
      <div className={styles.container}>
        <div className={styles.visualArea}>
          <div className={`scale-hide page16-spring ${styles.springWrap}`}>
            <div className={styles.springInner}>
              <Image src="/imgs/page16/springTree.png" alt="springTree" fill className={styles.springTreeImg} />
              <Image src="/imgs/page16/springLeaves.png" alt="springLeaves" fill className={styles.springLeavesImg} />
            </div>
          </div>


          <div className={`scale-hide page16-summer ${styles.summerWrap}`}>
            <Image src="/imgs/page16/summerTree.png" alt="summer" width={200} height={250} />
          </div>

          <div className={`scale-hide page16-rabbit ${styles.rabbitSummer}`}>
            <Image src="/imgs/page16/Rabbit.png" alt="rabbit" width={63} height={120} />
          </div>

          <div className={`scale-hide page16-autumn ${styles.autumnWrap}`}>
            <Image src="/imgs/page16/autumnTree.png" alt="autumn" width={210} height={250} />
          </div>

          <div className={`scale-hide page16-winter ${styles.winterWrap}`}>
            <Image src="/imgs/page16/winterTree.png" alt="winter" width={195} height={240} />
          </div>

          <div className={`scale-hide page16-rabbits ${styles.rabbitWinter}`}>
            <Image src="/imgs/page16/Rabbits.png" alt="rabbits" width={190} height={300} />
          </div>
        </div>

        <div className={styles.textArea}>
          <div className={`hide scale-hide page16-text page16-title-reveal ${styles.titleBlock}`}>
            <div className={styles.titleLine}>{POST_EMOTION_TITLE_LINE1}</div>
            <div className={styles.titleLine}>{POST_EMOTION_TITLE_LINE2}</div>
          </div>

          <div className={`hide scale-hide page16-text2 page16-words-reveal ${styles.wordsBlock}`}>
            <div className={styles.yearIntro}>这一年</div>
            <div className={styles.wordsIntro}>你最常提起的词是</div>
            <div className={styles.wordsList}>[{FREQ_WORD1}]</div>
            <div className={styles.wordsList}>[{FREQ_WORD2}]</div>
            <div className={styles.wordsList}>[{FREQ_WORD3}]</div>
          </div>
        </div>

        {showHint && (
          <div className={styles.hintWrap}>
            <ScrollUpHint />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

