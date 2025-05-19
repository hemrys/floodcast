import { useCallback, useState } from 'react';
import { View } from 'react-native';

export interface ElementMeasurements {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function useMeasureElement() {
  const [measurements, setMeasurements] = useState<ElementMeasurements | null>(null);

  const measureElement = useCallback((ref: React.RefObject<View>) => {
    if (ref.current) {
      ref.current.measureInWindow((x, y, width, height) => {
        setMeasurements({ x, y, width, height });
      });
    }
  }, []);

  return { measurements, measureElement };
}
