import { useRef, useEffect, useContext, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader } from 'semantic-ui-react';
import { usePdf } from './PdfContext';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

const SongViewPdf = (props: any) => {
  const myRef = useRef<any>();
  const { loading, pdf, currPage } = usePdf();

  useEffect(() => {
    const buildPdf = async () => {
      if (pdf && currPage > 0) {
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
      }
    };
    buildPdf().catch(console.log);
  }, [pdf, currPage]);

  return (
    <>
      {loading && (
        <Loader active inline="centered" size="large" inverted={false} />
      )}
      {!loading && currPage > 0 && (
        <div
          style={{
            textAlign: 'center',
            overflow: 'scroll',
          }}>
          <canvas
            id="pdfViewer"
            style={{
              boxShadow: '2px 2px 12px gray',
              display: 'inline',
              margin: '5px',
            }}
            ref={myRef}
          />
        </div>
      )}
    </>
  );
};

export default SongViewPdf;
