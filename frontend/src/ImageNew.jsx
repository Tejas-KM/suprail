import React, { useEffect, useRef, useState, useCallback } from "react";
// Vehicle number formatting utility
function formatVehicleNumber(input) {
  let value = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  let parts = [];
  if (value.length > 0) parts.push(value.slice(0, 2));
  if (value.length > 2) parts.push(value.slice(2, 4));
  if (value.length > 4) parts.push(value.slice(4, 6));
  if (value.length > 6) parts.push(value.slice(6, 10));
  return parts.join(" ").trim();
}
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Rect,
  Transformer,
  Circle,
} from "react-konva";
import { nanoid } from "nanoid";
import {
  Trash2,
  Plus,
  EyeOff,
  Eye,
  Save,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  RotateCcw,
} from "lucide-react";
import Button from "./components/ui/Button";
import { updateProjectData } from "./api/project";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getTransparentFill } from "./utils/colorUtil";

export default function ImageStudioNew({ data, image, projectId }) {
  // Vehicle number state
  const [vehicleNumber, setVehicleNumber] = useState("");
  // Handler for vehicle number input
  const handleVehicleNumberChange = (e) => {
    const raw = e.target.value;
    const formatted = formatVehicleNumber(raw);
    setVehicleNumber(formatted);
  };
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [img, setImg] = useState(null);
  const [boxes, setBoxes] = useState(data?.coordinates || []);
  const [visibleColors, setVisibleColors] = useState({});
  const [activeColor, setActiveColor] = useState("");
  const [addMode, setAddMode] = useState(false);
  const [scale, setScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analysisCollapsed, setAnalysisCollapsed] = useState(false);
  const [selectionRect, setSelectionRect] = useState(null);

  // --- REFS ---
  const transformerRef = useRef(null);
  const imageRef = useRef(null);
  const rectRefs = useRef({});
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const lastDistRef = useRef(0);
  const isPinchingRef = useRef(false);
  const lastCenterRef = useRef({ x: 0, y: 0 });

  // --- DERIVED STATE & CONSTANTS ---
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const SIDEBAR_WIDTH = 288;
  const productOptions =
    data?.classes?.map((item) => ({
      product: item.className,
      color: item.color,
    })) || [];
  // Order and ensure all possible pipe sizes are present
  const pipeSizes = [
    "110",
    "20",
    "25",
    "32",
    "40",
    "50",
    "63",
    "75",
    "90",
    "125",
    "140",
    "160",
    "180",
    "200",
    "225",
    "250",
    "280",
    "315",
    "400",
    "450",
  ];
  // Create a map color->product for any missing sizes and to order active sizes first
  const productOptionsByColor = productOptions.reduce((acc, p) => {
    acc[p.color] = p;
    return acc;
  }, {});
  // Build ordered list: active (from data.classes order) first, then all known pipeSizes (creating
  // placeholder entries for sizes not present in `data.classes`), finally append any extras.
  const orderedProductOptions = [];
  const seenColors = new Set();

  // start with existing productOptions in their current order (these are active sizes)
  productOptions.forEach((p) => {
    orderedProductOptions.push(p);
    seenColors.add(p.color);
  });

  // prepare a small palette of distinct colors to assign to placeholder sizes
  const colorPalette = [
    "#ef4444",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#f97316",
    "#06b6d4",
    "#84cc16",
    "#0ea5e9",
    "#a78bfa",
    "#f43f5e",
    "#fb7185",
    "#60a5fa",
    "#34d399",
  ];
  const usedColors = new Set(Object.keys(productOptionsByColor));
  let paletteIndex = 0;
  const getNextColor = () => {
    // find next palette color that's not already used
    for (let i = 0; i < colorPalette.length; i++) {
      const idx = (paletteIndex + i) % colorPalette.length;
      const c = colorPalette[idx];
      if (!usedColors.has(c)) {
        paletteIndex = idx + 1;
        usedColors.add(c);
        return c;
      }
    }
    // fallback: generate a simple deterministic color based on paletteIndex
    const fallback = `#${((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0")}`;
    usedColors.add(fallback);
    return fallback;
  };

  // then ensure every size in pipeSizes is represented (use existing entry if available,
  // otherwise create a placeholder entry with a generated color)
  pipeSizes.forEach((size) => {
    const label = `${size}mm`;
    const entry = Object.values(productOptionsByColor).find(
      (p) => `${p.product}` === `${size}` || `${p.product}mm` === label || p.product === size
    );
    if (entry) {
      if (!seenColors.has(entry.color)) {
        orderedProductOptions.push(entry);
        seenColors.add(entry.color);
      }
    } else {
      // create placeholder option so the size appears in the UI
      const color = getNextColor();
  const placeholder = { product: `${size}`, color, avgSize: Number(size) };
      orderedProductOptions.push(placeholder);
      seenColors.add(color);
    }
  });

  // lastly, append any product options not yet included (defensive)
  productOptions.forEach((p) => {
    if (!seenColors.has(p.color)) {
      orderedProductOptions.push(p);
      seenColors.add(p.color);
    }
  });

  // --- EFFECTS ---
  useEffect(() => {
    const loadImage = new window.Image();
    loadImage.src = image;
    loadImage.onload = () => setImg(loadImage);
  }, [image]);

  useEffect(() => {
    setBoxes(data?.coordinates || []);
  }, [data]);

  useEffect(() => {
    const resize = () => {
      // Use the container's own size. In desktop layout the container already excludes
      // the sidebar width due to flex layout, so do NOT subtract sidebar width again.
      const container = containerRef.current;
      const widthFromContainer = container
        ? container.clientWidth
        : window.innerWidth;
      const heightFromContainer = container
        ? container.clientHeight
        : window.innerHeight;

      setStageSize({
        width: Math.max(0, widthFromContainer),
        height: Math.max(0, heightFromContainer),
      });
    };
    // Run on next frame to ensure refs are set
    setTimeout(resize, 0);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [analysisCollapsed]);

  useEffect(() => {
    if (!img || !stageSize.width || !stageSize.height) return;
    // Use ALL vertical space
    const scaleX = stageSize.width / img.width;
    const scaleY = stageSize.height / img.height;
    const scaleFactor = Math.min(scaleX, scaleY);
    setScale(scaleFactor);
    const offsetX = (stageSize.width - img.width * scaleFactor) / 2;
    const offsetY = (stageSize.height - img.height * scaleFactor) / 2;
    setStagePos({ x: offsetX, y: offsetY });
  }, [img, stageSize]);

  useEffect(() => {
    const nodes = selectedIds
      .map((id) => rectRefs.current[id])
      .filter(Boolean);
    if (transformerRef.current) {
      transformerRef.current.nodes(nodes);
      try {
        transformerRef.current.getLayer()?.batchDraw();
      } catch (err) {}
    }
  }, [selectedIds, boxes]);

  useEffect(() => {
    const allColors = [...new Set(boxes.map((b) => b.stroke || "red"))];
    const newVisibility = { ...visibleColors };
    allColors.forEach((color) => {
      if (!(color in newVisibility)) {
        newVisibility[color] = true;
      }
    });
    setVisibleColors(newVisibility);
  }, [boxes]);

  const handleDelete = useCallback(() => {
    if (!selectedIds.length) return;
    setBoxes((prev) => prev.filter((b) => !selectedIds.includes(b.id)));
    setSelectedIds([]);
  }, [selectedIds]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedIds.length
      ) {
        handleDelete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, handleDelete]);

  // --- HANDLER FUNCTIONS ---
  const handleSave = () => {
    const colorToSize = (data?.classes || []).reduce((acc, item) => {
      acc[item.color] = item.className;
      return acc;
    }, {});
    const sizeCounts = boxes.reduce((acc, box) => {
      const size = colorToSize[box.stroke] || box.stroke;
      acc[size] = (acc[size] || 0) + 1;
      return acc;
    }, {});
    const finalProductCount = Object.entries(sizeCounts).map(
      ([name, count]) => ({ name, count })
    );
    const updatedData = {
      predictionData: boxes,
      productCount: finalProductCount,
      vehicleNumber: vehicleNumber,
    };
    toast.promise(updateProjectData(projectId, updatedData), {
      loading: "Saving project...",
      success: "Project updated successfully!",
      error: "Failed to update project.",
    });
  };

  const handleWheel = (e) => {
    if (!e.evt.ctrlKey) return;
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = stageRef.current;
    if (!stage) return;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    const newScale =
      e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    setScale(newScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  // Touch / pinch handlers for mobile two-finger zoom
  const getDistance = (p1, p2) => {
    const dx = p1.clientX - p2.clientX;
    const dy = p1.clientY - p2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e) => {
    const stage = stageRef.current;
    if (!stage) return;
    const touches = e.evt.touches || e.evt.targetTouches;
    if (!touches) return;

    if (touches.length === 2) {
      // start pinch
      isPinchingRef.current = true;
      const dist = getDistance(touches[0], touches[1]);
      lastDistRef.current = dist;
      // midpoint in client coordinates
      const centerClientX = (touches[0].clientX + touches[1].clientX) / 2;
      const centerClientY = (touches[0].clientY + touches[1].clientY) / 2;
      // compute midpoint in stage coordinates (unscaled)
      const oldScale = stage.scaleX();
      lastCenterRef.current = {
        x: (centerClientX - stage.x()) / oldScale,
        y: (centerClientY - stage.y()) / oldScale,
      };
      // prevent browser pinch-zoom
      e.evt.preventDefault?.();
    } else if (touches.length === 1) {
      // single finger: start panning similar to mouse right-click panning
      const t = touches[0];
      setIsPanning(true);
      setPanStart({
        x: t.clientX,
        y: t.clientY,
        stageX: stagePos.x,
        stageY: stagePos.y,
      });
    }
  }, [stagePos.x, stagePos.y]);

  const handleTouchMove = useCallback((e) => {
    const stage = stageRef.current;
    if (!stage) return;
    const touches = e.evt.touches || e.evt.targetTouches;
    if (!touches) return;

    if (isPinchingRef.current && touches.length === 2) {
      e.evt.preventDefault?.();
      const dist = getDistance(touches[0], touches[1]);
      const oldDist = lastDistRef.current || dist;
      if (oldDist === 0) {
        lastDistRef.current = dist;
        return;
      }
      const scaleBy = dist / oldDist;
      const oldScale = stage.scaleX();
      let newScale = oldScale * scaleBy;
      newScale = Math.max(0.1, Math.min(8, newScale));

      // recompute midpoint client coords
      const centerClientX = (touches[0].clientX + touches[1].clientX) / 2;
      const centerClientY = (touches[0].clientY + touches[1].clientY) / 2;

      const pointerTo = {
        x: (centerClientX - stage.x()) / oldScale,
        y: (centerClientY - stage.y()) / oldScale,
      };

      setScale(newScale);
      setStagePos({
        x: centerClientX - pointerTo.x * newScale,
        y: centerClientY - pointerTo.y * newScale,
      });

      lastDistRef.current = dist;
    } else if (touches.length === 1 && isPanning && panStart) {
      // single finger panning
      const t = touches[0];
      const dx = t.clientX - panStart.x;
      const dy = t.clientY - panStart.y;
      setStagePos({ x: panStart.stageX + dx, y: panStart.stageY + dy });
    }
  }, [isPanning, panStart]);

  const handleTouchEnd = useCallback((e) => {
    const touches = e.evt.touches || e.evt.targetTouches || [];
    if (touches.length < 2) {
      isPinchingRef.current = false;
      lastDistRef.current = 0;
    }
    if (touches.length === 0) {
      setIsPanning(false);
      setPanStart(null);
    }
  }, []);

  const handleStagePointerDown = useCallback(
    (e) => {
      const stage = stageRef.current;
      if (!stage) return;
      const pos = stage.getRelativePointerPosition();
      const clickedOnEmpty =
        e.target === stage || e.target === imageRef.current;
      if (addMode && clickedOnEmpty) {
        // Determine avgSize from orderedProductOptions first (covers placeholders like "250mm"),
        // fall back to data.classes (existing predictions), then default to 80.
        const matchedOption = orderedProductOptions.find((p) => p.color === activeColor);
        const sizeFromOption = matchedOption?.avgSize || (matchedOption?.product ? Number(String(matchedOption.product).replace(/mm$/i, "")) : undefined);
        const sizeFromData = data?.classes?.find((c) => c.color === activeColor)?.avgSize;
        const avgSize = sizeFromOption || sizeFromData || 80;

        const newBox = {
          id: nanoid(),
          x: pos.x - avgSize / 2,
          y: pos.y - avgSize / 2,
          width: avgSize,
          height: avgSize,
          stroke: activeColor,
          fill: getTransparentFill(activeColor),
        };
        setBoxes((prev) => [...prev, newBox]);
        setSelectedIds([newBox.id]);
        return;
      }
      if (!addMode && clickedOnEmpty) {
        setSelectionRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
        setSelectedIds([]);
      }
    },
    [addMode, activeColor, data]
  );

  const handleStageMouseMove = (e) => {
    if (isPanning && panStart) {
      const dx = e.evt.clientX - panStart.x;
      const dy = e.evt.clientY - panStart.y;
      setStagePos({ x: panStart.stageX + dx, y: panStart.stageY + dy });
      return;
    }
    if (!selectionRect) return;
    const stage = stageRef.current;
    if (!stage) return;
    const pos = stage.getRelativePointerPosition();
    setSelectionRect({
      x: Math.min(selectionRect.x, pos.x),
      y: Math.min(selectionRect.y, pos.y),
      width: Math.abs(pos.x - selectionRect.x),
      height: Math.abs(pos.y - selectionRect.y),
    });
  };

  const handleStageMouseUp = (e) => {
    if (isPanning) {
      setIsPanning(false);
      setPanStart(null);
      return;
    }
    if (!selectionRect) return;
    const stage = stageRef.current;
    if (!stage) return;
    const selected = boxes.filter((box) => {
      const radius = Math.max(box.width, box.height) / 2;
      const cx = box.x + radius;
      const cy = box.y + radius;
      const isVisible = visibleColors[box.stroke ?? "red"];
      return (
        isVisible &&
        cx >= selectionRect.x &&
        cx <= selectionRect.x + selectionRect.width &&
        cy >= selectionRect.y &&
        cy <= selectionRect.y + selectionRect.height
      );
    });
    if (e.evt.shiftKey) {
      const selectedSet = new Set(selectedIds);
      selected.forEach((b) => {
        if (selectedSet.has(b.id)) selectedSet.delete(b.id);
        else selectedSet.add(b.id);
      });
      setSelectedIds([...selectedSet]);
    } else {
      setSelectedIds(selected.map((b) => b.id));
    }
    setSelectionRect(null);
  };

  const colorCounts = boxes.reduce((acc, box) => {
    const color = box.stroke || "red";
    acc[color] = (acc[color] || 0) + 1;
    return acc;
  }, {});

  // --- RENDER ---
  return (
    <div className="flex h-screen overflow-hidden bg-linear-to-br from-slate-50 to-slate-100">
      {/* Logo in top-left corner */}
      <div className="fixed top-4 left-4 z-50 bg-[#1565d8] px-3 py-1.5 rounded-lg shadow-md">
        <span className="text-white font-bold text-sm">Supreme AI</span>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen((s) => !s)}
        aria-label="Toggle sidebar"
        className="fixed top-4 right-4 z-50 p-2 rounded-lg hover:bg-slate-100/70 md:hidden transition-all duration-200 bg-white/90 backdrop-blur-sm shadow-sm"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Main Canvas Area */}
  <div ref={containerRef} className="flex-1 overflow-hidden" style={{ touchAction: 'none' }}>
        {img && (
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            ref={stageRef}
            scaleX={scale}
            scaleY={scale}
            x={stagePos.x}
            y={stagePos.y}
            draggable={false}
            onWheel={handleWheel}
            style={{
              cursor: isPanning ? "grabbing" : "default",
              background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            }}
            onMouseDown={(e) => {
              if (e.evt.button === 2) {
                setIsPanning(true);
                setPanStart({
                  x: e.evt.clientX,
                  y: e.evt.clientY,
                  stageX: stagePos.x,
                  stageY: stagePos.y,
                });
                e.evt.preventDefault();
                return;
              }
              handleStagePointerDown(e);
            }}
            onMouseMove={handleStageMouseMove}
            onMouseUp={handleStageMouseUp}
            // Mobile/touch support (custom handlers for pinch-to-zoom)
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onContextMenu={(e) => e.evt.preventDefault()}
          >
            <Layer>
              <KonvaImage image={img} ref={imageRef} />
              {boxes
                .filter((box) => visibleColors[box.stroke ?? "red"])
                .map((box) => {
                  const isSelected = selectedIds.includes(box.id);
                  return (
                    <Circle
                      key={box.id}
                      ref={(node) => node && (rectRefs.current[box.id] = node)}
                      x={box.x + box.width / 2}
                      y={box.y + box.height / 2}
                      radius={Math.max(box.width, box.height) / 2}
                      strokeWidth={2 / scale}
                      draggable
                      onClick={(e) => {
                        e.cancelBubble = true;
                        if (e.evt.shiftKey) {
                          setSelectedIds((prev) =>
                            prev.includes(box.id)
                              ? prev.filter((id) => id !== box.id)
                              : [...prev, box.id]
                          );
                        } else {
                          setSelectedIds([box.id]);
                        }
                      }}
                      onTap={(e) => {
                        // Ensure mobile tap selects too
                        e.cancelBubble = true;
                        setSelectedIds([box.id]);
                      }}
                      onDragEnd={(e) => {
                        const newX = e.target.x() - box.width / 2;
                        const newY = e.target.y() - box.height / 2;
                        setBoxes((prev) =>
                          prev.map((b) =>
                            b.id === box.id ? { ...b, x: newX, y: newY } : b
                          )
                        );
                      }}
                      onTransformEnd={(e) => {
                        const node = e.target;
                        const scaleX = node.scaleX();
                        node.scaleX(1);
                        node.scaleY(1);
                        const newRadius = Math.max(5, node.radius() * scaleX);
                        const updatedBox = {
                          ...box,
                          x: node.x() - newRadius,
                          y: node.y() - newRadius,
                          width: newRadius * 2,
                          height: newRadius * 2,
                        };
                        setBoxes((prev) =>
                          prev.map((b) =>
                            b.id === box.id ? updatedBox : b
                          )
                        );
                      }}
                      fill={getTransparentFill(box.stroke)}
                      stroke={isSelected ? "#06b6d4" : box.stroke || "red"}
                      shadowColor={isSelected ? "#06b6d4" : "transparent"}
                      shadowBlur={isSelected ? 8 : 0}
                      shadowOpacity={isSelected ? 0.3 : 0}
                    />
                  );
                })}
              {selectionRect && (
                <Rect
                  {...selectionRect}
                  fill="rgba(6, 182, 212, 0.1)"
                  stroke="#06b6d4"
                  dash={[4, 4]}
                />
              )}
              <Transformer
                ref={transformerRef}
                rotateEnabled={false}
                anchorSize={scale < 0.8 ? 4 : 8}
                enabledAnchors={[
                  "top-left",
                  "top-right",
                  "bottom-left",
                  "bottom-right",
                ]}
                boundBoxFunc={(oldBox, newBox) =>
                  newBox.width < 5 || newBox.height < 5 ? oldBox : newBox
                }
              />
            </Layer>
          </Stage>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity md:hidden ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Enhanced Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-60 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:relative md:top-auto md:right-auto md:bottom-auto md:translate-x-0`}
      >
        {analysisCollapsed ? (
          <div className="w-14 flex flex-col items-center py-4 bg-white/95 backdrop-blur-lg border-l border-slate-200/60 shadow-xl">
            <button
              onClick={() => setAnalysisCollapsed(false)}
              className="p-2 rounded-lg hover:bg-slate-100/70 transition-all duration-200 group"
              title="Expand analysis panel"
            >
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-800" />
            </button>
          </div>
        ) : (
          <div className="w-72 flex flex-col h-full bg-white/95 backdrop-blur-lg border-l border-slate-200/60 shadow-xl">
            <div className="flex-1 overflow-y-auto min-h-0">
              {/* Header */}
              <div className="p-4 border-b border-slate-200/60 bg-linear-to-r from-slate-50/80 to-white/80">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-bold text-slate-800">
                    Tools & Settings
                  </h2>
                  <button
                    onClick={() => setAnalysisCollapsed(true)}
                    className="p-1.5 rounded-lg hover:bg-slate-100/70 md:block hidden transition-all duration-200"
                    title="Collapse panel"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Manage annotations and view settings
                </p>
              </div>

              <div className="p-4 space-y-4">
                {/* Vehicle Number Input Section */}
                <div className="p-3 rounded-lg bg-linear-to-br from-yellow-50/80 to-orange-50/80 border border-yellow-200/60 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Vehicle Number
                  </h3>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={handleVehicleNumberChange}
                    maxLength={13}
                    placeholder="e.g. KA 01 AB 1234"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 bg-white/70 backdrop-blur-sm transition-all duration-200 tracking-widest uppercase"
                  />
                  <p className="text-xs text-slate-500 mt-1">Format: AA 00 AA 0000</p>
                </div>
                {/* Delete Section */}
                <div className="space-y-2">
                  <button
                    onClick={handleDelete}
                    disabled={selectedIds.length === 0}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      selectedIds.length > 0
                        ? "bg-linear-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md shadow-red-500/25"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected ({selectedIds.length})
                  </button>
                </div>

                {/* Active Pipe Size Section */}
                <div className="p-3 rounded-lg bg-linear-to-br from-blue-50/80 to-indigo-50/80 border border-blue-200/60 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Active Pipe Size
                  </h3>
                  <select
                    value={activeColor || ""}
                    onChange={(e) => setActiveColor(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white/70 backdrop-blur-sm transition-all duration-200"
                  >
                    <option value="" disabled>
                      Choose pipe size...
                    </option>
                    {orderedProductOptions?.map((item) => (
                      <option key={item.product + item.color} value={item.color}>
                        {item.product}mm
                      </option>
                    ))}
                  </select>
                  {activeColor && (
                    <button
                      onClick={() => setAddMode((prev) => !prev)}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 mt-3 flex items-center justify-center gap-2 ${
                        addMode
                          ? "bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/25"
                          : "bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md shadow-blue-500/25"
                      }`}
                    >
                      {addMode ? (
                        <>
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          Adding Mode ON
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Enable Add Mode
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Zoom Controls */}
                <div className="p-3 rounded-lg bg-linear-to-br from-emerald-50/80 to-teal-50/80 border border-emerald-200/60 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-emerald-600" />
                    Zoom & View
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-700 mb-1 block">
                        Zoom Level
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="8"
                        step="0.1"
                        value={scale}
                        onChange={(e) => setScale(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>10%</span>
                        <span className="font-semibold text-slate-700">
                          {Math.round(scale * 100)}%
                        </span>
                        <span>800%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setScale(Math.max(0.2, scale / 1.2))}
                        className="bg-slate-200 hover:bg-slate-300 px-2 py-1.5 rounded text-xs font-medium transition-all duration-200"
                      >
                        -
                      </button>
                      <button
                        onClick={() => setScale(Math.min(8, scale * 1.2))}
                        className="bg-slate-200 hover:bg-slate-300 px-2 py-1.5 rounded text-xs font-medium transition-all duration-200"
                      >
                        +
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 shadow-sm"
                        onClick={() => {
                          if (!img || !stageSize.width || !stageSize.height)
                            return;
                          const scaleFactor = Math.min(
                            stageSize.width / img.width,
                            stageSize.height / img.height
                          );
                          const offsetX =
                            (stageSize.width - img.width * scaleFactor) / 2;
                          const offsetY =
                            (stageSize.height - img.height * scaleFactor) / 2;
                          setScale(scaleFactor);
                          setStagePos({ x: offsetX, y: offsetY });
                        }}
                      >
                        Fit to Screen
                      </button>
                      <button
                        className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1"
                        onClick={() => {
                          if (!img || !stageSize.width || !stageSize.height)
                            return;
                          const offsetX = (stageSize.width - img.width * 1) / 2;
                          const offsetY =
                            (stageSize.height - img.height * 1) / 2;
                          setScale(1);
                          setStagePos({ x: offsetX, y: offsetY });
                        }}
                      >
                        <RotateCcw className="w-3 h-3" />
                        Original Size
                      </button>
                    </div>
                  </div>
                </div>

                {/* Change Product for Selected */}
                {selectedIds.length > 0 && (
                  <div className="p-3 rounded-lg bg-linear-to-br from-purple-50/80 to-violet-50/80 border border-purple-200/60 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800 mb-2">
                      Change Product ({selectedIds.length} selected)
                    </h3>
                    <select
                      value={""}
                      onChange={(e) => {
                        const newColor = e.target.value;
                        if (newColor) {
                          // Determine avgSize for the chosen product/color
                          const matchedOption = orderedProductOptions.find((p) => p.color === newColor);
                          const sizeFromOption = matchedOption?.avgSize || (matchedOption?.product ? Number(String(matchedOption.product).replace(/mm$/i, "")) : undefined);
                          const sizeFromData = data?.classes?.find((c) => c.color === newColor)?.avgSize;
                          const newAvg = sizeFromOption || sizeFromData || 80;

                          setBoxes((prev) =>
                            prev.map((box) => {
                              if (!selectedIds.includes(box.id)) return box;
                              // preserve center while changing size
                              const centerX = box.x + box.width / 2;
                              const centerY = box.y + box.height / 2;
                              const newWidth = newAvg;
                              const newHeight = newAvg;
                              const newX = centerX - newWidth / 2;
                              const newY = centerY - newHeight / 2;
                              return {
                                ...box,
                                stroke: newColor,
                                fill: getTransparentFill(newColor),
                                x: newX,
                                y: newY,
                                width: newWidth,
                                height: newHeight,
                              };
                            })
                          );
                        }
                      }}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 bg-white/70 backdrop-blur-sm"
                    >
                      <option value="" disabled>
                        Select new product...
                      </option>
                      {orderedProductOptions.map((item) => (
                        <option key={item.product + item.color} value={item.color}>
                          {item.product}mm
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Save/Close buttons in sidebar when expanded */}
            <div
              className="p-4 border-t border-slate-200/60 bg-linear-to-r from-slate-50/90 to-white/90"
              style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
            >
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-2 px-3 rounded-lg shadow-md shadow-green-500/25 transition-all duration-200 text-sm"
                >
                  <Save className="w-4 h-4" />
                  Save
                </Button>
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-3 rounded-lg shadow-md transition-all duration-200 text-sm"
                >
                  <X className="w-4 h-4" />
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Panel */}
      <div
        className={`fixed left-0 bottom-0 z-40 backdrop-blur-lg border-t border-slate-200/60 shadow-2xl transition-all duration-300 ${
          analysisCollapsed
            ? "md:right-14 right-0 bg-white/95"
            : "md:right-72 right-0 bg-linear-to-r from-slate-50/80 to-white/80"
        }`}
        style={{ width: 'auto' }}
      >
        <div className="px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Product Visibility Header */}
            <div className="shrink-0 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-slate-600" />
                  <h3 className="text-sm font-bold text-slate-800 hidden sm:block">
                    Product Visibility
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const allVisible = {};
                      orderedProductOptions.forEach(({ color }) => {
                        allVisible[color] = true;
                      });
                      setVisibleColors(allVisible);
                    }}
                    className="text-xs px-2 py-1 rounded bg-linear-to-r from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 text-blue-700 border border-blue-300/60 font-medium transition-all duration-200"
                  >
                    Show All
                  </button>
                  <button
                    onClick={() => {
                      const allHidden = {};
                      orderedProductOptions.forEach(({ color }) => {
                        allHidden[color] = false;
                      });
                      setVisibleColors(allHidden);
                    }}
                    className="text-xs px-2 py-1 rounded bg-linear-to-r from-slate-500/10 to-slate-600/10 hover:from-slate-500/20 hover:to-slate-600/20 text-slate-700 border border-slate-300/60 font-medium transition-all duration-200"
                  >
                    Hide All
                  </button>
                </div>
              </div>
            </div>

            {/* Product Options Scroll Container */}
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 items-center whitespace-nowrap pb-1">
                {orderedProductOptions.map(({ product, color }) => (
                  <label
                    key={color}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium shadow-sm border transition-all duration-200 cursor-pointer min-w-fit ${
                      visibleColors[color]
                        ? "bg-white/90 border-slate-300/60 text-slate-700 hover:shadow-md hover:border-slate-400/60"
                        : "bg-slate-100/70 border-slate-200/60 text-slate-500 opacity-60"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!visibleColors[color]}
                      onChange={(e) =>
                        setVisibleColors({
                          ...visibleColors,
                          [color]: e.target.checked,
                        })
                      }
                      className="h-3 w-3 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500/50"
                    />
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-medium">{product}mm</span>
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium min-w-6 text-center">
                      {colorCounts[color] || 0}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons - only show when sidebar is collapsed */}
            {analysisCollapsed && (
              <div className="shrink-0 flex items-center gap-2 ml-3">
                <Button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-2 px-4 rounded-lg shadow-md shadow-green-500/25 transition-all duration-200 text-sm"
                >
                  <Save className="w-4 h-4" />
                  Save Project
                </Button>
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-200 text-sm"
                >
                  <X className="w-4 h-4" />
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
}
