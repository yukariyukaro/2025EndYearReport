"use client";
import { useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import { useSummary } from "@/contexts/SummaryContext";
import ScrollUpHint from "@/components/ScrollUpHint";
import styles from "./styles/page15.module.css";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";

export default function Page15() {
  const PAGE_NUMBER = 15;
  const { appendNextPage } = usePageManager();
  const { data: summaryData } = useSummary();
  const pageData = summaryData?.pages?.page11;

  // Data binding
  const viewCount = pageData?.most_viewed?.view_count ?? 0;
  const commentCount = pageData?.most_commented?.comment_count ?? 0;
  const collectCount = pageData?.most_collected?.collect_count ?? 0;
  // Backend page11 missing interactive_users, use 0 or fallback
  const interactiveCount = 0; 

  const [showHint, setShowHint] = useState(true);
  const { reveal, clearTimers, addTimer } = useRevealAnimation(PAGE_NUMBER);

  const onShow = () => {
    clearTimers();
    setShowHint(false);
    
    let t = 100;
    const step = 150;

    reveal(`.page15-reveal-1`, t);  // Light Bulb
    reveal(`.page15-reveal-2-1`, t += step);
    reveal(`.page15-reveal-2-2`, t += step);
    reveal(`.page15-reveal-2-3`, t += step);
    reveal(`.page15-reveal-2-4`, t += step);
    reveal(`.page15-reveal-2-5`, t += step);
    
    reveal(`.page15-reveal-3`, t += 200); // Main Image (Bro)
    
    t += 200;
    reveal(`.page15-reveal-4-1`, t += step);
    reveal(`.page15-reveal-4-2`, t += step);
    reveal(`.page15-reveal-5`, t += step); // Plus Icon
    
    const hintTimer = setTimeout(() => setShowHint(true), t + 800);
    addTimer(hintTimer);
  };
  
  const goNext = () => appendNextPage && appendNextPage(PAGE_NUMBER, true);

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container}>
        
        {/* Top Section */}
        <div className={styles.topSection}>
          <div className={`${styles.bulbWrapper} ${styles.popIn} page15-reveal-1`}>
            <Image
              src="imgs/page15/light-bulb.png"
              alt="Light Bulb"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className={styles.topText}>
            <div className={`hide page15-reveal-2-1`}>这条内容收获了</div>
            <div className={`hide page15-reveal-2-2`}><span className={styles.highlight}>{viewCount}</span> 次阅读</div>
            <div className={`hide page15-reveal-2-3`}><span className={styles.highlight}>{commentCount}</span> 条评论</div>
            <div className={`hide page15-reveal-2-4`}><span className={styles.highlight}>{collectCount}</span> 次收藏</div>
            <div className={`hide page15-reveal-2-5`}>是今年最受欢迎的一条</div>
          </div>
        </div>

        {/* Main Illustration */}
        <div className={`${styles.mainImageWrapper} hide page15-reveal-3`}>
          <div className={styles.float}>
             <Image
               src="imgs/page15/bro.png"
               alt="Illustration"
               width={300}
               height={300}
               className={styles.broImage}
               style={{ width: "100%", height: "auto", maxHeight: "40vh" }}
             />
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          <div className={styles.bottomText}>
            <div className={`hide page15-reveal-4-1`}>这些内容也深深触动了</div>
            <div className={`hide page15-reveal-4-2`}><span className={styles.highlight}>{interactiveCount}</span> 位伙伴的心</div>
          </div>
          <div className={`${styles.plusIcon} ${styles.popIn} page15-reveal-5`}>
            <Image
              src="imgs/page15/plus.svg"
              alt="Plus"
              fill
            />
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
