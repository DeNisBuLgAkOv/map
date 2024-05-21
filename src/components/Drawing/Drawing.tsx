import React from 'react';
import './Drawing.css';

interface DrawingControlsProps {
  setDrawingMode: (mode: 'point' | 'line' | 'none') => void;
  showLines: () => void;
  showPoints: () => void;
  deletePoints: () => void;
  deleteLines: () => void;
  isShowLines: boolean;
  isShowPoints: boolean;
}

const DrawingControls: React.FC<DrawingControlsProps> = (props) => {
  const {
    setDrawingMode,
    showPoints,
    showLines,
    deletePoints,
    deleteLines,
    isShowLines,
    isShowPoints,
  } = props;

  return (
    <>
      <div className="block_buttons_points">
        <button onClick={() => setDrawingMode('point')}>Добавить точку</button>
        <button onClick={() => showPoints()}>{isShowPoints ? 'Скрыть точки' : 'Показать точки'}</button>
        <button onClick={() => deletePoints()}>Удалить точки</button>
      </div>
      <div className="block_buttons_lines">
        <button onClick={() => setDrawingMode('line')}>Добавить линию</button>
        <button onClick={() => showLines()}>{isShowLines ? 'Скрыть линию' : 'Показать линию'}</button>
        <button onClick={() => deleteLines()}>Удалить линию</button>
      </div>
    </>
  );
};

export default DrawingControls;