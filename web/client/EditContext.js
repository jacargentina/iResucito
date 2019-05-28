// @flow
import React, { useState, useEffect, useContext } from 'react';
import I18n from '../../translations';
import api from './api';
import { getSongFileFromString } from '../../SongsProcessor';
import { DataContext } from './DataContext';

export const EditContext: any = React.createContext();

const EditContextWrapper = (props: any) => {
  const data = useContext(DataContext);
  const {
    locale,
    editSong,
    setEditSong,
    setApiLoading,
    setApiResult,
    handleApiError,
    setConfirmData,
    activeDialog
  } = data;
  const [text, setText] = useState('');
  const [rename, setRename] = useState();
  const [stage, setStage] = useState();
  const [hasChanges, setHasChanges] = useState(false);
  const [patchLogs, setPatchLogs] = useState();
  const [songFile, setSongFile] = useState();

  const closeEditor = () => {
    setEditSong();
    setText('');
    setRename();
    setHasChanges(false);
  };

  const loadSong = song => {
    setApiResult();
    setApiLoading(true);
    return api
      .get(`/api/song/${song.key}/${locale}`)
      .then(result => {
        setApiLoading(false);
        const song = result.data;
        setText(song.fullText);
        setEditSong(song);
        setHasChanges(false);
      })
      .catch(err => {
        handleApiError(err);
      });
  };

  const confirmClose = () => {
    if (hasChanges) {
      setConfirmData({
        message: I18n.t('ui.discard confirmation'),
        yes: () => {
          closeEditor();
        }
      });
    } else {
      closeEditor();
    }
  };

  const confirmRemovePatch = () => {
    setConfirmData({
      message: I18n.t('ui.discard confirmation'),
      yes: () => {
        if (editSong) {
          setApiResult();
          setApiLoading(true);
          return api
            .delete(`/api/song/${editSong.key}/${locale}`)
            .then(() => {
              setApiLoading(false);
              // Recargar sin los cambios previos
              loadSong(editSong);
            })
            .catch(err => {
              handleApiError(err);
            });
        }
      }
    });
  };

  const applyChanges = () => {
    if (editSong) {
      var patch = {
        lines: text,
        rename: rename || editSong.nombre,
        stage: stage || editSong.stage
      };
      setApiResult();
      setApiLoading(true);
      return api
        .post(`/api/song/${editSong.key}/${locale}`, patch)
        .then(() => {
          setApiLoading(false);
          setHasChanges(false);
          // Recargar el canto
          loadSong(editSong);
        })
        .catch(err => {
          handleApiError(err);
        });
    }
  };

  const confirmLogout = (logoutFunc: Function) => {
    if (hasChanges) {
      setConfirmData({
        message: I18n.t('ui.discard confirmation'),
        yes: () => {
          logoutFunc();
        }
      });
    } else {
      logoutFunc();
    }
  };

  useEffect(() => {
    if (editSong && activeDialog === 'patchLog') {
      setPatchLogs();
      setApiResult();
      setApiLoading(true);
      api
        .get(`/api/patches/${editSong.key}/${locale}`)
        .then(result => {
          setApiLoading(false);
          setPatchLogs(result.data);
        })
        .catch(err => {
          handleApiError(err);
        });
    }
  }, [editSong, activeDialog]);

  useEffect(() => {
    if (rename) {
      const parsed = getSongFileFromString(rename);
      setSongFile(parsed);
    } else {
      setSongFile(editSong);
    }
  }, [rename, editSong]);

  return (
    <EditContext.Provider
      value={{
        locale,
        editSong,
        songFile,
        patchLogs,
        loadSong,
        setEditSong,
        setConfirmData,
        confirmClose,
        confirmLogout,
        hasChanges,
        setHasChanges,
        applyChanges,
        confirmRemovePatch,
        text,
        setText,
        rename,
        setRename,
        stage,
        setStage,
        activeDialog
      }}>
      {props.children}
    </EditContext.Provider>
  );
};

export default EditContextWrapper;
