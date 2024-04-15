import React, { useCallback, useContext, useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { EditContext } from './EditContext';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

export type PdfContextType = {
  previewPdf: (songKey: string, songText: string) => void;
  pdfUrl: string | undefined;
  setPdfUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
  pdf: pdfjsLib.PDFDocumentProxy | undefined;
  setPdf: React.Dispatch<
    React.SetStateAction<pdfjsLib.PDFDocumentProxy | undefined>
  >;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  numPages: number | undefined;
  currPage: number;
  setCurrPage: React.Dispatch<React.SetStateAction<number>>;
  downloadPdf: () => void;
  closePdf: () => void;
};

export const PdfContext = React.createContext<PdfContextType | undefined>(
  undefined
);

const PdfContextWrapper = (props: any) => {
  const [pdfUrl, setPdfUrl] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | undefined>();
  const [numPages, setNumPages] = useState<number | undefined>();
  const [currPage, setCurrPage] = useState(0);
  const edit = useContext(EditContext);

  const previewPdf = useCallback((songKey: string, songText: string) => {
    const formData = new FormData();
    formData.append('text', songText);
    const savedSettings = localStorage.getItem('pdfExportOptions');
    if (savedSettings) {
      formData.append('options', savedSettings);
    }
    setLoading(true);
    fetch(`/pdf/${songKey}`, { method: 'POST', body: formData })
      .then((response) => {
        if (response.ok == true) {
          return response.blob();
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setLoading(false);
        if (data instanceof Blob) {
          setPdfUrl(window.URL.createObjectURL(new Blob([data])));
        } else {
          setPdfUrl(undefined);
          // TODO
          // handleApiError(`/pdf/${songKey}`, data.error);
        }
      });
  }, []);

  useEffect(() => {
    if (pdfUrl) {
      setLoading(true);
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      loadingTask.promise
        .then((doc) => {
          setPdf(doc);
          setCurrPage(1);
          setNumPages(doc.numPages);
          setLoading(false);
        })
        .catch((err) => {
          console.log('error pdf!', err);
          setLoading(false);
        });
    }
  }, [pdfUrl]);

  const downloadPdf = useCallback(() => {
    if (pdfUrl == null) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    const name = edit ? edit.editSong.nombre : 'iResucito';
    link.setAttribute('download', `${name}.pdf`);
    if (document.body) document.body.appendChild(link);
    link.click();
    link.remove();
  }, []);

  const closePdf = () => {
    setPdfUrl(undefined);
    setPdf(undefined);
  };

  return (
    <PdfContext.Provider
      value={{
        previewPdf,
        pdfUrl,
        setPdfUrl,
        loading,
        setLoading,
        pdf,
        setPdf,
        numPages,
        currPage,
        setCurrPage,
        downloadPdf,
        closePdf,
      }}>
      {props.children}
    </PdfContext.Provider>
  );
};

export const usePdf = () => {
  const context = useContext(PdfContext);
  if (!context) {
    throw new Error('usePdf no encuentra un PdfContext contenedor.');
  }
  return context;
};

export default PdfContextWrapper;
