// @flow
import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  useRef
} from 'react';
import TextArea from 'semantic-ui-react/dist/commonjs/addons/TextArea';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Popup from 'semantic-ui-react/dist/commonjs/modules/Popup';
import Tab from 'semantic-ui-react/dist/commonjs/modules/Tab';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Segment from 'semantic-ui-react/dist/commonjs/elements/Segment';
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
    confirmClose
  } = edit;
  const [debouncedText, setDebouncedText] = useState(text);
  const [callback, , callPending] = useDebouncedCallback(
    text => setDebouncedText(text),
    800
  );

  useEffect(() => {
    if (editSong) {
      callback(text);
      callPending();
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
    }
  };

  const next = () => {
    if (navigation && navigation.nextKey) {
      goNext();
    }
  };

  useHotkeys(
    key => {
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
            {(editSong.patched || editSong.added) && (
              <Button negative onClick={confirmRemovePatch}>
                <Icon name="trash" />
                {I18n.t('ui.remove patch')}
              </Button>
            )}
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
                  'Put "repeat" at the start of the last line in a paragraph to signal a repeated part'
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
          overflow: 'auto'
        }}>
        <TextArea
          ref={txtRef}
          style={{
            fontFamily: 'monospace',
            backgroundColor: '#fcfcfc',
            width: '50%',
            outline: 'none',
            resize: 'none',
            border: 0,
            padding: '10px 20px',
            overflowY: 'scroll'
          }}
          onKeyDown={e => {
            if (e.ctrlKey) {
              if (e.key == '[') {
                e.preventDefault();
                previous();
              } else if (e.key == ']') {
                e.preventDefault();
                next();
              } else if (e.key == 'e') {
                e.preventDefault();
                editMetadata();
              } else if (e.key == 's') {
                e.preventDefault();
                save();
              }
            }
          }}
          value={text}
          onChange={(e, data) => {
            setHasChanges(true);
            setText(data.value);
            callback(data.value);
          }}
        />
        <div
          style={{
            width: '50%',
            overflowY: 'scroll'
          }}>
          <Tab
            onTabChange={(e, data) => {
              if (data.activeIndex == 1) {
                previewPdf();
              } else {
                setPdf();
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
                        border: '0px transparent'
                      }}>
                      <SongViewFrame
                        title={songFile && songFile.titulo}
                        source={songFile && songFile.fuente}
                        text={debouncedText}
                      />
                    </Tab.Pane>
                  );
                }
              },
              {
                menuItem: I18n.t('share_action.view pdf'),
                key: 'pdf',
                render: () => {
                  return (
                    <Tab.Pane
                      loading={!pdf}
                      style={{
                        minHeight: '50vh',
                        border: '0px transparent'
                      }}>
                      {pdf && <SongViewPdf url={pdf} />}
                    </Tab.Pane>
                  );
                }
              }
            ]}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default SongEditor;
