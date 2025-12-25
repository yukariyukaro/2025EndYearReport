"use client";
import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import styles from '../styles/page6.module.css';

export default function Day() {
  const PAGE_NUMBER = 6;
  const { appendNextPage } = usePageManager();
  const [showHint, setShowHint] = useState(false);
  
  function onShow() {
    setShowHint(false);
    // 简化的动画逻辑
    setTimeout(() => setShowHint(true), 1000);
  }

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container} style={{ background: 'linear-gradient(180deg, #4A90E2 0%, #87CEFA 100%)' }}>
        <div className={styles.headerText} style={{ opacity: 1 }}>
          <div>/白昼的喧嚣</div>
          <div>是你与世界的碰撞</div>
        </div>
        <div style={{ marginTop: '4rem', color: 'white', textAlign: 'center' }}>
          (Day Mode Placeholder)
        </div>
        <button onClick={() => appendNextPage(PAGE_NUMBER, true)} className={styles.nextButton} style={{ display: 'block' }}>
          Show Next Page
        </button>
      </div>
      {showHint && <div className="fade-in"><ScrollUpHint /></div>}
    </PageWrapper>
  );
}
