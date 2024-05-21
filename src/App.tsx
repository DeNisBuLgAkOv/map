import React, { useState } from 'react';
import maplibregl from "maplibre-gl";
import Map from "./components/Map";
import Drawing from "./components/Drawing/Drawing";
import './App.css';

export interface Point {
  id: string;
  coordinates: [number, number];
  time: Date;
  marker?: maplibregl.Marker;
}

function App() {
  const [drawingMode, setDrawingMode] = useState<'point' | 'line' | 'none'>('none');
  const [points, setPoints] = useState<Point[]>([]);
  const [lines, setLines] = useState<Array<[number, number]>>([]);
  const [isShowPoints, setIsShowPoints] = useState(true);
  const [isShowLines, setIsShowLines] = useState(true);
  const [removeLines, setRemoveLines] = useState(false);

  const addPoints = (point: Point) => {
    setPoints([...points, point]);
  };

  const addLines = (line: [number, number] | []) => {
    setRemoveLines(false);
    if (line.length) {
      setLines((prevLines) => [...prevLines, line]);
    } else {
      setLines(line);
    }
  };

  const showPoints = () => {
    setIsShowPoints(!isShowPoints);
  };

  const showLines = () => {
    setIsShowLines(!isShowLines);
  };

  const deletePoints = () => {
    points.forEach((point) => point.marker?.remove());
    setPoints([]);
  };

  const deleteLines = () => {
    setRemoveLines(true);
  };

  return (
    <div className="App">
      <Drawing
        isShowPoints={isShowPoints}
        isShowLines={isShowLines}
        setDrawingMode={setDrawingMode}
        showPoints={showPoints}
        showLines={showLines}
        deletePoints={deletePoints}
        deleteLines={deleteLines}
      />
      <Map
        drawingMode={drawingMode}
        setDrawingMode={setDrawingMode}
        points={points}
        addPoints={addPoints}
        lines={lines}
        addLines={addLines}
        isShowPoints={isShowPoints}
        isShowLines={isShowLines}
        removeLines={removeLines}
      />
    </div>
  );
}

export default App;