import React, { useRef, useState, useEffect } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Rect,
  Transformer,
} from "react-konva";

const ImageStudio = () => {
  const [imageObj, setImageObj] = useState(null);
  const [squares, setSquares] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: 500,
  });
  const [isAddMarkerEnabled, setIsAddMarkerEnabled] = useState(false);

  const fileInputRef = useRef(null);
  const stageRef = useRef(null);
  const isPinching = useRef(false); // new flag

  useEffect(() => {
    const handleResize = () => {
      if (imageObj) {
        fitToScreen(imageObj);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imageObj]);

  const fitToScreen = (img) => {
    const screenWidth = window.innerWidth;
    const imgRatio = img.width / img.height;
    const newWidth = screenWidth;
    const newHeight = screenWidth / imgRatio;
    const fitZoom = newWidth / img.width;

    setZoom(fitZoom);
    setStageSize({ width: newWidth, height: newHeight });

    const stage = stageRef.current;
    if (stage) {
      stage.scale({ x: fitZoom, y: fitZoom });
      stage.position({ x: 0, y: 0 });
      stage.batchDraw();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target.result;
      img.onload = () => {
        setImageObj(img);
        fitToScreen(img);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleStageClick = (e) => {
    if (!isAddMarkerEnabled || isPinching.current) return;

    const stage = stageRef.current;
    const pointer = stage.getPointerPosition();

    const transformed = {
      x: (pointer.x - stage.x()) / stage.scaleX(),
      y: (pointer.y - stage.y()) / stage.scaleY(),
    };

    if (
      !e.target ||
      e.target === stage ||
      e.target.getClassName() === "Image"
    ) {
      const newSquare = {
        id: Date.now().toString(),
        x: transformed.x,
        y: transformed.y,
        width: 50,
        height: 50,
        fill: "rgba(0,0,255,0.1)",
        stroke: "blue",
        strokeWidth: 2,
        draggable: true,
      };
      setSquares((prev) => [...prev, newSquare]);
      setSelectedId(newSquare.id);
    }
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
  };

  // Pinch-to-zoom
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

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
        isPinching.current = true;

        const dist = getDistance(e.touches[0], e.touches[1]);

        if (!lastDist) {
          lastDist = dist;
          return;
        }

        const scaleBy = 1.02;
        const oldScale = stage.scaleX();
        let newScale = oldScale;

        if (dist > lastDist) {
          newScale = oldScale * scaleBy;
        } else if (dist < lastDist) {
          newScale = oldScale / scaleBy;
        }

        setZoom(newScale);
        stage.scale({ x: newScale, y: newScale });

        const rect = stage.container().getBoundingClientRect();
        const center = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top,
        };

        const pointTo = {
          x: (center.x - stage.x()) / oldScale,
          y: (center.y - stage.y()) / oldScale,
        };

        const newPos = {
          x: center.x - pointTo.x * newScale,
          y: center.y - pointTo.y * newScale,
        };

        stage.position(newPos);
        stage.batchDraw();

        lastDist = dist;
      }
    };

    const resetDist = () => {
      isPinching.current = false;
      lastDist = 0;
    };

    const container = stage.container();
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", resetDist);
    container.addEventListener("touchcancel", resetDist);

    return () => {
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", resetDist);
      container.removeEventListener("touchcancel", resetDist);
    };
  }, [imageObj]);

  const handleDownload = () => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "image-with-squares.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  console.log("Squares:", squares);
  return (
    <div className="p-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        className="mb-4"
      />

      {imageObj && (
        <>
          <div className="flex items-center gap-4 my-2">
            <button
              onClick={() => setIsAddMarkerEnabled((prev) => !prev)}
              className={`px-3 py-1 rounded ${
                isAddMarkerEnabled ? "bg-green-600 text-white" : "bg-gray-300"
              }`}
            >
              {isAddMarkerEnabled ? "Marker Mode: ON" : "Enable Marker Mode"}
            </button>

            <button
              onClick={() => fitToScreen(imageObj)}
              className="ml-auto bg-gray-200 px-3 py-1 rounded"
            >
              Fit to Screen
            </button>
            <button
              onClick={() => {
                if (selectedId) {
                  setSquares((prev) => prev.filter((s) => s.id !== selectedId));
                  setSelectedId(null);
                }
              }}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete Selected
            </button>
          </div>

          <div className="border border-gray-300 block w-full overflow-auto stage-container">
            <Stage
              width={stageSize.width}
              height={stageSize.height}
              onMouseDown={handleStageClick}
              onTouchStart={handleStageClick}
              onWheel={handleWheel}
              ref={stageRef}
              style={{ border: "1px solid #ccc" }}
            >
              <Layer>
                <KonvaImage
                  image={imageObj}
                  width={stageSize.width}
                  height={stageSize.height}
                />
              </Layer>

              <Layer>
                {squares.map((square, i) => (
                  <React.Fragment key={square.id}>
                    <Rect
                      {...square}
                      id={square.id}
                      onClick={() => setSelectedId(square.id)}
                      onTap={() => setSelectedId(square.id)}
                      onDragEnd={(e) => {
                        const updated = {
                          ...square,
                          x: e.target.x(),
                          y: e.target.y(),
                        };
                        const updatedSquares = [...squares];
                        updatedSquares[i] = updated;
                        setSquares(updatedSquares);
                      }}
                      onTransformEnd={(e) => {
                        const node = e.target;
                        const updated = {
                          ...square,
                          x: node.x(),
                          y: node.y(),
                          width: node.width() * node.scaleX(),
                          height: node.height() * node.scaleY(),
                        };
                        node.scaleX(1);
                        node.scaleY(1);
                        const updatedSquares = [...squares];
                        updatedSquares[i] = updated;
                        setSquares(updatedSquares);
                      }}
                    />
                    {selectedId === square.id && (
                      <TransformerComponent selectedShapeId={square.id} />
                    )}
                  </React.Fragment>
                ))}
              </Layer>
            </Stage>
          </div>
        </>
      )}

      {imageObj && (
        <button
          onClick={handleDownload}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Download Image
        </button>
      )}
    </div>
  );
};

const TransformerComponent = ({ selectedShapeId }) => {
  const transformerRef = useRef();

  useEffect(() => {
    const stage = transformerRef.current.getStage();
    const selectedNode = stage.findOne(`#${selectedShapeId}`);
    if (selectedNode) {
      transformerRef.current.nodes([selectedNode]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedShapeId]);

  return (
    <Transformer
      ref={transformerRef}
      rotateEnabled={false}
      enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
      boundBoxFunc={(oldBox, newBox) => {
        if (newBox.width < 20 || newBox.height < 20) {
          return oldBox;
        }
        return newBox;
      }}
    />
  );
};

export default ImageStudio;
