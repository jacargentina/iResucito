import { RouteProp, useRoute } from '@react-navigation/native';
import { SongsStackParamList, ListsStackParamList } from '../navigation';
import { HeaderButton } from './HeaderButton';
import { useSongPlayer } from '../hooks';

type SongDetailRouteProp1 = RouteProp<SongsStackParamList, 'SongDetail'>;
type SongDetailRouteProp2 = RouteProp<ListsStackParamList, 'SongDetail'>;

export const PlaySongButton = () => {
  const route = useRoute<SongDetailRouteProp1 | SongDetailRouteProp2>();
  const { song } = route.params;
  const songPlayer = useSongPlayer();
  if (!song) {
    return null;
  }

  return (
    <HeaderButton
      testID="play-song-button"
      iconName="PlayIcon"
      onPress={() => {
        songPlayer.play(song);
      }}
    />
  );
};
