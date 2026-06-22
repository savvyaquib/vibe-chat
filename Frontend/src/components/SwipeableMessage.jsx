import { useRef, useState } from "react";
import { CornerUpLeft } from "lucide-react";

const SwipeableMessage = ({ children, onSwipeRight, id }) => {
  const containerRef = useRef(null);
  const swipeIndicatorRef = useRef(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);
  const [swipedEnough, setSwipedEnough] = useState(false);

  const threshold = 60;
  const maxSwipe = 85;

  const handleStart = (clientX) => {
    startX.current = clientX;
    isDragging.current = true;
    if (containerRef.current) {
      containerRef.current.style.transition = "none";
    }
    if (swipeIndicatorRef.current) {
      swipeIndicatorRef.current.style.transition = "none";
    }
  };

  const handleMove = (clientX) => {
    if (!isDragging.current) return;
    const diff = clientX - startX.current;

    // Only allow swiping right (positive X direction)
    if (diff < 0) {
      currentX.current = 0;
    } else {
      // Apply rubber-band effect beyond maxSwipe
      if (diff > maxSwipe) {
        currentX.current = maxSwipe + (diff - maxSwipe) * 0.2;
      } else {
        currentX.current = diff;
      }
    }

    if (containerRef.current) {
      containerRef.current.style.transform = `translateX(${currentX.current}px)`;
    }

    if (swipeIndicatorRef.current) {
      const progress = Math.min(currentX.current / threshold, 1);
      swipeIndicatorRef.current.style.opacity = progress.toString();
      // Scale from 0.5 to 1.1 based on pull distance
      swipeIndicatorRef.current.style.transform = `scale(${0.5 + progress * 0.6}) translateY(-50%)`;
      
      if (currentX.current >= threshold) {
        if (!swipedEnough) setSwipedEnough(true);
      } else {
        if (swipedEnough) setSwipedEnough(false);
      }
    }
  };

  const handleEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const triggered = currentX.current >= threshold;

    if (containerRef.current) {
      // Snapping transition
      containerRef.current.style.transition = "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      containerRef.current.style.transform = "translateX(0px)";
    }

    if (swipeIndicatorRef.current) {
      swipeIndicatorRef.current.style.transition = "all 0.3s ease";
      swipeIndicatorRef.current.style.opacity = "0";
      swipeIndicatorRef.current.style.transform = "scale(0.5) translateY(-50%)";
    }

    if (triggered) {
      // Trigger reply callback
      onSwipeRight();
    }

    currentX.current = 0;
    setSwipedEnough(false);

    // Reset transition styles after animation completes
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.transition = "";
      }
      if (swipeIndicatorRef.current) {
        swipeIndicatorRef.current.style.transition = "";
      }
    }, 300);
  };

  // Touch event handlers
  const handleTouchStart = (e) => {
    // Only track single touches
    if (e.touches.length === 1) {
      handleStart(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging.current && e.touches.length === 1) {
      // If user swipes horizontally, prevent scroll
      const diffX = e.touches[0].clientX - startX.current;
      if (diffX > 5) {
        if (e.cancelable) e.preventDefault();
        handleMove(e.touches[0].clientX);
      }
    }
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Mouse event handlers
  const handleMouseDown = (e) => {
    // Left-click only
    if (e.button !== 0) return;
    handleStart(e.clientX);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      const diffX = e.clientX - startX.current;
      if (diffX > 5) {
        handleMove(e.clientX);
      }
    }
  };

  const handleMouseUp = () => {
    handleEnd();
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div id={id} className="relative w-full overflow-visible group select-none">
      {/* Absolute positioned Reply indicator background */}
      <div
        ref={swipeIndicatorRef}
        className={`absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center p-2 rounded-full transition-all pointer-events-none opacity-0 scale-50 z-0 ${
          swipedEnough 
            ? "bg-primary text-primary-content shadow-lg scale-110" 
            : "bg-base-300 text-base-content/75"
        }`}
        style={{ transformOrigin: "left center" }}
      >
        <CornerUpLeft className={`size-4 transition-transform duration-200 ${swipedEnough ? "scale-110 rotate-12" : ""}`} />
      </div>

      {/* Message wrapper that gets translated */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        className="w-full relative z-10 transition-transform duration-300 ease-out"
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeableMessage;
