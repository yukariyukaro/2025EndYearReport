"use client";
import React, { useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import { useSummary } from "@/contexts/SummaryContext";
import ScrollUpHint from "@/components/ScrollUpHint";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import styles from "./styles/page14.module.css";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Page14() {
  const PAGE_NUMBER = 14;
  const { appendNextPage } = usePageManager();
  const { data: summaryData } = useSummary();
  const pageData = summaryData?.pages?.page10;
  
  const postCount = pageData?.post_count_2025 ?? 0;
  const beatPercentage = pageData?.beat_percentage ?? 0;
  // If no 2024 data or explicitly marked, treat as first year. 
  // Backend doesn't have explicit 'is_first_year' flag, inferred from post_count_2024
  const isFirstYear = (pageData?.post_count_2024 ?? 0) === 0;
  const growthRate = pageData?.growth_rate ?? 0;
  const isGrowthNegative = growthRate < 0;
  const displayGrowthRate = Math.round(Math.abs(growthRate));

  // Generate chart data from backend monthly_stats
  const chartData = (pageData?.monthly_stats || []).map((value: number, index: number) => ({
    name: MONTH_NAMES[index] || '',
    value
  }));

  // Fallback if no data
  const finalChartData = chartData.length > 0 ? chartData : MONTH_NAMES.map(name => ({ name, value: 0 }));

  const [showHint, setShowHint] = useState(false);
  const { reveal, clearTimers, addTimer } = useRevealAnimation(PAGE_NUMBER);

  const onShow = () => {
    clearTimers();
    setShowHint(false);
    // Top Text
    reveal(`.page14-reveal-1-1`, 300);
    reveal(`.page14-reveal-1-2`, 500);
    reveal(`.page14-reveal-1-3`, 700);
    
    // Chart Card
    reveal(`.page14-reveal-2`, 800);
    
    // Bottom Text
    reveal(`.page14-reveal-3-1`, 1400);
    reveal(`.page14-reveal-3-2`, 1600);
    
    // Footer
    reveal(`.page14-reveal-4`, 2000);

    const hintTimer = setTimeout(() => setShowHint(true), 3000);
    addTimer(hintTimer);
  };

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container}>
        <div className={styles.background}>
          <Image
            src="imgs/page14/background.png"
            alt="Background"
            fill
            className={styles.backgroundImage}
            priority
          />
        </div>

        <div className={styles.content}>
          {/* Top Text */}
          <div className={styles.topText}>
            <div className={`hide page14-reveal-1-1`}>今年</div>
            <div className={`hide page14-reveal-1-2`}>
              你发布了 <span className={styles.highlight}>{postCount}</span> 条内容
            </div>
            <div className={`hide page14-reveal-1-3`}>
              打败了 <span className={styles.highlight}>{beatPercentage}%</span> 的用户
            </div>
          </div>

          {/* Chart Card */}
          <div className={`${styles.chartCard} hide page14-reveal-2`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>POSTS</span>
              <span className={styles.cardYear}>2025</span>
            </div>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={finalChartData}>
                  <CartesianGrid vertical={false} stroke="#e0e0e0" strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#999' }} 
                    interval={0}
                  />
                  <YAxis 
                    hide 
                    domain={[0, 4]} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                    cursor={{ stroke: '#ccc', strokeDasharray: '3 3' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#5C9BF6" 
                    strokeWidth={2} 
                    dot={false} 
                    activeDot={{ r: 4, fill: '#5C9BF6', stroke: '#fff', strokeWidth: 2 }}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Text */}
          <div className={styles.bottomText}>
            {isFirstYear ? (
              <>
                <div className={`hide page14-reveal-3-1`}>这是你的第一年</div>
                <div className={`hide page14-reveal-3-2`}>
                  你的精彩才刚刚开始！
                </div>
              </>
            ) : (
              <>
                <div className={`hide page14-reveal-3-1`}>与去年相比</div>
                <div className={`hide page14-reveal-3-2`}>
                  你的发帖量{isGrowthNegative ? "减少了" : "增加了"} <span className={styles.highlight}>{displayGrowthRate}%</span>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className={`${styles.footer} hide page14-reveal-4`}>
             <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 5L35 35H5L20 5Z" stroke="#F4C9AA" strokeWidth="3" fill="none" />
                <path d="M20 12L30 32H10L20 12Z" fill="#D9F0B6" fillOpacity="0.5" />
             </svg>
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
