import React, { useCallback, useRef, useState } from 'react';

export const useDragState = () => {
  const dragEnterCount = useRef(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const onDragEnter = useCallback((e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.stopPropagation();

    dragEnterCount.current += 1;

    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.stopPropagation();

    dragEnterCount.current -= 1;

    if (dragEnterCount.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  return { isDragOver, onDragEnter, onDragLeave };
};
