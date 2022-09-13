import React, { useState, useEffect } from 'react';
import I18n from '@iresucito/translations';
import { useNavigate } from '@remix-run/react';
import { getSongFileFromString, Song, SongChangesAndPatches, SongFile } from '@iresucito/core';
import { useApp } from '~/app.context';

export type EditContextType = {
  editSong: any;
  index: any;
  previousKey: any;
  nextKey: any;
  totalSongs: any;
  songFile: any;
  patchLogs: SongChangesAndPatches;
  diffView: any;
  setConfirmData: any;
  confirmClose: any;
  hasChanges: any;
  setHasChanges: any;
  applyChanges: any;
  goPrevious: any;
  goNext: any;
  confirmRemovePatch: any;
  text: any;
  setText: any;
  name: any;
  setName: any;
  stage: any;
  setStage: any;
  activeDialog: any;
};

export const EditContext: any = React.createContext<
  EditContextType | undefined
>(undefined);

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
  const [patchLogs, setPatchLogs] = useState<
    SongChangesAndPatches | undefined
  >();
  const [diffView, setDiffView] = useState<any>();
  const [songFile, setSongFile] = useState<SongFile>();

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
        return fetch(`/song/${editSong.key}`, { method: 'DELETE' })
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
    return fetch(`/song/${editSong.key}`, {
      method: 'POST',
      body: JSON.stringify(patch),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setApiLoading(false);
        setHasChanges(false);
        setEditSong(data.song);
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
      fetch(`/patches/${editSong.key}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setApiLoading(false);
          setPatchLogs(data);
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
      fetch(`/diff/${editSong.key}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setApiLoading(false);
          setDiffView(data.diff);
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
