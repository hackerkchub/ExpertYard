import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./HorizontalScroller.css";

export default function HorizontalScroller({ children, className = "" }) {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkScrollability = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    checkScrollability();
    el.addEventListener("scroll", checkScrollability, { passive: true });
    window.addEventListener("resize", checkScrollability);

    return () => {
      el.removeEventListener("scroll", checkScrollability);
      window.removeEventListener("resize", checkScrollability);
    };
  }, [checkScrollability, children]);

  const scrollByAmount = (direction) => {
    const el = containerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75 * (direction === "left" ? -1 : 1);
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  // Mouse wheel horizontal scroll support
  const handleWheel = (e) => {
    const el = containerRef.current;
    if (!el) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // native horizontal scroll
    if (e.shiftKey || Math.abs(e.deltaY) > 0) {
      if (el.scrollWidth > el.clientWidth) {
        el.scrollLeft += e.deltaY;
      }
    }
  };

  // Mouse Drag-to-Scroll support
  const handleMouseDown = (e) => {
    const el = containerRef.current;
    if (!el) return;
    setIsMouseDown(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const el = containerRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeftState - walk;
  };

  return (
    <div className={`horizontal-scroller-wrapper ${className}`}>
      {canScrollLeft && (
        <button
          type="button"
          className="scroller-arrow arrow-left"
          onClick={() => scrollByAmount("left")}
          aria-label="Scroll Left"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      <div
        ref={containerRef}
        className={`horizontal-scroller-track ${isMouseDown ? "is-dragging" : ""}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
      >
        {children}
      </div>

      {canScrollRight && (
        <button
          type="button"
          className="scroller-arrow arrow-right"
          onClick={() => scrollByAmount("right")}
          aria-label="Scroll Right"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
