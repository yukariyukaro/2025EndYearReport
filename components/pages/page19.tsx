"use client";
import { useCallback, useRef, useEffect, useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import styles from "./styles/page19.module.css";

export default function Page19() {
  const PAGE_NUMBER = 19;
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
    const step = 450;

    reveal('.page19-visual', t);
    reveal('.page19-reveal-2', (t += step));
    reveal('.page19-reveal-3', (t += step*2));
    reveal('.page19-reveal-4', (t += step*3));
    reveal('.page19-reveal-5', (t += step*3));
    reveal('.page19-reveal-6', (t += step*3));

    const hintTimer = setTimeout(() => setShowHint(true), (t += 900));
    timersRef.current.push(hintTimer);
  }

  const goNext = () => appendNextPage && appendNextPage(PAGE_NUMBER, true);

  const privateMsgCount = "私信总数";
  const interactCount = "互动人数";
  const topChatNickname = "匿名昵称";

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container}>
        <div className={styles.topArea}>
          <div className={`hide page19-visual ${styles.headerLeft}`}>
            <Image src="/imgs/page19/community.png" alt="community" width={380} height={260} />
          </div>

          <div className={`hide page19-reveal-2 ${styles.headerRight}`}>
            <div className={styles.mainTitle}>今年你发出了 <span className={styles.highlight}>[{privateMsgCount}]</span> 条私信</div>
          <div/>
          <div className={`hide page19-reveal-3 ${styles.headerRight}`}>
            <div className={styles.subTitle}>与 <span className={styles.highlight}>[{interactCount}]</span> 位伙伴悄悄交流</div>
          </div>
          <div className={`hide page19-reveal-4 ${styles.headerRight}`}>
            <div className={styles.frequently}>与你聊天最频繁的是：<span className={styles.highlight}>[{topChatNickname}]</span></div>
          </div>
        </div>
      </div>

        <div className={styles.contentArea}>
          <div className={`hide page19-reveal-5 ${styles.quoteLeft}`}>这些对话像星光</div>
          <div className={`hide page19-reveal-6 ${styles.quoteRight}`}>照亮了彼此的夜晚</div>
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
