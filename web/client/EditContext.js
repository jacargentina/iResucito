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
    editSong,
    listSongs,
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
    setStage();
    setHasChanges(false);
    listSongs();
  };

  const loadSong = song => {
    setApiResult();
    setApiLoading(true);
    return api
      .get(`/api/song/${song.key}/${I18n.locale}`)
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

  const addSong = (untranslatedSong: Song) => {
    // Crear version traducida
    if (untranslatedSong) {
      const newSong = {
        key: untranslatedSong.key,
        nombre: `Translate name [${untranslatedSong.nombre}]`,
        titulo: `Translate title [${untranslatedSong.titulo}]`,
        stage: 'precatechumenate'
      };
      setText('New translated song text here.');
      setEditSong(newSong);
    } else {
      setApiResult();
      setApiLoading(true);
      return api
        .get('/api/song/newKey')
        .then(result => {
          setApiLoading(false);
          const newSong = {
            key: result.data.key,
            nombre: 'New song',
            titulo: 'New song',
            stage: 'precatechumenate'
          };
          setText('Song text here.');
          setEditSong(newSong);
        })
        .catch(err => {
          handleApiError(err);
        });
    }
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
            .delete(`/api/song/${editSong.key}/${I18n.locale}`)
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
        .post(`/api/song/${editSong.key}/${I18n.locale}`, patch)
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
        .get(`/api/patches/${editSong.key}/${I18n.locale}`)
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
        editSong,
        songFile,
        patchLogs,
        loadSong,
        addSong,
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
