// @flow
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import * as axios from 'axios';
import I18n from '../../../translations';
import { getSongFileFromString } from '../../../SongsProcessor';
import { DataContext } from './DataContext';

export const EditContext: any = React.createContext();

const EditContextWrapper = (props: any) => {
  const router = useRouter();
  const data = useContext(DataContext);
  const { song, index, previousKey, nextKey, totalSongs } = props;
  const {
    setApiLoading,
    setApiResult,
    handleApiError,
    setConfirmData,
    activeDialog,
  } = data;

  const [editSong, setEditSong] = useState<Song>(song);
  const [text, setText] = useState('');
  const [pdf, setPdf] = useState({ loading: false, url: null });
  const [name, setName] = useState();
  const [stage, setStage] = useState();
  const [hasChanges, setHasChanges] = useState(false);
  const [patchLogs, setPatchLogs] = useState();
  const [songFile, setSongFile] = useState();

  const goPrevious = () => {
    if (!hasChanges && previousKey) {
      router.replace(`/edit/${I18n.locale}/${previousKey}`);
    }
  };

  const goNext = () => {
    if (!hasChanges && nextKey) {
      router.replace(`/edit/${I18n.locale}/${nextKey}`);
    }
  };

  const closeEditor = () => {
    router.back();
  };

  const previewPdf = () => {
    const postData = {
      text: undefined,
      options: undefined,
    };
    const savedSettings = localStorage.getItem('pdfExportOptions');
    if (savedSettings) {
      postData.options = JSON.parse(savedSettings);
    }
    setPdf({ loading: true, url: null });
    return axios
      .post(`/api/pdf/${I18n.locale}/${editSong.key}`, postData, {
        responseType: 'blob',
      })
      .then((response) => {
        setPdf({
          loading: false,
          url: window.URL.createObjectURL(new Blob([response.data])),
        });
      })
      .catch((err) => {
        handleApiError(err);
        setPdf({ loading: false, url: null });
      });
  };

  const confirmClose = () => {
    if (hasChanges) {
      setConfirmData({
        message: I18n.t('ui.discard confirmation'),
        yes: () => {
          closeEditor();
        },
      });
    } else {
      closeEditor();
    }
  };

  const confirmRemovePatch = () => {
    setConfirmData({
      message: I18n.t('ui.discard confirmation'),
      yes: () => {
        setApiResult();
        setApiLoading(true);
        return axios
          .delete(`/api/song/${editSong.key}/${I18n.locale}`)
          .then((result) => {
            setApiLoading(false);
            router.replace(`/list/${I18n.locale}`);
          })
          .catch((err) => {
            handleApiError(err);
          });
      },
    });
  };

  const applyChanges = () => {
    const patch = {
      lines: text,
      name: name || editSong.nombre,
      stage: stage || editSong.stage,
    };
    setApiResult();
    setApiLoading(true);
    return axios
      .post(`/api/song/${editSong.key}/${I18n.locale}`, patch)
      .then((result) => {
        setApiLoading(false);
        setHasChanges(false);
        setEditSong(result.data.song);
      })
      .catch((err) => {
        handleApiError(err);
      });
  };

  useEffect(() => {
    if (activeDialog === 'patchLog') {
      setPatchLogs();
      setApiResult();
      setApiLoading(true);
      axios
        .get(`/api/patches/${editSong.key}/${I18n.locale}`)
        .then((result) => {
          setApiLoading(false);
          setPatchLogs(result.data);
        })
        .catch((err) => {
          handleApiError(err);
        });
    }
  }, [activeDialog]);

  useEffect(() => {
    if (name) {
      const parsed = getSongFileFromString(name);
      setSongFile(parsed);
    } else {
      setSongFile(editSong);
    }
  }, [name, editSong]);

  useEffect(() => {
    if (editSong) {
      setName(editSong.nombre);
      setStage(editSong.stage);
    }
  }, [editSong]);

  useEffect(() => {
    setEditSong(song);
  }, [song]);

  return (
    <EditContext.Provider
      value={{
        editSong,
        index,
        previousKey,
        nextKey,
        totalSongs,
        songFile,
        patchLogs,
        setConfirmData,
        confirmClose,
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
        name,
        setName,
        stage,
        setStage,
        activeDialog,
        previewPdf,
      }}>
      {props.children}
    </EditContext.Provider>
  );
};

export default EditContextWrapper;
