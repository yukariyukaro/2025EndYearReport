"use client";
import React from 'react';
import Morning from './page6_variants/Morning';
import Day from './page6_variants/Day';
import Night from './page6_variants/Night';
import Healthy from './page6_variants/Healthy';
import Average from './page6_variants/Average';

type UserType = 'morning' | 'day' | 'night' | 'healthy' | 'average';

export default function Page6() {
  // Mock backend response - change this to test different variants
  const userType: UserType = 'morning';

  switch (userType) {
    case 'morning':
      return <Morning />;
    case 'day':
      return <Day />;
    case 'night':
      return <Night />;
    case 'healthy':
      return <Healthy />;
    case 'average':
      return <Average />;
    default:
      return <Morning />;
  }
}
