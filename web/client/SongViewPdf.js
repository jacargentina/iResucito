// @flow
import React, { Fragment, useRef, useEffect, useContext } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import { EditContext } from './EditContext';
import pdfjsLib from 'pdfjs-dist';

const SongViewPdf = (props: any) => {
  const { url } = props;

  const myRef = useRef();

  const edit = useContext(EditContext);
  const { editSong } = edit;

  useEffect(() => {
    var loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise
      .then(pdf => {
        // Fetch the first page
        var pageNumber = 1;
        pdf.getPage(pageNumber).then(function(page) {
          console.log('Page loaded');

          var scale = 1.5;
          var viewport = page.getViewport({ scale: scale });

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
          renderTask.promise.then(function() {
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
        as="a"
        onClick={() => {
          // TODO
          // descargar como  editSong.nombre
        }}>
        Descargar {editSong.nombre}
      </Button>
      <canvas id="pdfViewer" ref={myRef} />
    </Fragment>
  );
};

export default SongViewPdf;
