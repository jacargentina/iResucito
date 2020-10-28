// @flow
import React, { useRef, useEffect, useContext, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Icon, Button, Menu, Loader } from 'semantic-ui-react';
import { DataContext } from './DataContext';
import { EditContext } from './EditContext';
import I18n from '../../../translations';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

const SongViewPdf = (props: any) => {
  const { url, settingsChanged } = props;

  const myRef = useRef<any>();
  const [loading, setLoading] = useState(false);
  const [pdf, setPdf] = useState();
  const [numPages, setNumPages] = useState();
  const [currPage, setCurrPage] = useState(0);

  const data = useContext(DataContext);
  const { setActiveDialog, setDialogCallback } = data;

  const edit = useContext(EditContext);

  useEffect(() => {
    if (url !== null) {
      setLoading(true);
      const loadingTask = pdfjsLib.getDocument(url);
      loadingTask.promise
        .then((doc) => {
          setPdf(doc);
          setCurrPage(1);
          setNumPages(doc.numPages);
          setLoading(false);
        })
        .catch((err) => {
          console.log('error pdf!', err);
          setLoading(false);
        });
    }
  }, [url]);

  useEffect(() => {
    if (pdf && currPage > 0) {
      pdf.getPage(currPage).then((page) => {
        const viewport = page.getViewport({ scale: 1.3 });
        const canvas = myRef.current;

        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        page.render({
          canvasContext: context,
          viewport,
        });
      });
    }
  }, [pdf, currPage]);

  const savedSettings = localStorage.getItem('pdfExportOptions');

  return (
    <>
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
                const name = edit ? edit.editSong.nombre : 'iResucito';
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
                setDialogCallback(() => settingsChanged);
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
                onClick={() => setCurrPage((p) => p - 1)}>
                <Icon name="step backward" />
              </Button>
              <Button disabled>
                {currPage} / {numPages}
              </Button>
              <Button
                icon
                disabled={currPage === numPages}
                onClick={() => setCurrPage((p) => p + 1)}>
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
        <div style={{ textAlign: 'center' }}>
          <canvas
            id="pdfViewer"
            style={{ boxShadow: '2px 2px 15px gray', display: 'inline' }}
            ref={myRef}
          />
        </div>
      )}
    </>
  );
};

export default SongViewPdf;
