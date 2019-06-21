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
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader';
import { DataContext } from './DataContext';
import { EditContext } from './EditContext';
import I18n from '../../translations';
import pdfjsLib from 'pdfjs-dist';

const SongViewPdf = (props: any) => {
  const { url } = props;

  const myRef = useRef<any>();
  const [loading, setLoading] = useState(false);
  const [pdf, setPdf] = useState();
  const [numPages, setNumPages] = useState(0);
  const [currPage, setCurrPage] = useState(0);

  const data = useContext(DataContext);
  const { setActiveDialog } = data;

  const edit = useContext(EditContext);
  const { editSong } = edit;

  useEffect(() => {
    if (url !== null) {
      setLoading(true);
      var loadingTask = pdfjsLib.getDocument(url);
      loadingTask.promise
        .then(pdf => {
          setPdf(pdf);
          setCurrPage(1);
          setNumPages(pdf.numPages);
          setLoading(false);
        })
        .catch(err => {
          console.log('error pdf!', err);
          setLoading(false);
        });
    }
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

  const savedSettings = localStorage.getItem('pdfExportOptions');

  return (
    <Fragment>
      <Menu
        size="mini"
        style={{ border: '0px solid transparent', boxShadow: 'none' }}>
        <Menu.Item>
          <Button.Group size="mini">
            <Button
              size="mini"
              floated="right"
              onClick={() => {
                const link = document.createElement('a');
                link.href = url;
                const name = editSong ? editSong.nombre : 'iResucito';
                link.setAttribute('download', `${name}.pdf`);
                if (document.body) document.body.appendChild(link);
                link.click();
                link.remove();
              }}>
              <Icon name="file pdf" />
              {I18n.t('ui.download')}
            </Button>
            <Button
              positive={!!savedSettings}
              size="mini"
              floated="right"
              onClick={() => {
                setActiveDialog('pdfSettings');
              }}>
              <Icon name="setting" />
              {I18n.t('screen_title.settings')}
            </Button>
          </Button.Group>
        </Menu.Item>
        {numPages && (
          <Menu.Item>
            <Button.Group size="mini">
              <Button
                icon
                disabled={currPage === 1}
                onClick={() => setCurrPage(p => p - 1)}>
                <Icon name="step backward" />
              </Button>
              <Button disabled>
                {currPage} / {numPages}
              </Button>
              <Button
                icon
                disabled={currPage === numPages}
                onClick={() => setCurrPage(p => p + 1)}>
                <Icon name="step forward" />
              </Button>
            </Button.Group>
          </Menu.Item>
        )}
      </Menu>
      {loading && (
        <Loader active inline="centered" size="large" inverted={false} />
      )}
      {!loading && currPage > 0 && (
        <canvas
          id="pdfViewer"
          style={{ boxShadow: '2px 2px 15px gray' }}
          ref={myRef}
        />
      )}
    </Fragment>
  );
};

export default SongViewPdf;
