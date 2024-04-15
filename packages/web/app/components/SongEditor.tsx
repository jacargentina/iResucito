import { useContext, useState, useEffect, useRef } from 'react';
import {
  TextArea,
  Icon,
  Popup,
  Segment,
  Message,
  Button,
  Menu,
} from 'semantic-ui-react';
import { useDebouncedCallback } from 'use-debounce';
// TODO No funciona bien en VITE (al refrescar)
//import useHotkeys from 'use-hotkeys';
import { EditContext } from './EditContext';
import { usePdf } from './PdfContext';
import ApiMessage from './ApiMessage';
import SongViewFrame from './SongViewFrame';
import SongViewPdf from './SongViewPdf';
import i18n from '@iresucito/translations';
import { useApp } from '~/app.context';
import Split from 'react-split';

const SongEditor = () => {
  const txtRef = useRef<any>(null);
  const app = useApp();
  const { setActiveDialog, apiResult, handleApiError } = app;

  const edit = useContext(EditContext);

  if (!edit) {
    return null;
  }

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

  const { previewPdf } = usePdf();

  const [debouncedText, setDebouncedText] = useState(text);
  const debounced = useDebouncedCallback((t) => setDebouncedText(t), 800);
  const [linepos, setLinepos] = useState<number>();
  const [colpos, setColpos] = useState<number>();
  const [viewType, setViewType] = useState<'html' | 'pdf'>('html');

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
  };

  const next = () => {
    goNext();
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

  useEffect(() => {
    if (viewType === 'pdf') {
      previewPdf(editSong.key, debouncedText);
    }
  }, [viewType, debouncedText]);

  // useHotkeys(
  //   (key) => {
  //     switch (key) {
  //       case 'ctrl+s':
  //         save();
  //         break;
  //       case 'ctrl+[':
  //         previous();
  //         break;
  //       case 'ctrl+]':
  //         next();
  //         break;
  //       case 'ctrl+e':
  //         editMetadata();
  //         break;
  //       default:
  //         break;
  //     }
  //   },
  //   ['ctrl+s', 'ctrl+[', 'ctrl+]', 'ctrl+e'],
  //   []
  // );

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
                    {i18n.t('ui.edit')}
                  </Button>
                }
              />
            )}
            <Button onClick={() => setActiveDialog('patchLog')}>
              <Icon name="history" />
              {i18n.t('ui.patch log')}
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
                    {i18n.t('ui.apply')}
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
                {i18n.t('ui.remove patch')}
              </Button>
            </Menu.Item>
            <Menu.Item>
              <Button onClick={() => setActiveDialog('diffView')}>
                <Icon name="history" />
                {i18n.t('ui.diff view')}
              </Button>
            </Menu.Item>
          </>
        )}
        <Menu.Item position="right">
          <Button.Group size="mini">
            <Button
              toggle
              active={viewType == 'html'}
              onClick={() => setViewType('html')}>
              HTML
            </Button>
            <Button
              toggle
              active={viewType == 'pdf'}
              onClick={() => setViewType('pdf')}>
              PDF
            </Button>
          </Button.Group>
        </Menu.Item>
        <Menu.Item position="right">
          <Button onClick={confirmClose}>
            <Icon name="close" />
            {i18n.t('ui.close')}
          </Button>
        </Menu.Item>
      </Menu>
      <Split
        sizes={[40, 60]}
        className="split"
        cursor="col-resize"
        dragInterval={1}
        snapOffset={30}
        expandToMin={false}
        minSize={300}>
        <div>
          <ApiMessage />
          {app.user ? (
            <>
              <TextArea
                ref={txtRef}
                onMouseUp={txtPositionEvent}
                style={{
                  fontFamily: 'monospace',
                  backgroundColor: '#fcfcfc',
                  width: '100%',
                  height: '100%',
                  outline: 'none',
                  resize: 'none',
                  border: 0,
                  padding: '10px 20px',
                  overflow: 'scroll',
                  whiteSpace: 'pre',
                }}
                onKeyUp={txtPositionEvent}
                onKeyDown={(e: KeyboardEvent) => {
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
                  const newText = (data.value as string).replace(
                    /\u00A0/g,
                    ' '
                  );
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
                fontFamily: 'monospace',
                backgroundColor: '#fcfcfc',
                width: '100%',
                height: '100%',
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
        <div style={{ overflow: 'scroll', width: '100%', padding: '8px' }}>
          {apiResult && apiResult.path == `/pdf/${editSong.key}` && (
            <Message negative>
              <Message.Header>Error</Message.Header>
              <p>{apiResult.error}</p>
            </Message>
          )}
          {viewType == 'html' && (
            <SongViewFrame
              title={songFile && songFile.titulo}
              source={songFile && songFile.fuente}
              text={debouncedText}
            />
          )}
          {viewType == 'pdf' && <SongViewPdf />}
        </div>
      </Split>
    </>
  );
};

export default SongEditor;
