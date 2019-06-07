// @flow
import React, {
  Fragment,
  useRef,
  useEffect,
  useContext,
  useState
} from 'react';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import { EditContext } from './EditContext';
import pdfjsLib from 'pdfjs-dist';

const SongViewPdf = (props: any) => {
  const { url } = props;

  const myRef = useRef<any>();
  const [pdf, setPdf] = useState();
  const [numPages, setNumPages] = useState(0);
  const [currPage, setCurrPage] = useState(0);

  const edit = useContext(EditContext);
  const { editSong } = edit;

  useEffect(() => {
    var loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise
      .then(pdf => {
        setPdf(pdf);
        setCurrPage(1);
        setNumPages(pdf.numPages);
      })
      .catch(err => {
        console.log('error pdf!', err);
      });
  }, [url]);

  useEffect(() => {
    if (pdf && currPage > 0) {
      pdf.getPage(currPage).then(page => {
        var viewport = page.getViewport(1.3);
        var canvas = myRef.current;

        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        page.render({
          canvasContext: context,
          viewport: viewport
        });
      });
    }
  }, [pdf, currPage]);

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
      {numPages && (
        <Fragment>
          <Button
            size="mini"
            floated="right"
            icon
            disabled={currPage === numPages}
            onClick={() => setCurrPage(p => p + 1)}>
            <Icon name="step forward" />
          </Button>
          <Button floated="right" size="mini" disabled>
            {currPage} / {numPages}
          </Button>
          <Button
            size="mini"
            floated="right"
            icon
            disabled={currPage === 1}
            onClick={() => setCurrPage(p => p - 1)}>
            <Icon name="step backward" />
          </Button>
        </Fragment>
      )}
      <canvas id="pdfViewer" ref={myRef} />
    </Fragment>
  );
};

export default SongViewPdf;
