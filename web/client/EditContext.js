// @flow
import React, { useState, useEffect, useContext } from 'react';
import I18n from '../../translations';
import api from './api';
import { getSongFileFromString } from '../../SongsProcessor';
import { DataContext } from './DataContext';

export const EditContext: any = React.createContext();

const emptyNavigation = {
  index: null,
  previousKey: null,
  nextKey: null
};

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
  const [pdf, setPdf] = useState();
  const [navigation, setNavigation] = useState(emptyNavigation);
  const [rename, setRename] = useState();
  const [stage, setStage] = useState();
  const [hasChanges, setHasChanges] = useState(false);
  const [patchLogs, setPatchLogs] = useState();
  const [songFile, setSongFile] = useState();

  const goPrevious = () => {
    if (!hasChanges && navigation && navigation.previousKey) {
      loadSong(navigation.previousKey);
    }
  };

  const goNext = () => {
    if (!hasChanges && navigation && navigation.nextKey) {
      loadSong(navigation.nextKey);
    }
  };

  const closeEditor = () => {
    setEditSong();
    setNavigation(emptyNavigation);
    setText('');
    setRename();
    setStage();
    setHasChanges(false);
    listSongs();
  };

  const loadSong = (songKey: string) => {
    setApiResult();
    setApiLoading(true);
    return api
      .get(`/api/song/${songKey}/${I18n.locale}`)
      .then(result => {
        setApiLoading(false);
        const { song, index, previousKey, nextKey } = result.data;
        setText(song.fullText);
        setEditSong(song);
        setNavigation({ index, previousKey, nextKey });
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

  const previewPdf = () => {
    if (editSong) {
      const savedSettings = localStorage.getItem('pdfExportOptions');
      var data;
      if (savedSettings) {
        data = {
          options: JSON.parse(savedSettings)
        };
      }
      return api
        .post(`/api/pdf/${editSong.key}/${I18n.locale}`, data, {
          responseType: 'blob'
        })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          setPdf(url);
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
              loadSong(editSong.key);
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
          loadSong(editSong.key);
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
        navigation,
        addSong,
        setEditSong,
        setConfirmData,
        confirmClose,
        confirmLogout,
        hasChanges,
        setHasChanges,
        applyChanges,
        goPrevious,
        goNext,
        confirmRemovePatch,
        text,
        pdf,
        setPdf,
        setText,
        rename,
        setRename,
        stage,
        setStage,
        activeDialog,
        previewPdf
      }}>
      {props.children}
    </EditContext.Provider>
  );
};

export default EditContextWrapper;
