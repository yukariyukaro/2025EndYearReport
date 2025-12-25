"use client";
import React, { useState } from 'react';
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import styles from '../styles/page6.module.css';

export default function Night() {
  const PAGE_NUMBER = 6;
  const { appendNextPage } = usePageManager();
  const [showHint, setShowHint] = useState(false);
  
  function onShow() {
    setShowHint(false);
    setTimeout(() => setShowHint(true), 1000);
  }

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container} style={{ background: 'linear-gradient(180deg, #191970 0%, #000080 100%)' }}>
        <div className={styles.headerText} style={{ opacity: 1 }}>
          <div>/深夜的沉思</div>
          <div>是你与自我的对话</div>
        </div>
        <div style={{ marginTop: '4rem', color: 'white', textAlign: 'center' }}>
          (Night Mode Placeholder)
        </div>
        <button onClick={() => appendNextPage(PAGE_NUMBER, true)} className={styles.nextButton} style={{ display: 'block' }}>
          Show Next Page
        </button>
      </div>
      {showHint && <div className="fade-in"><ScrollUpHint /></div>}
    </PageWrapper>
  );
}
