"use client";

import { useReportWebVitals } from "next/web-vitals";

type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0];

const sendToAnalytics: ReportWebVitalsCallback = ({ name, value, rating }) => {
  // rating is 'good' | 'needs-improvement' | 'poor'
  console.log(`${name}: ${value} (${rating})`);
};

export function WebVitals() {
  useReportWebVitals(sendToAnalytics);
  return null;
}
