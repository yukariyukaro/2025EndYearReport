"use client";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";

// Minimal page template for copy-paste
// Usage: duplicate this file as pageX.tsx, update PAGE_NUMBER and content

export default function Page23() {
  const PAGE_NUMBER = 23; // replace with actual page number after copy
  const { appendNextPage } = usePageManager();

  const scrollToNext = () => {
    appendNextPage(PAGE_NUMBER, true);
  };

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={() => {}}>
      <div>
        <h1>Page {PAGE_NUMBER}</h1>
        <button onClick={scrollToNext}>Show Next Page</button>
      </div>
    </PageWrapper>
  );
}
