import React, { useState, useEffect } from 'react';
import * as axios from 'axios';
import I18n from '~/translations';
import { getSongFileFromString } from '~/SongsProcessor';
import { useNavigate } from 'remix';
import { useApp } from '~/app.context';

export const EditContext: any = React.createContext();

const EditContextWrapper = (props: any) => {
  const navigate = useNavigate();
  const app = useApp();
  const { song, index, previousKey, nextKey, totalSongs } = props;
  const {
    setApiLoading,
    setApiResult,
    handleApiError,
    setConfirmData,
    activeDialog,
  } = app;

  const [editSong, setEditSong] = useState<Song>(song);
  const [text, setText] = useState('');
  const [name, setName] = useState();
  const [stage, setStage] = useState();
  const [hasChanges, setHasChanges] = useState(false);
  const [patchLogs, setPatchLogs] = useState();
  const [diffView, setDiffView] = useState();
  const [songFile, setSongFile] = useState();

  const goPrevious = () => {
    if (!hasChanges && previousKey) {
      navigate(`/edit/${previousKey}`);
    }
  };

  const goNext = () => {
    if (!hasChanges && nextKey) {
      navigate(`/edit/${nextKey}`);
    }
  };

  const confirmClose = () => {
    if (hasChanges) {
      setConfirmData({
        message: I18n.t('ui.discard confirmation'),
        yes: () => {
          navigate('/list');
        },
      });
    } else {
      navigate('/list');
    }
  };

  const confirmRemovePatch = () => {
    setConfirmData({
      message: I18n.t('ui.discard confirmation'),
      yes: () => {
        setApiResult();
        setApiLoading(true);
        return axios
          .delete(`/song/${editSong.key}`)
          .then((result) => {
            setApiLoading(false);
            navigate('/list');
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
      .post(`/song/${editSong.key}`, patch)
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
        .get(`/patches/${editSong.key}`)
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
    if (activeDialog === 'diffView') {
      setDiffView();
      setApiResult();
      setApiLoading(true);
      axios
        .get(`/diff/${editSong.key}`)
        .then((result) => {
          setApiLoading(false);
          setDiffView(result.data.diff);
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
        diffView,
        setConfirmData,
        confirmClose,
        hasChanges,
        setHasChanges,
        applyChanges,
        goPrevious,
        goNext,
        confirmRemovePatch,
        text,
        setText,
        name,
        setName,
        stage,
        setStage,
        activeDialog,
      }}>
      {props.children}
    </EditContext.Provider>
  );
};

export default EditContextWrapper;
