"use client";
import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import styles from '../styles/page6Morning.module.css';

// Mock Data removed, using props

import { Page6VariantProps } from '../page6';

export default function Morning({ chartData, peakHour, patternLabel }: Page6VariantProps) {
  const PAGE_NUMBER = 6;
  const { appendNextPage } = usePageManager();
  
  const [showHint, setShowHint] = useState(false);
  const [playChart, setPlayChart] = useState(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // 清理 timers
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  // 复用动画逻辑
  function reveal(selector: string, delayMs: number, durationMs = 1000) {
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      el.classList.remove("reveal-line");
      el.classList.add(styles.hide); 
      void el.offsetWidth;
    });

    const timer = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.classList.remove(styles.hide);
        el.classList.add("reveal-line"); 
        el.style.setProperty("--reveal-duration", `${durationMs}ms`);
      });
    }, delayMs);
    timersRef.current.push(timer);
  }

  function onShow() {
    clearTimers();
    setShowHint(false);
    setPlayChart(false);

    let t = 100;
    const stepSlow = 300;

    // Header
    reveal(".page6-reveal-1", t); 

    // Trigger chart drawing animation immediately or shortly after header
    const chartTimer = setTimeout(() => setPlayChart(true), t + 100);
    timersRef.current.push(chartTimer);

    // Legend
    reveal(".page6-reveal-3", (t += stepSlow));

    // Stats
    reveal(".page6-reveal-4", (t += stepSlow));
    reveal(".page6-reveal-5", (t += stepSlow));
    reveal(".page6-reveal-6", (t += stepSlow));

    const hintTimer = setTimeout(() => setShowHint(true), (t += 600));
    timersRef.current.push(hintTimer);
  }

  const scrollToNext = () => {
    appendNextPage(PAGE_NUMBER, true);
  };

  return (
    <PageWrapper 
      pageNumber={PAGE_NUMBER} 
      onShow={onShow}
      onAppendNext={() => setShowHint(false)}
    >
      <div className={styles.container}>
        {/* Header */}
        <div className={`${styles.headerText} ${styles.hide} page6-reveal-1`}>
          <div>/清晨的宁静</div>
          <div>是你与噗噗的专属频道</div>
        </div>
        
        <div 
          className={styles.chartContainer}
          style={{ width: '65.8%', height: '11.56rem' }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FACB98" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#FACB98" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DDC5F7" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#DDC5F7" stopOpacity={0}/>
                </linearGradient>
                <clipPath id="chartClip">
                  <rect 
                    x="0" y="0" width="100%" height="100%" 
                    className={`${styles.chartRevealRect} ${playChart ? styles.play : ''}`} 
                  />
                </clipPath>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff22" />
              <XAxis 
                dataKey="name" 
                tick={{fill: '#ac7f5e', fontSize: 12}} 
                axisLine={false} 
                tickLine={false}
                interval={1}
              />
              <YAxis 
                tick={{fill: '#ac7f5e', fontSize: 12}} 
                axisLine={false} 
                tickLine={false} 
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '8px', color: '#000' }}
                itemStyle={{ color: '#000' }}
              />
              <Area 
                type="monotone" 
                dataKey="avg" 
                stroke="#DDC5F7" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorAvg)" 
                clipPath="url(#chartClip)"
                animationDuration={0}
              />
              <Area 
                type="monotone" 
                dataKey="user" 
                stroke="#FACB98" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorUser)" 
                clipPath="url(#chartClip)"
                animationDuration={0}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={`${styles.legend} ${styles.hide} page6-reveal-3`}>
            <div className={styles.legendItem}>
                <div className={styles.legendLine} style={{ background: '#FACB98' }}></div>
                <span className={styles.legendText}>你</span>
            </div>
            <div className={styles.legendItem}>
                <div className={styles.legendLine} style={{ background: '#DDC5F7' }}></div>
                <span className={styles.legendText}>大家</span>
            </div>
        </div>

        {/* Stats */}
        <div className={styles.statsContainer}>
          <div className={`${styles.statText} ${styles.hide} page6-reveal-4`}>你的最活跃时段是 {peakHour}</div>
          <div className={`${styles.statText} ${styles.hide} page6-reveal-5`}>与全体用户相比</div>
          <div className={`${styles.statRow} ${styles.hide} page6-reveal-6`}>
            <span className={styles.statText}>你的作息是</span>
            <span className={styles.statHighlight}>【时间段落签】</span>
          </div>
        </div>

        <button 
          onClick={scrollToNext}
          className={styles.nextButton}
        >
          Show Next Page
        </button>
        <div className={styles.tree}>
          <Image
            src="imgs/page6/morning/Tree.png" 
            alt="Tree" 
            fill
            priority
          />
        </div>
        {/* Mountain Layer 1 */}
        <div className={styles.m1}>
          <Image
            src="imgs/page6/morning/m1.svg" 
            alt="Mountain Layer 1" 
            fill
            sizes="100vw"
            priority
          />
        </div>
        {/* Mountain Layer 2 */}
        <div className={styles.m2}>
          <Image
            src="imgs/page6/morning/m2.svg" 
            alt="Mountain Layer 2" 
            fill
            sizes="100vw"
            priority
          />
          {/* Mountain Layer 3 */}
        </div>
        <div className={styles.m3}>
          <Image
            src="imgs/page6/morning/m3.svg" 
            alt="Mountain Layer 3" 
            fill
            sizes="100vw"
            priority
          />
          {/* Mountain Layer 4 */}
        </div>
        <div className={styles.m4}>
          <Image
            src="imgs/page6/morning/m4.svg" 
            alt="Mountain Layer 4" 
            fill
            sizes="100vw"
            priority
          />
          {/* Mountain Layer 5 */}
        </div>
        <div className={styles.m5}>
          <Image
            src="imgs/page6/morning/m5.svg" 
            alt="Mountain Layer 5" 
            fill
            sizes="100vw"
            priority
          />
        </div>
      </div>
      
      {showHint && (
        <div className="fade-in">
          <ScrollUpHint />
        </div>
      )}
    </PageWrapper>
  );
}
