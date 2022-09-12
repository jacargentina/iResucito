import { useContext, useState, useEffect, useRef } from 'react';
import {
  TextArea,
  Icon,
  Popup,
  Tab,
  Segment,
  Message,
  Button,
  Menu,
} from 'semantic-ui-react';
import { useDebouncedCallback } from 'use-debounce';
import useHotkeys from 'use-hotkeys';
import { EditContext } from './EditContext';
import ApiMessage from './ApiMessage';
import SongViewFrame from './SongViewFrame';
import SongViewPdf from './SongViewPdf';
import I18n from '@iresucito/translations';
import { useApp } from '~/app.context';

const SongEditor = () => {
  const txtRef = useRef(null);
  const [pdfUrl, setPdfUrl] = useState();
  const [loading, setLoading] = useState(false);
  const app = useApp();
  const { setActiveDialog, handleApiError } = app;

  const edit = useContext(EditContext);
  const {
    editSong,
    index,
    previousKey,
    nextKey,
    totalSongs,
    text,
    setText,
    setHasChanges,
    songFile,
    confirmRemovePatch,
    hasChanges,
    applyChanges,
    goPrevious,
    goNext,
    confirmClose,
  } = edit;

  const previewPdf = () => {
    const formData = new FormData();
    formData.append('text', text);
    const savedSettings = localStorage.getItem('pdfExportOptions');
    if (savedSettings) {
      formData.append('options', savedSettings);
    }
    setLoading(false);
    setPdfUrl(undefined);
    fetch(`/pdf/${editSong.key}`, { method: 'POST', body: formData })
      .then((response) => {
        return response.blob();
      })
      .then((data) => {
        setLoading(false);
        setPdfUrl(window.URL.createObjectURL(new Blob([data])));
      })
      .catch(async (err) => {
        const errText = await new Response(err.response.data).text();
        handleApiError(errText);
        setLoading(false);
        setPdfUrl();
      });
  };

  const [debouncedText, setDebouncedText] = useState(text);
  const debounced = useDebouncedCallback((t) => setDebouncedText(t), 800);
  const [activeTab, setActiveTab] = useState(0);
  const [linepos, setLinepos] = useState();
  const [colpos, setColpos] = useState();

  useEffect(() => {
    setDebouncedText(editSong.fullText);
    setText(editSong.fullText);
    setLinepos(1);
    setColpos(1);
    if (txtRef && txtRef.current) {
      txtRef.current.ref.current.selectionStart = 0;
      txtRef.current.ref.current.selectionEnd = 0;
      txtRef.current.focus();
    }
  }, [editSong]);

  const editMetadata = () => {
    if (app.user) {
      setActiveDialog('changeMetadata');
    }
  };

  const save = () => {
    if (app.user && hasChanges) {
      applyChanges();
    }
  };

  const previous = () => {
    goPrevious();
    setActiveTab(0);
  };

  const next = () => {
    goNext();
    setActiveTab(0);
  };

  const txtPositionEvent = () => {
    if (txtRef && txtRef.current) {
      const textarea = txtRef.current.ref.current;
      const line = textarea.value
        .substr(0, textarea.selectionStart)
        .split('\n').length;
      const col =
        textarea.selectionStart -
        textarea.value.lastIndexOf('\n', textarea.selectionStart - 1);
      setLinepos(line);
      setColpos(col);
    }
  };

  useHotkeys(
    (key) => {
      switch (key) {
        case 'ctrl+s':
          save();
          break;
        case 'ctrl+[':
          previous();
          break;
        case 'ctrl+]':
          next();
          break;
        case 'ctrl+e':
          editMetadata();
          break;
        default:
          break;
      }
    },
    ['ctrl+s', 'ctrl+[', 'ctrl+]', 'ctrl+e'],
    []
  );

  return (
    <>
      <Menu size="mini" inverted attached color="blue">
        <Menu.Item>
          <Button.Group size="mini">
            {app.user && (
              <Popup
                content={<strong>Shortcut: Ctrl + E</strong>}
                size="mini"
                position="bottom left"
                trigger={
                  <Button onClick={editMetadata}>
                    <Icon name="edit" />
                    {I18n.t('ui.edit')}
                  </Button>
                }
              />
            )}
            <Button onClick={() => setActiveDialog('patchLog')}>
              <Icon name="history" />
              {I18n.t('ui.patch log')}
            </Button>
            {app.user && (
              <Popup
                content={<strong>Shortcut: Ctrl + S</strong>}
                size="mini"
                position="bottom left"
                trigger={
                  <Button
                    positive={hasChanges}
                    disabled={!hasChanges}
                    onClick={save}>
                    <Icon name="save" />
                    {I18n.t('ui.apply')}
                  </Button>
                }
              />
            )}
          </Button.Group>
        </Menu.Item>
        <>
          {index !== null && (
            <Menu.Item>
              <strong style={{ marginLeft: 10, marginRight: 10 }}>
                {index} / {totalSongs}
              </strong>
            </Menu.Item>
          )}
          {(previousKey || nextKey) && (
            <Menu.Item>
              <Button.Group size="mini">
                <Popup
                  content={<strong>Shortcut: Ctrl + [</strong>}
                  size="mini"
                  position="bottom left"
                  trigger={
                    <Button
                      icon
                      disabled={previousKey === null || hasChanges}
                      onClick={previous}>
                      <Icon name="step backward" />
                    </Button>
                  }
                />
                <Popup
                  content={<strong>Shortcut: Ctrl + ]</strong>}
                  size="mini"
                  position="bottom left"
                  trigger={
                    <Button
                      icon
                      disabled={nextKey === null || hasChanges}
                      onClick={next}>
                      <Icon name="step forward" />
                    </Button>
                  }
                />
              </Button.Group>
            </Menu.Item>
          )}
        </>
        {app.user && (
          <Menu.Item>
            <Popup
              header="Tips"
              size="small"
              content={
                <Message
                  list={[
                    'Move the pointer to the buttons to learn the shortcuts; edit and navigate faster using only your keyboard!',
                    'If present, title/source must be deleted from the heading to not be painted twice',
                    'Put "clamp: x" at the start of any empty line to signal clamp position',
                    'Put "repeat" at the start of the last line in a paragraph to signal a repeated part',
                    'PDF: Put "column" at the start of a line to signal start of second column',
                  ]}
                />
              }
              position="bottom left"
              trigger={
                <Button icon>
                  <Icon name="help" />
                </Button>
              }
            />
          </Menu.Item>
        )}
        {app.user && (editSong.patched || editSong.added) && (
          <>
            <Menu.Item>
              <Button negative onClick={confirmRemovePatch}>
                <Icon name="trash" />
                {I18n.t('ui.remove patch')}
              </Button>
            </Menu.Item>
            <Menu.Item>
              <Button onClick={() => setActiveDialog('diffView')}>
                <Icon name="history" />
                {I18n.t('ui.diff view')}
              </Button>
            </Menu.Item>
          </>
        )}
        <Menu.Item position="right">
          <Button onClick={confirmClose}>
            <Icon name="close" />
            {I18n.t('ui.close')}
          </Button>
        </Menu.Item>
      </Menu>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          overflow: 'auto',
        }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
          <ApiMessage />
          {app.user ? (
            <>
              <TextArea
                ref={txtRef}
                onMouseUp={txtPositionEvent}
                style={{
                  flex: 1,
                  fontFamily: 'monospace',
                  backgroundColor: '#fcfcfc',
                  width: '100%',
                  outline: 'none',
                  resize: 'none',
                  border: 0,
                  padding: '10px 20px',
                  overflow: 'scroll',
                  whiteSpace: 'pre',
                }}
                onKeyUp={txtPositionEvent}
                onKeyDown={(e) => {
                  if (e.ctrlKey) {
                    if (e.key === '[') {
                      e.preventDefault();
                      previous();
                    } else if (e.key === ']') {
                      e.preventDefault();
                      next();
                    } else if (e.key === 'e') {
                      e.preventDefault();
                      editMetadata();
                    } else if (e.key === 's') {
                      e.preventDefault();
                      save();
                    }
                  }
                }}
                value={text}
                onChange={(e, data) => {
                  setHasChanges(true);
                  const newText = data.value.replace(/\u00A0/g, ' ');
                  setText(newText);
                  debounced(newText);
                }}
              />
              <Segment
                basic
                inverted
                color="blue"
                style={{
                  flex: 0,
                  margin: 0,
                  padding: '3px 10px',
                }}>
                Line: {linepos}, Column: {colpos}
              </Segment>
            </>
          ) : (
            <TextArea
              readOnly
              style={{
                flex: 1,
                fontFamily: 'monospace',
                backgroundColor: '#fcfcfc',
                width: '100%',
                outline: 'none',
                resize: 'none',
                border: 0,
                padding: '10px 20px',
                overflow: 'scroll',
                whiteSpace: 'pre',
              }}
              value={text}
            />
          )}
        </div>
        <div
          style={{
            width: '50%',
            overflowY: 'scroll',
          }}>
          <Tab
            activeIndex={activeTab}
            onTabChange={(e, data) => {
              setActiveTab(data.activeIndex);
              if (data.activeIndex === 1) {
                previewPdf();
              } else {
                setPdfUrl();
              }
            }}
            menu={{ size: 'mini', pointing: true }}
            panes={[
              {
                menuItem: 'HTML',
                key: 'html',
                render: () => {
                  return (
                    <Tab.Pane
                      style={{
                        fontFamily: 'Franklin Gothic Medium',
                        border: '0px transparent',
                      }}>
                      <SongViewFrame
                        title={songFile && songFile.titulo}
                        source={songFile && songFile.fuente}
                        text={debouncedText}
                      />
                    </Tab.Pane>
                  );
                },
              },
              {
                menuItem: I18n.t('share_action.view pdf'),
                key: 'pdf',
                render: () => {
                  return (
                    <Tab.Pane
                      loading={loading}
                      style={{
                        minHeight: '50vh',
                        border: '0px transparent',
                      }}>
                      {!loading && pdfUrl && (
                        <SongViewPdf
                          url={pdfUrl}
                          settingsChanged={previewPdf}
                        />
                      )}
                    </Tab.Pane>
                  );
                },
              },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default SongEditor;
