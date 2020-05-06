// @flow
import React, { useContext, useEffect, useState, useRef } from 'react';
import { ScrollView } from 'react-native';
import { Button, Text, Segment } from 'native-base';
import ModalView from './ModalView';
import SongList from './SongList';
import { DataContext } from '../DataContext';
import commonTheme from '../native-base-theme/variables/platform';
import I18n from '../../translations';

const SongChooserDialog = (props: any) => {
  const data = useContext(DataContext);
  const scrollToActiveRef = useRef<?ScrollView>();
  const { navigation, route } = props;
  const { searchItems } = data.search;
  const { setList } = data.lists;
  const [segments, setSegments] = useState([]);
  const [activeSegment, setActiveSegment] = useState();
  const [scrollToActiveX, setScrollToActiveX] = useState();
  const [scrollToActive, setScrollToActive] = useState(false);
  const { target } = route.params;
  const { listName, listKey } = target;

  useEffect(() => {
    console.log('calculating active segment');
    var choosers = searchItems.filter((x) => x.chooser !== undefined);
    if (listName && listKey) {
      var defChooser = choosers.find(
        (t) => t.chooser_listKey && t.chooser_listKey.includes(listKey)
      );
      if (defChooser) {
        setActiveSegment(defChooser);
        setScrollToActive(true);
      }
    }
  }, [searchItems, listName, listKey]);

  useEffect(() => {
    var choosers = searchItems.filter((x) => x.chooser !== undefined);
    setSegments(
      choosers.map((v, i) => {
        const isActive = activeSegment && activeSegment.chooser === v.chooser;
        return (
          <Button
            key={i}
            first={i === 0}
            last={i === choosers.length - 1}
            onPress={() => setActiveSegment(v)}
            active={isActive}
            onLayout={(e) => {
              if (isActive) {
                if (e.nativeEvent.layout.x > 0) {
                  setScrollToActiveX(e.nativeEvent.layout.x);
                }
              }
            }}>
            <Text>{v.chooser.toUpperCase()}</Text>
          </Button>
        );
      })
    );
  }, [searchItems, activeSegment]);

  useEffect(() => {
    if (
      scrollToActive === true &&
      scrollToActiveX &&
      scrollToActiveRef &&
      scrollToActiveRef.current
    ) {
      scrollToActiveRef.current.scrollTo({
        x: scrollToActiveX,
        animated: true,
      });
    }
  }, [scrollToActive, scrollToActiveRef, scrollToActiveX]);

  const songAssign = (song: Song) => {
    if (listName && listKey !== undefined) {
      setList(listName, listKey, song.key);
      navigation.goBack(null);
    }
  };

  return (
    <ModalView
      left={
        <Text
          style={{
            alignSelf: 'flex-start',
            marginLeft: 10,
            fontSize: commonTheme.fontSizeBase + 3,
            fontWeight: 'bold',
          }}>
          {I18n.t('screen_title.find song')}
        </Text>
      }>
      <ScrollView
        ref={scrollToActiveRef}
        style={{ flexGrow: 0, marginLeft: 8, marginRight: 8 }}
        horizontal={true}>
        <Segment>{segments}</Segment>
      </ScrollView>
      <SongList
        style={{ flexGrow: 1 }}
        filter={
          activeSegment && activeSegment.params
            ? activeSegment.params.filter
            : null
        }
        devModeDisabled={true}
        viewButton={true}
        onPress={(song) => songAssign(song)}
      />
    </ModalView>
  );
};

export default SongChooserDialog;
