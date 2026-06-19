import { useState, useEffect, useRef } from "react";

const ImageCropper = ({ imageSrc, onCrop, onCancel }) => {
  const [imgDimensions, setImgDimensions] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStartDist, setTouchStartDist] = useState(0);
  const [touchStartZoom, setTouchStartZoom] = useState(1);
  const [lastTap, setLastTap] = useState(0);

  const containerRef = useRef(null);

  const D = 240; // Diameter of crop circle
  const viewportWidth = 300;
  const viewportHeight = 300;
  const cropLeft = (viewportWidth - D) / 2;
  const cropTop = (viewportHeight - D) / 2;

  // Load image to get natural size
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setImgDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };
  }, [imageSrc]);

  const scaleMin = imgDimensions
    ? D / Math.min(imgDimensions.width, imgDimensions.height)
    : 1;

  const scale = zoom * scaleMin;

  const getOffsetBounds = (currentScale) => {
    if (!imgDimensions) return { maxX: 0, maxY: 0 };
    const maxX = Math.max(0, (imgDimensions.width * currentScale - D) / 2);
    const maxY = Math.max(0, (imgDimensions.height * currentScale - D) / 2);
    return { maxX, maxY };
  };

  const constrainOffset = (x, y, currentScale) => {
    const { maxX, maxY } = getOffsetBounds(currentScale);
    return {
      x: Math.min(Math.max(x, -maxX), maxX),
      y: Math.min(Math.max(y, -maxY), maxY),
    };
  };

  // Constrain offset whenever zoom or dimensions change
  useEffect(() => {
    if (!imgDimensions) return;
    setOffset((prev) => constrainOffset(prev.x, prev.y, zoom * scaleMin));
  }, [zoom, imgDimensions, scaleMin]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const nextX = e.clientX - dragStart.x;
    const nextY = e.clientY - dragStart.y;
    setOffset(constrainOffset(nextX, nextY, scale));
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomSpeed = 0.05;
    const nextZoom = Math.min(Math.max(zoom - e.deltaY * zoomSpeed * 0.01, 1), 3);
    setZoom(nextZoom);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const now = Date.now();
      const DOUBLE_TAP_DELAY = 300;
      if (now - lastTap < DOUBLE_TAP_DELAY) {
        // Toggle Zoom between 1x and 2x on double tap
        if (zoom > 1.1) {
          setZoom(1);
          setOffset({ x: 0, y: 0 });
        } else {
          setZoom(2.0);
          setOffset({ x: 0, y: 0 });
        }
        setLastTap(0);
        setIsDragging(false);
        return;
      }
      setLastTap(now);

      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - offset.x,
        y: touch.clientY - offset.y,
      });
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      setTouchStartDist(dist);
      setTouchStartZoom(zoom);
    }
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    if (zoom > 1.1) {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    } else {
      setZoom(2.0);
      setOffset({ x: 0, y: 0 });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      const nextX = touch.clientX - dragStart.x;
      const nextY = touch.clientY - dragStart.y;
      setOffset(constrainOffset(nextX, nextY, scale));
    } else if (e.touches.length === 2 && touchStartDist > 0) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const factor = dist / touchStartDist;
      const nextZoom = Math.min(Math.max(touchStartZoom * factor, 1), 3);
      setZoom(nextZoom);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchStartDist(0);
  };

  const handleSave = () => {
    if (!imgDimensions) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const targetSize = 400; // Output cropped image resolution (400x400)
      const canvas = document.createElement("canvas");
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext("2d");

      const ratio = targetSize / D;
      const drawX = ((viewportWidth - imgDimensions.width * scale) / 2 + offset.x - cropLeft) * ratio;
      const drawY = ((viewportHeight - imgDimensions.height * scale) / 2 + offset.y - cropTop) * ratio;
      const drawW = imgDimensions.width * scale * ratio;
      const drawH = imgDimensions.height * scale * ratio;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      const croppedBase64 = canvas.toDataURL("image/jpeg", 0.9);
      onCrop(croppedBase64);
    };
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div 
        className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-2xl flex flex-col items-center w-full max-w-sm animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">Edit Profile Picture</h2>
          <p className="text-sm text-base-content/60 mt-1">
            Drag to reposition • Scroll/Pinch/Double-tap to zoom
          </p>
        </div>

        {/* Crop Viewport */}
        <div
          ref={containerRef}
          className="w-[300px] h-[300px] relative overflow-hidden bg-zinc-950 rounded-2xl cursor-grab active:cursor-grabbing border border-base-300 shadow-inner select-none touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleClick}
        >
          {/* Circular Cutout Overlay */}
          <div className="absolute w-[240px] h-[240px] rounded-full border-2 border-white/80 pointer-events-none z-10 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          {/* Draggable/Zoomable Image */}
          {imgDimensions && (
            <img
              src={imageSrc}
              alt="To Crop"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transformOrigin: "center center",
                width: imgDimensions.width,
                height: imgDimensions.height,
                pointerEvents: "none",
                position: "absolute",
                left: (viewportWidth - imgDimensions.width) / 2,
                top: (viewportHeight - imgDimensions.height) / 2,
              }}
              className="max-w-none"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="w-full flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost rounded-2xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn btn-primary px-6 rounded-2xl shadow-lg shadow-primary/20"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
