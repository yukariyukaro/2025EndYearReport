"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import { Page6VariantProps } from '../page6';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import styles from '../styles/page6Healthy.module.css';
import { useRevealAnimation } from '@/hooks/useRevealAnimation';

export default function Healthy({ chartData, peakHour, patternLabel }: Page6VariantProps) {
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

    // Trigger chart drawing animation
    const chartTimer = setTimeout(() => setPlayChart(true), t + 100);
    addTimer(chartTimer);

    // Legend
    reveal(".page6-reveal-3", (t += stepSlow));

    // Stats
    reveal(".page6-reveal-4", (t += stepSlow));
    reveal(".page6-reveal-5", (t += stepSlow));
    reveal(".page6-reveal-6", (t += stepSlow));

    // Window Text Lines (Reveal one by one)
    reveal(".page6-reveal-7-1", (t += 200));
    reveal(".page6-reveal-7-2", (t += 200));
    reveal(".page6-reveal-7-3", (t += 200));

    const hintTimer = setTimeout(() => setShowHint(true), (t += 600));
    addTimer(hintTimer);
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
        
        {/* Chart */}
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
                <linearGradient id="colorUserHealthy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5b6ee1" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#5b6ee1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAvgHealthy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e85c5c" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#e85c5c" stopOpacity={0}/>
                </linearGradient>
                <clipPath id="chartClipHealthy">
                  <rect 
                    x="0" y="0" width="100%" height="100%" 
                    className={`${styles.chartRevealRect} ${playChart ? styles.play : ''}`} 
                  />
                </clipPath>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff22" />
              <XAxis 
                dataKey="name" 
                tick={{fill: '#842e00', fontSize: 12, opacity: 0.6}} 
                axisLine={false} 
                tickLine={false}
                interval={1}
              />
              <YAxis 
                tick={{fill: '#842e00', fontSize: 12, opacity: 0.6}} 
                axisLine={false} 
                tickLine={false} 
                domain={[0, (dataMax: number) => Math.max(dataMax, 25)]}
                ticks={[0, 5, 10, 15, 20, 25]}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '8px', color: '#000' }}
                itemStyle={{ color: '#000' }}
              />
              <Area 
                type="monotone" 
                dataKey="avg" 
                stroke="#e85c5c" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorAvgHealthy)" 
                clipPath="url(#chartClipHealthy)"
                animationDuration={0}
              />
              <Area 
                type="monotone" 
                dataKey="user" 
                stroke="#5b6ee1" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorUserHealthy)" 
                clipPath="url(#chartClipHealthy)"
                animationDuration={0}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className={`${styles.legend} hide page6-reveal-3`}>
            <div className={styles.legendItem}>
                <div className={styles.legendLine} style={{ background: '#5b6ee1' }}></div>
                <span className={styles.legendText}>你</span>
            </div>
            <div className={styles.legendItem}>
                <div className={styles.legendLine} style={{ background: '#e85c5c' }}></div>
                <span className={styles.legendText}>大家</span>
            </div>
        </div>

        {/* Stats */}
        <div className={styles.statsContainer}>
          <div className={`${styles.statText} hide page6-reveal-4`}>你的最活跃时段是 {peakHour}</div>
          <div className={`${styles.statText} hide page6-reveal-5`}>与全体用户相比</div>
          <div className={`${styles.statRow} hide page6-reveal-6`}>
            <span className={styles.statText}>你的作息是</span>
            <span className={styles.statHighlight}>养生型</span>
          </div>
        </div>

        {/* Window Container */}
        <div className={styles.windowContainer}>
          <div className={styles.windowBg}>
            <Image 
              src="imgs/page6/healthy/Background.png" 
              alt="Window Background" 
              fill 
              priority 
            />
          </div>
          <div className={styles.windowContent}>
            <div className={styles.windowText}>
              <div className={`${styles.windowLine} hide page6-reveal-7-1`}>睡前不刷爆树洞，</div>
              <div className={`${styles.windowLine} hide page6-reveal-7-2`}>而是温柔道晚安，</div>
              <div className={`${styles.windowLine} hide page6-reveal-7-3`}>养生之道你已拿捏👌🏻</div>
            </div>
          </div>
          <div className={styles.cat}>
            <Image 
              src="imgs/page6/healthy/cat.svg" 
              alt="Cat" 
              fill 
              priority 
            />
          </div>
        </div>

        {/* Tree */}
        <div className={styles.tree}>
          <Image
            src="imgs/page6/healthy/Tree.png" 
            alt="Tree" 
            fill
            priority
          />
        </div>

        <button 
          onClick={scrollToNext}
          className={styles.nextButton}
        >
          Show Next Page
        </button>
      </div>
      
      {showHint && (
        <div className="fade-in">
          <ScrollUpHint />
        </div>
      )}
    </PageWrapper>
  );
}
