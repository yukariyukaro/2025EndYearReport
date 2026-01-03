"use client";
import React, { useState } from 'react';
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
import styles from '../styles/page6Average.module.css';
import { useRevealAnimation } from '@/hooks/useRevealAnimation';

import { Page6VariantProps } from '../page6';

export default function Average({ chartData, peakHour, patternLabel }: Page6VariantProps) {
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

    // Stats
    reveal(".page6-avg-reveal-1", t); 
    reveal(".page6-avg-reveal-2", (t += stepSlow));
    
    // Legend
    reveal(".page6-avg-reveal-3", (t += stepSlow));

    // Trigger chart drawing animation
    const chartTimer = setTimeout(() => setPlayChart(true), t + 100);
    addTimer(chartTimer);

    // Bottom Stats
    reveal(".page6-avg-reveal-4", (t += stepSlow + 500));
    reveal(".page6-avg-reveal-5", (t += stepSlow));

    // Quote
    reveal(".page6-avg-reveal-6", (t += stepSlow));

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
        {/* Stats Top */}
        <div className={styles.statsContainer}>
          <div className={`${styles.statText} hide page6-avg-reveal-1`}>你的最活跃时段是 {peakHour}</div>
          <div className={`${styles.statText} hide page6-avg-reveal-2`}>与全体用户相比</div>
        </div>

        {/* Legend */}
        <div className={`${styles.legend} hide page6-avg-reveal-3`}>
            <div className={styles.legendItem}>
                <div className={styles.legendLine} style={{ background: '#7B61FF' }}></div>
                <span className={styles.legendText}>你</span>
            </div>
            <div className={styles.legendItem}>
                <div className={styles.legendLine} style={{ background: '#FF6161' }}></div>
                <span className={styles.legendText}>大家</span>
            </div>
        </div>

        {/* Chart */}
        <div 
          className={styles.chartContainer}
          style={{  height: '27.5%',width: '85%' }}
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
                <linearGradient id="colorUserAvg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7B61FF" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#7B61FF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAvgAvg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6161" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#FF6161" stopOpacity={0}/>
                </linearGradient>
                <clipPath id="chartClipAvg">
                  <rect 
                    x="0" y="0" width="100%" height="100%" 
                    className={`${styles.chartRevealRect} ${playChart ? styles.play : ''}`} 
                  />
                </clipPath>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000011" />
              <XAxis 
                dataKey="name" 
                tick={{fill: '#666', fontSize: 12}} 
                axisLine={false} 
                tickLine={false}
                interval={2}
              />
              <YAxis 
                tick={{fill: '#666', fontSize: 12}} 
                axisLine={false} 
                tickLine={false} 
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '8px', color: '#000' }}
                itemStyle={{ color: '#000' }}
              />
              {/* Note: In design, lines are strokes, areas are fill. Recharts Area can do both. */}
              <Area 
                type="monotone" 
                dataKey="avg" 
                stroke="#FF6161" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorAvgAvg)" 
                clipPath="url(#chartClipAvg)"
                animationDuration={0}
              />
              <Area 
                type="monotone" 
                dataKey="user" 
                stroke="#7B61FF" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorUserAvg)" 
                clipPath="url(#chartClipAvg)"
                animationDuration={0}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Stats */}
        <div className={`${styles.statRow} hide page6-avg-reveal-4`}>
          <span className={styles.statTextLarge}>你的作息是</span>
          <span className={styles.statHighlight}>【时间段落签】</span>
        </div>

        {/* Quote & Rabbit */}
        <div className={styles.bottomSection}>
             <div className={`${styles.quoteText} hide page6-avg-reveal-5`}>
                你的陪伴不分昼夜，{'\n'}是噗噗最忠实的伙伴。
            </div>
            
            <div className={`${styles.rabbitContainer} hide page6-avg-reveal-6`}>
                 {/* Using cat.svg as placeholder for rabbit since average folder is empty */}
                 <Image 
                   src="imgs/page6/average/rabbit.png" 
                    alt="Rabbit Illustration" 
                    fill
                    className={styles.rabbitImage}
                 />
            </div>
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
