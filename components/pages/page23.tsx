"use client";
import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import ScrollUpHint from "@/components/ScrollUpHint";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";

export default function Page23() {
  const PAGE_NUMBER = 23;
  const [showHint, setShowHint] = useState(false);
  const { reveal, clearTimers, addTimer } = useRevealAnimation(PAGE_NUMBER);

  const doReveal = (selector: string, delay: number, durationMs = 900) => {
    reveal(selector, delay, { activeClass: "visible", initialClass: "reveal", durationMs });
  };

  const handleShow = () => {
    clearTimers();
    setShowHint(false);
    let t = 0;
    const step = 200;
    doReveal(".page23-figure", (t += step));
    doReveal(".page23-year", (t += step));
    doReveal(".page23-title", (t += step));
    doReveal(".page23-accent-1", (t += step));
    doReveal(".page23-accent-2", (t += step));
    const hintTimer = setTimeout(() => setShowHint(true), t + 600);
    addTimer(hintTimer);
  };

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={handleShow} onAppendNext={() => setShowHint(false)}>
      <div className="page23-container" style={{ backgroundImage: 'url("imgs/page22/background.png")' }}>
        <div className="page23-content">
          <p className="page23-figure reveal fromBottom">感谢你观看</p>
          <div className="page23-title-group">
            <p className="page23-year reveal fromBottom">2025</p>
            <p className="page23-title reveal fromBottom">年度总结</p>
          </div>
          <p className="page23-accent page23-accent-1 reveal fromBottom">祝你新的一年万事如意, 身体健康</p>
          <p className="page23-accent page23-accent-2 reveal fromBottom">让我们明年再见!</p>
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
