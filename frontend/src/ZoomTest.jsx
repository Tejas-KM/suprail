import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect } from "react-konva";

export default function ImageStudioNew() {
  const stageRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  const MIN_SCALE = 0.2;
  const MAX_SCALE = 5;

  // Mouse Zoom (Ctrl + Wheel)
  useEffect(() => {
    const stage = stageRef.current;
    const container = stage.getContainer();

    const handleWheel = (e) => {
      if (!e.ctrlKey) return;

      e.preventDefault();
      const oldScale = scale;
      const scaleBy = 1.05;
      const direction = e.deltaY > 0 ? -1 : 1;
      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      const finalScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));

      const pointer = {
        x: e.clientX - container.getBoundingClientRect().left,
        y: e.clientY - container.getBoundingClientRect().top,
      };

      const mousePointTo = {
        x: (pointer.x - stagePos.x) / oldScale,
        y: (pointer.y - stagePos.y) / oldScale,
      };

      const newPos = {
        x: pointer.x - mousePointTo.x * finalScale,
        y: pointer.y - mousePointTo.y * finalScale,
      };

      setScale(finalScale);
      setStagePos(newPos);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [scale, stagePos]);

  // Touch Pinch Zoom
  useEffect(() => {
    const stage = stageRef.current;
    const container = stage.getContainer();
    let lastDist = 0;

    const getDistance = (touch1, touch2) => {
      return Math.sqrt(
        Math.pow(touch1.clientX - touch2.clientX, 2) +
          Math.pow(touch1.clientY - touch2.clientY, 2)
      );
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dist = getDistance(e.touches[0], e.touches[1]);
        if (!lastDist) {
          lastDist = dist;
          return;
        }

        const scaleBy = dist / lastDist;
        const oldScale = scale;
        const newScale = oldScale * scaleBy;
        const finalScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));

        // get center of pinch
        const rect = container.getBoundingClientRect();
        const center = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top,
        };

        const pointTo = {
          x: (center.x - stagePos.x) / oldScale,
          y: (center.y - stagePos.y) / oldScale,
        };

        const newPos = {
          x: center.x - pointTo.x * finalScale,
          y: center.y - pointTo.y * finalScale,
        };

        setScale(finalScale);
        setStagePos(newPos);
        lastDist = dist;
      }
    };

    const handleTouchEnd = () => {
      lastDist = 0;
    };

    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scale, stagePos]);

  return (
    <div style={{ width: "100%", height: "600px", border: "1px solid black" }}>
      <Stage
        width={window.innerWidth}
        height={600}
        ref={stageRef}
        scaleX={scale}
        scaleY={scale}
        x={stagePos.x}
        y={stagePos.y}
        draggable
        style={{ background: "#f0f0f0" }}
      >
        <Layer>
          <Rect x={100} y={100} width={200} height={200} fill="orange" />
        </Layer>
      </Stage>
    </div>
  );
}
