"use client";
import usePageManager from "@/hooks/usePageManager";

export default function Footer() {
  const { currentPage } = usePageManager();
  
  // Page 4 needs white text, others default blue
  const isWhite = currentPage === 4;
  const color = isWhite ? "#FFFFFF" : "#93B9CE";

  return (
    <div className="footer-wrapper">
      <p
        style={{
          fontStyle: "normal",
          fontSize: "1.5rem",
          lineHeight: "29px",
          color: color,
          margin: 0,
          transition: "color 0.3s ease", // Smooth transition
          fontFamily: "var(--ff-primary)",
        }}
      >
        @TripleUni 2025
      </p>
    </div>
  );
}
