import { useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Box, CircularProgress } from '@mui/material';
import { usePdf } from './PdfContext';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

const SongViewPdf = (props: any) => {
  const myRef = useRef<any>(null);
  const { loading, pdf, currPage } = usePdf();

  useEffect(() => {
    const buildPdf = async (pdf: pdfjsLib.PDFDocumentProxy) => {
      const page = await pdf.getPage(currPage);
      const viewport = page.getViewport({ scale: 1.2 });
      const canvas = myRef.current;

      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      page.render({
        canvasContext: context,
        viewport,
      });
    };
    if (pdf && currPage > 0) {
      buildPdf(pdf).catch(console.log);
    }
  }, [pdf, currPage]);

  return (
    <>
      {loading && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent:  'center',
            py: 4,
          }}>
          <CircularProgress />
        </Box>
      )}
      {!loading && currPage > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 2,
          }}>
          <canvas
            id="pdfViewer"
            style={{
              boxShadow: '2px 2px 12px gray',
              margin:  'auto',
              maxWidth: '100%',
              height: 'auto',
            }}
            ref={myRef}
          />
        </Box>
      )}
    </>
  );
};

export default SongViewPdf;