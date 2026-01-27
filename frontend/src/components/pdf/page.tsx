import { mergeTextItems } from '@app/components/pdf/merge-text-items';
import { type PDFPageProxy, TextLayer } from 'pdfjs-dist';
import { useEffect, useRef } from 'react';

interface PdfPageProps {
  page: PDFPageProxy;
  scale: number;
  rotation: 0 | 90 | 180 | 270;
  isDarkMode: boolean;
}

export const PdfPage = ({ page, scale, rotation, isDarkMode }: PdfPageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<ReturnType<PDFPageProxy['render']> | null>(null);
  const textLayerInstanceRef = useRef<TextLayer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const textLayerElement = textLayerRef.current;

    if (canvas === null || textLayerElement === null) {
      return;
    }

    const renderPage = async () => {
      // Cancel any ongoing render
      if (renderTaskRef.current !== null) {
        renderTaskRef.current.cancel();
      }

      // Cancel any ongoing text layer render
      if (textLayerInstanceRef.current !== null) {
        textLayerInstanceRef.current.cancel();
        textLayerInstanceRef.current = null;
      }

      // Clear previous text layer content
      textLayerElement.innerHTML = '';

      // Combine page rotation with user rotation
      const totalRotation = ((page.rotate + rotation) % 360) as 0 | 90 | 180 | 270;
      const viewport = page.getViewport({ scale, rotation: totalRotation });
      const canvasContext = canvas.getContext('2d');

      if (canvasContext === null) {
        return;
      }

      // Set canvas dimensions
      const outputScale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      // Set text layer dimensions and scale factors
      textLayerElement.style.width = `${Math.floor(viewport.width)}px`;
      textLayerElement.style.height = `${Math.floor(viewport.height)}px`;
      textLayerElement.style.setProperty('--scale-factor', scale.toString(10));
      textLayerElement.style.setProperty('--user-unit', '1');
      textLayerElement.style.setProperty('--total-scale-factor', scale.toString(10));

      const transform: [number, number, number, number, number, number] | undefined =
        outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

      try {
        renderTaskRef.current = page.render({ canvasContext, canvas, viewport, transform });
        await renderTaskRef.current.promise;

        const text = await page.getTextContent();

        console.log('Original text items:', text.items);
        const mergedTextItems = mergeTextItems(text.items);
        console.log('Merged text items:', mergedTextItems);

        const textLayer = new TextLayer({
          textContentSource: { ...text, items: mergedTextItems },
          container: textLayerElement,
          viewport,
        });
        textLayerInstanceRef.current = textLayer;
        await textLayer.render();
      } catch (error) {
        if (error instanceof Error && error.name !== 'RenderingCancelledException') {
          console.error('Error rendering PDF page:', error);
        }
      }
    };

    renderPage();

    return () => {
      if (renderTaskRef.current !== null) {
        renderTaskRef.current.cancel();
      }
      if (textLayerInstanceRef.current !== null) {
        textLayerInstanceRef.current.cancel();
      }
    };
  }, [page, scale, rotation]);

  return (
    <div ref={containerRef} className="relative mb-2 shadow-md">
      <canvas ref={canvasRef} style={{ filter: isDarkMode ? 'hue-rotate(180deg) invert(1)' : 'none' }} />
      <div ref={textLayerRef} className="textLayer absolute top-0 left-0" />
    </div>
  );
};
