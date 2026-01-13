"use client";
import React, { useState, useMemo, useEffect } from 'react';
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
import styles from '../styles/page6Night.module.css';
import { useRevealAnimation } from '@/hooks/useRevealAnimation';

// Mock Data removed, using props

import { Page6VariantProps } from '../page6';

export default function Night({ chartData, peakHour, patternLabel }: Page6VariantProps) {
  const PAGE_NUMBER = 6;
  const { appendNextPage } = usePageManager();
  
  const [showHint, setShowHint] = useState(false);
  const [playChart, setPlayChart] = useState(false);
  const { reveal, clearTimers, addTimer } = useRevealAnimation(PAGE_NUMBER);

  function onShow() {
    clearTimers();
    setShowHint(false);
    setPlayChart(false);

    let t = 100;
    const stepSlow = 300;

    // Header
    reveal(".page6-night-reveal-1", t); 

    // Trigger chart drawing animation
    const chartTimer = setTimeout(() => setPlayChart(true), t + 100);
    addTimer(chartTimer);

    // Legend
    reveal(".page6-night-reveal-3", (t += stepSlow));

    // Stats
    reveal(".page6-night-reveal-4", (t += stepSlow));
    reveal(".page6-night-reveal-5", (t += stepSlow));
    reveal(".page6-night-reveal-6", (t += stepSlow));

    // Bottom Quote
    reveal(".page6-night-reveal-7", (t += stepSlow));

    const hintTimer = setTimeout(() => setShowHint(true), (t += 600));
    addTimer(hintTimer);
  }

  const scrollToNext = () => {
    appendNextPage(PAGE_NUMBER, true);
  };

  // Generate stars - Moved to useEffect to prevent hydration mismatch
  const [stars, setStars] = useState({ small: "", medium: "", large: "" });

  useEffect(() => {
    setStars({
      small: generateStars(100),
      medium: generateStars(50),
      large: generateStars(20)
    });
  }, []);

  return (
    <PageWrapper 
      pageNumber={PAGE_NUMBER} 
      onShow={onShow}
      onAppendNext={() => setShowHint(false)}
    >
      <div className={styles.container}>
        {/* Stars Background */}
        <div className={styles.starsWrapper}>
            <div className={styles.starsSmall} style={{ boxShadow: stars.small }}></div>
            <div className={styles.starsMedium} style={{ boxShadow: stars.medium }}></div>
            <div className={styles.starsLarge} style={{ boxShadow: stars.large }}></div>
        </div>

        {/* Header */}
        <div className={`${styles.headerText} hide page6-night-reveal-1`}>
          GOOD NIGHT
        </div>
        
        {/* Stats Top */}
        <div className={styles.statsContainer}>
          <div className={`${styles.statText} ${styles.hide} page6-night-reveal-4`}>你的最活跃时段是 {peakHour}</div>
          <div className={`${styles.statText} ${styles.hide} page6-night-reveal-5`}>与全体用户相比</div>
          <div className={`${styles.statRow} ${styles.hide} page6-night-reveal-6`}>
            <span className={styles.statText}>你的作息是</span>
            <span className={styles.statHighlight}>夜猫子型</span>
          </div>
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
                <linearGradient id="colorUserNight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FACB98" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#FACB98" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAvgNight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DDC5F7" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#DDC5F7" stopOpacity={0}/>
                </linearGradient>
                <clipPath id="chartClipNight">
                  <rect 
                    x="0" y="0" width="100%" height="100%" 
                    className={`${styles.chartRevealRect} ${playChart ? styles.play : ''}`} 
                  />
                </clipPath>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff22" />
              <XAxis 
                dataKey="name" 
                tick={{fill: '#FFF7E4', fontSize: 12, opacity: 0.8}} 
                axisLine={false} 
                tickLine={false}
                interval={1}
              />
              <YAxis 
                tick={{fill: '#FFF7E4', fontSize: 12, opacity: 0.8}} 
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
                fill="url(#colorAvgNight)" 
                clipPath="url(#chartClipNight)"
                animationDuration={0}
              />
              <Area 
                type="monotone" 
                dataKey="user" 
                stroke="#FACB98" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorUserNight)" 
                clipPath="url(#chartClipNight)"
                animationDuration={0}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={`${styles.legend} hide page6-night-reveal-3`}>
            <div className={styles.legendItem}>
                <div className={styles.legendLine} style={{ background: '#FACB98' }}></div>
                <span className={styles.legendText}>你</span>
            </div>
            <div className={styles.legendItem}>
                <div className={styles.legendLine} style={{ background: '#DDC5F7' }}></div>
                <span className={styles.legendText}>大家</span>
            </div>
        </div>

        {/* Bottom Text / Quote */}
        <div className={`${styles.centerText} hide page6-night-reveal-7`}>
          嘘——夜晚的灵感正在为你开会。
        </div>
        
        {/* Reusing Morning's Mountain Assets */}
        <div className={styles.tree}>
          <Image
            src="imgs/page6/morning/Tree.png" 
            alt="Tree" 
            fill
            priority
          />
        </div>
        <div className={styles.m1}>
          <Image
            src="imgs/page6/morning/m1.svg" 
            alt="Mountain Layer 1" 
            fill
            priority
          />
        </div>
        <div className={styles.m2}>
          <Image
            src="imgs/page6/morning/m2.svg" 
            alt="Mountain Layer 2" 
            fill
            sizes="100vw"
            priority
          />
        </div>
        <div className={styles.m3}>
          <Image
            src="imgs/page6/morning/m3.svg" 
            alt="Mountain Layer 3" 
            fill
            sizes="100vw"
            priority
          />
        </div>
        <div className={styles.m4}>
          <Image
            src="imgs/page6/morning/m4.svg" 
            alt="Mountain Layer 4" 
            fill
            sizes="100vw"
            priority
          />
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
        
        <div className={styles.footerText}>@TripleUni 2025</div>

      </div>
      
      {showHint && (
        <div className="fade-in">
          <ScrollUpHint />
        </div>
      )}
    </PageWrapper>
  );
}

function generateStars(n: number) {
  let value = `${Math.random() * 100}vw ${Math.random() * 100}vh #FFF`;
  for (let i = 1; i < n; i++) {
    value += `, ${Math.random() * 100}vw ${Math.random() * 100}vh #FFF`;
  }
  return value;
}
