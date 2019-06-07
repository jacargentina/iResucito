// @flow
import React, { Fragment, useRef, useEffect, useContext } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import { EditContext } from './EditContext';
import pdfjsLib from 'pdfjs-dist';

const SongViewPdf = (props: any) => {
  const { url } = props;

  const myRef = useRef<any>();

  const edit = useContext(EditContext);
  const { editSong } = edit;

  useEffect(() => {
    var loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise
      .then(pdf => {
        // Fetch the first page
        var pageNumber = 1;
        pdf.getPage(pageNumber).then(page => {
          var viewport = page.getViewport(1.5);
          // Prepare canvas using PDF page dimensions
          var canvas = myRef.current;
          var context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          // Render PDF page into canvas context
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          var renderTask = page.render(renderContext);
          renderTask.promise.then(() => {
            console.log('Page rendered');
          });
        });
      })
      .catch(err => {
        console.log('error pdf!', err);
      });
  }, [url]);

  return (
    <Fragment>
      <Button
        size="mini"
        floated="right"
        onClick={() => {
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', editSong.nombre);
          if (document.body) document.body.appendChild(link);
          link.click();
          link.remove();
        }}>
        Descargar
      </Button>
      <canvas id="pdfViewer" ref={myRef} />
    </Fragment>
  );
};

export default SongViewPdf;
