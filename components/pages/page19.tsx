"use client";
import { useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import { useSummary } from "@/contexts/SummaryContext";
import styles from "./styles/page19.module.css";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";

export default function Page19() {
  const PAGE_NUMBER = 19;
  const { appendNextPage } = usePageManager();
  const { data: summaryData } = useSummary();
  const [showHint, setShowHint] = useState(false);
  const { reveal, clearTimers, addTimer } = useRevealAnimation(PAGE_NUMBER);

  function onShow() {
    clearTimers();
    setShowHint(false);

    let t = 100;
    const step = 200; // Faster step

    reveal('.page19-visual', t);
    reveal('.page19-reveal-2', t += step);
    reveal('.page19-reveal-3', t += step);
    reveal('.page19-reveal-4', t += step);
    reveal('.page19-reveal-5', t += step);
    reveal('.page19-reveal-6', t += step);

    const hintTimer = setTimeout(() => setShowHint(true), t + 800);
    addTimer(hintTimer);
  }

  const goNext = () => appendNextPage && appendNextPage(PAGE_NUMBER, true);

  const pageData = summaryData?.pages?.page14;
  const privateMsgCount = pageData?.total_messages ?? 0;
  const interactCount = pageData?.interactive_users ?? 0;
  const topChatNickname = pageData?.most_frequent_contact?.name ?? "匿名朋友";

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container} style={{ backgroundImage: 'url("imgs/page19/background.png")' }}>
        <div className={styles.topArea}>
            <div className={`hide page19-reveal-2 ${styles.textRow}`}>
              <div className={styles.mainTitle}>今年你发出了 <span className={styles.highlight}>[{privateMsgCount}]</span> 条私信</div>
            </div>
            <div className={`hide page19-reveal-3 ${styles.textRow}`}>
              <div className={styles.subTitle}>与 <span className={styles.highlight}>[{interactCount}]</span> 位伙伴悄悄交流</div>
            </div>
            <div className={`hide page19-reveal-4 ${styles.textRow}`}>
              <div className={styles.frequently}>与你聊天最频繁的是：<span className={styles.highlight}>[{topChatNickname}]</span></div>
            </div>
        </div>

        <div className={styles.visualArea}>
           <div className={`hide page19-visual ${styles.communityImg}`}>
             <Image 
                src="imgs/page19/community.png" 
                alt="community" 
                width={380} 
                height={260} 
                style={{ width: '100%', height: 'auto', maxWidth: '380px' }}
             />
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
