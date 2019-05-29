// @flow
import React, { Fragment, useState, useEffect } from 'react';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message';
import { WebParser, WebStyles } from './WebParser';
import SongViewLines from './SongViewLines';
import I18n from '../../translations';

const SongViewFrame = (props: any) => {
  const { title, source, text } = props;
  const [fRender, setFRender] = useState<?SongRendering>();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const result = WebParser.getForRender(text, I18n.locale);
    // const { bodyStart } = result.lines;
    // setSuggestions([
    //   bodyStart === -1
    //     ? 'Cant detect first line for notes?'
    //     : `Notes detected on line ${bodyStart + 1}`,
    //   !result.clamp
    //     ? 'No clamp position defined'
    //     : `Clamp defined on position ${result.clamp}`
    // ]);
    setFRender(result);
  }, [text]);

  return (
    <Fragment>
      {suggestions.length > 0 && <Message warning list={suggestions} />}
      <Header style={WebStyles.titulo}>
        {title}
        <Header.Subheader style={WebStyles.fuente}>{source}</Header.Subheader>
      </Header>
      {fRender && <SongViewLines lines={fRender.items} />}
    </Fragment>
  );
};

export default SongViewFrame;
