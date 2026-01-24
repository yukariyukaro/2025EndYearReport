"use client";
import React, { useMemo } from 'react';
import { useSummary } from "@/contexts/SummaryContext";
import Morning from './page6_variants/Morning';
import Day from './page6_variants/Day';
import Night from './page6_variants/Night';
import Healthy from './page6_variants/Healthy';
import Average from './page6_variants/Average';

type UserType = 'morning' | 'day' | 'night' | 'healthy' | 'average';

export interface Page6VariantProps {
  chartData: Array<{ name: string; user: number; avg: number }>;
  peakHour: string;
  patternLabel: string;
  maxY: number;
}

export default function Page6() {
  const { data } = useSummary();
  const page4Data = data?.pages?.page4;

  const { userType, chartData, peakHour, patternLabel, maxY } = useMemo(() => {
    const label = page4Data?.time_pattern_label || "混合型";
    let type: UserType = 'day';

    if (label.includes("早起")) type = 'morning';
    else if (label.includes("日理万机")) type = 'day';
    else if (label.includes("夜猫")) type = 'night';
    else if (label.includes("养生")) type = 'healthy';
    else if (label.includes("平均")) type = 'average';
    
    // Transform chart data
    const userActivity = page4Data?.user_hourly_activity || [];
    const globalActivity = page4Data?.global_hourly_activity || [];
    
    const transformedData = Array.from({ length: 24 }, (_, i) => ({
      name: i.toString(),
      user: (userActivity[i] || 0) * 100,
      avg: (globalActivity[i] || 0) * 100
    }));

    // Calculate peak hour
    let maxIdx = 0;
    let maxVal = -1;
    userActivity.forEach((val: number, idx: number) => {
      if (val > maxVal) {
        maxVal = val;
        maxIdx = idx;
      }
    });
    const peak = `${maxIdx}:00`;

    // Calculate Y-axis max (highest value + 5)
    let globalMax = 0;
    transformedData.forEach(d => {
      globalMax = Math.max(globalMax, d.user, d.avg);
    });
    const maxY = Math.ceil(globalMax) + 5;

    return {
      userType: type,
      chartData: transformedData,
      peakHour: peak,
      patternLabel: label,
      maxY
    };
  }, [page4Data]);

  const props: Page6VariantProps = {
    chartData,
    peakHour,
    patternLabel,
    maxY
  };

  switch (userType) {
    case 'morning':
      return <Morning {...props} />;
    case 'day':
      return <Day {...props} />;
    case 'night':
      return <Night {...props} />;
    case 'healthy':
      return <Healthy {...props} />;
    case 'average':
      return <Average {...props} />;
    default:
      return <Average {...props} />;
  }
}
