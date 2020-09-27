// @flow
import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import TextArea from 'semantic-ui-react/dist/commonjs/addons/TextArea';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Popup from 'semantic-ui-react/dist/commonjs/modules/Popup';
import Tab from 'semantic-ui-react/dist/commonjs/modules/Tab';
import Segment from 'semantic-ui-react/dist/commonjs/elements/Segment';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import { DataContext } from './DataContext';
import { EditContext } from './EditContext';
import SongViewFrame from './SongViewFrame';
import SongViewPdf from './SongViewPdf';
import { useDebouncedCallback } from 'use-debounce';
import I18n from '../../translations';
import useHotkeys from 'use-hotkeys';

const SongEditor = () => {
  const txtRef = useRef(null);
  const data = useContext(DataContext);
  const { setActiveDialog, songs } = data;

  const edit = useContext(EditContext);
  const {
    editSong,
    navigation,
    text,
    pdf,
    setPdf,
    setText,
    setHasChanges,
    songFile,
    previewPdf,
    confirmRemovePatch,
    hasChanges,
    applyChanges,
    goPrevious,
    goNext,
    confirmClose,
  } = edit;
  const [debouncedText, setDebouncedText] = useState(text);
  const debounced = useDebouncedCallback((t) => setDebouncedText(t), 800);
  const [activeTab, setActiveTab] = useState(0);
  const [linepos, setLinepos] = useState();
  const [colpos, setColpos] = useState();

  useEffect(() => {
    if (editSong) {
      debounced.callback(text);
      debounced.pending();
      setLinepos(1);
      setColpos(1);
      if (txtRef && txtRef.current) {
        txtRef.current.ref.current.selectionStart = 0;
        txtRef.current.ref.current.selectionEnd = 0;
        txtRef.current.focus();
      }
    }
  }, [editSong]);

  const editMetadata = () => {
    if (editSong) {
      setActiveDialog('changeMetadata');
    }
  };

  const save = () => {
    if (editSong && hasChanges) {
      applyChanges();
    }
  };

  const previous = () => {
    if (navigation && navigation.previousKey) {
      goPrevious();
      setActiveTab(0);
    }
  };

  const next = () => {
    if (navigation && navigation.nextKey) {
      goNext();
      setActiveTab(0);
    }
  };

  const txtPositionEvent = () => {
    if (txtRef && txtRef.current) {
      var textarea = txtRef.current.ref.current;
      var line = textarea.value.substr(0, textarea.selectionStart).split('\n')
        .length;
      var col =
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
      }
    },
    ['ctrl+s', 'ctrl+[', 'ctrl+]', 'ctrl+e'],
    [editSong]
  );

  if (!editSong) {
    return null;
  }

  return (
    <Fragment>
      <Menu size="mini" inverted attached color="blue">
        <Menu.Item>
          <Button.Group size="mini">
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
            <Button onClick={() => setActiveDialog('patchLog')}>
              <Icon name="history" />
              {I18n.t('ui.patch log')}
            </Button>
            <Popup
              content={<strong>Shortcut: Ctrl + S</strong>}
              size="mini"
              position="bottom left"
              trigger={
                <Button
                  positive={hasChanges}
                  disabled={!hasChanges}
                  onClick={applyChanges}>
                  <Icon name="save" />
                  {I18n.t('ui.apply')}
                </Button>
              }
            />
          </Button.Group>
        </Menu.Item>
        {navigation && (
          <Fragment>
            {navigation.index !== null && (
              <Menu.Item>
                <strong style={{ marginLeft: 10, marginRight: 10 }}>
                  {navigation.index} / {songs.length}
                </strong>
              </Menu.Item>
            )}
            {(navigation.previousKey || navigation.nextKey) && (
              <Menu.Item>
                <Button.Group size="mini">
                  <Popup
                    content={<strong>Shortcut: Ctrl + [</strong>}
                    size="mini"
                    position="bottom left"
                    trigger={
                      <Button
                        icon
                        disabled={navigation.previousKey === null || hasChanges}
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
                        disabled={navigation.nextKey === null || hasChanges}
                        onClick={next}>
                        <Icon name="step forward" />
                      </Button>
                    }
                  />
                </Button.Group>
              </Menu.Item>
            )}
          </Fragment>
        )}
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
        {(editSong.patched || editSong.added) && (
          <Menu.Item>
            <Button negative onClick={confirmRemovePatch}>
              <Icon name="trash" />
              {I18n.t('ui.remove patch')}
            </Button>
          </Menu.Item>
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
              overflowY: 'scroll',
              whiteSpace: 'nowrap',
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
              setText(data.value);
              debounced.callback(data.value);
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
                setPdf({ loading: false, url: null });
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
                      loading={pdf.loading}
                      style={{
                        minHeight: '50vh',
                        border: '0px transparent',
                      }}>
                      {!pdf.loading && <SongViewPdf url={pdf.url} />}
                    </Tab.Pane>
                  );
                },
              },
            ]}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default SongEditor;
