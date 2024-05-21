import React, { useRef, useEffect } from 'react';
import maplibregl, { MapMouseEvent } from 'maplibre-gl';
import { Point } from "../App";
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapProps {
  drawingMode: 'point' | 'line' | 'none';
  setDrawingMode: (mode: 'point' | 'line' | 'none') => void;
  points: Point[];
  addPoints: (point: Point) => void;
  lines: Array<[number, number]>;
  addLines: (line: [number, number] | []) => void;
  isShowPoints: boolean;
  isShowLines: boolean;
  removeLines: boolean;
}

const Map: React.FC<MapProps> = ({drawingMode,
                                   setDrawingMode,
                                   points,
                                   addPoints,
                                   addLines,
                                   lines,
                                   isShowPoints,
                                   isShowLines,
                                   removeLines,
                                 }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  ////// инициализация карты
  useEffect(() => {
    if (mapContainer.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://demotiles.maplibre.org/style.json',
        center: [105.3188, 61.5240],
        zoom: 3,
      });
    }
  }, []);

  ////обработка кликов по карте и добавление данных в состояния
  useEffect(() => {
    const handleClick = (e: MapMouseEvent) => {
      if (drawingMode === 'point') {
        const point: Point = {
          id: new Date().toISOString(),
          coordinates: [e.lngLat.lng, e.lngLat.lat],
          time: new Date(),
        };
        addPoints(point);
        setDrawingMode('none');
      } else if (drawingMode === 'line') {
        addLines([e.lngLat.lng, e.lngLat.lat]);
      }
    };

    mapRef.current?.on('click', handleClick);
    return () => {
      mapRef.current?.off('click', handleClick);
    };
  }, [drawingMode, setDrawingMode, addPoints, addLines]);

  //////// отображение точек
  useEffect(() => {
    points.forEach((point) => {
      if (isShowPoints) {
        if (!point.marker) {
          point.marker = new maplibregl.Marker()
            .setLngLat(point.coordinates)
            .setPopup(
              new maplibregl.Popup().setText(
                `Дата создания: ${point.time.toLocaleDateString('ru-RU')}`
              )
            )
            .addTo(mapRef.current!);
        } else {
          point.marker.addTo(mapRef.current!);
        }
      } else {
        point.marker?.remove();
      }
    });
  }, [points, isShowPoints]);

  //////// отображение линий
  useEffect(() => {
    if (mapRef.current && lines.length > 1) {
      const map = mapRef.current;
      const sourceId = 'line-source';
      const layerId = 'line-layer';

      if (map.getSource(sourceId)) {
        const source = map.getSource(sourceId) as maplibregl.GeoJSONSource;
        source.setData({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: lines,
              },
              properties: {},
            },
          ],
        });
      } else {
        map.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: lines,
                },
                properties: {},
              },
            ],
          },
        });

        map.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#888',
            'line-width': 4,
          },
        });
      }

      if (!isShowLines) {
        map.setLayoutProperty(layerId, 'visibility', 'none');
      } else {
        map.setLayoutProperty(layerId, 'visibility', 'visible');
      }

      if (removeLines) {
        map.removeLayer(layerId);
        map.removeSource(sourceId);
      }
    }
  }, [lines, isShowLines, removeLines]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        setDrawingMode('none');
        addLines([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setDrawingMode, addLines]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
};

export default Map;
