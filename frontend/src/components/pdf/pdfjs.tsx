import { Box } from '@navikt/ds-react';
import { GlobalWorkerOptions, type PDFPageProxy, TextLayer, getDocument } from 'pdfjs-dist';
import { useCallback, useEffect, useRef, useState } from 'react';

GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@5.2.133/build/pdf.worker.min.mjs';

interface ObjectProps {
  data: string | undefined;
}

export const PdfRenderer = ({ data }: ObjectProps) => {
  const [pages, setPages] = useState<PDFPageProxy[]>([]);

  const loadPdf = useCallback(async (data: string) => {
    const pdf = await getDocument(data).promise;

    const numPages = pdf.numPages;
    const pageList: PDFPageProxy[] = [];

    for (let page = 1; page <= numPages; page++) {
      const pdfPage = await pdf.getPage(page);
      pageList.push(pdfPage);
    }

    setPages(pageList);
  }, []);

  useEffect(() => {
    if (data === undefined) {
      return;
    }

    loadPdf(data);
  }, [data, loadPdf]);

  if (pages.length === 0) {
    return <Box>Ingen sider å vise</Box>;
  }

  return pages.map((page, index) => <PdfPage key={index.toString()} page={page} />);
};

interface PdfPageProps {
  page: PDFPageProxy;
}

const PdfPage = ({ page }: PdfPageProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const textLayerElement = textLayerRef.current;

    if (textLayerElement === null) {
      console.error('Text layer reference is null');
      return;
    }

    if (canvas === null) {
      console.error('Canvas reference is null');
      return;
    }

    const context = canvas.getContext('2d');

    if (context === null) {
      console.error('Failed to get canvas context');
      return;
    }

    const scale: number = 1.5;
    const viewport = page.getViewport({ scale });
    const ratio = window.devicePixelRatio ?? 1;
    const width = Math.floor(viewport.width * ratio);
    const height = Math.floor(viewport.height * ratio);
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;

    const transform: number[] | undefined = scale !== 1 ? [scale, 0, 0, scale, 0, 0] : undefined;

    page.render({ canvasContext: context, viewport, transform }).promise.then(() => {
      const textLayer = new TextLayer({
        container: textLayerElement,
        viewport,
        textContentSource: page.streamTextContent(),
      });
      textLayer.render();
    });
  }, [page]);

  return (
    <div className="relative">
      <Box as="canvas" ref={canvasRef} shadow="medium" />
      <div ref={textLayerRef} className="textLayer" />
    </div>
  );
};
