"use client";
import { useCallback, useRef, useEffect, useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import styles from "./styles/page17.module.css";

export default function Page17() {
  const PAGE_NUMBER = 17;
  const { appendNextPage } = usePageManager();
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const [showHint, setShowHint] = useState(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

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


    reveal('.page17-reveal-2', (t += step));
    reveal('.page17-reveal-4', (t += step));
    reveal('.page17-reveal-3', (t += step));


    const hintTimer = setTimeout(() => setShowHint(true), (t += 900));
    timersRef.current.push(hintTimer);
  }

  const goNext = () => appendNextPage && appendNextPage(PAGE_NUMBER, true);

  // Text terminal variables (extracted)
  const FAVORITE_EMOJI = "Emoji";
  const EMOJI_USE_COUNT = "使用次数";
  const POSITIVE_PCT = "X";
  const NEUTRAL_PCT = "X";
  const HEALING_PCT = "X";

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container}>
        <div className={styles.topArea}>

          <div className={`hide page17-reveal-2 ${styles.headerRight}`}>
            <div className={styles.title}>今年你最爱的表情是： <span className={styles.emoji}>[{FAVORITE_EMOJI}]</span></div>
            <div className={styles.subtitle}>它陪你表达了 <span className={styles.highlight}>[{EMOJI_USE_COUNT}]</span> 次心情</div>
          </div>
        </div>

        <div className={`hide page17-reveal-4 ${styles.ILove}`}>I LOVE</div>

        <div className={styles.contentArea}>
          <div className={`hide page17-reveal-3 ${styles.statBlock}`}>
            <div className={styles.caption}>你的emoji情绪倾向：</div>
            <div className={styles.pcts}>[{POSITIVE_PCT}%] 正向 · [{NEUTRAL_PCT}%] 中性 · [{HEALING_PCT}%] 疗愈</div>
          </div>
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
