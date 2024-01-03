import { Avatar, AvatarFallbackText, useMedia } from '@gluestack-ui/themed';
import { colors } from '@iresucito/core';

const createBadge = (backgroundColor: string, color: string, text: string) => {
  const media = useMedia();
  return (
    <Avatar
      size={media.md ? 'md' : 'sm'}
      sx={{
        '@base': {
          mr: '$2',
        },
        '@md': {
          mr: '$3',
        },
      }}
      bgColor={backgroundColor}>
      <AvatarFallbackText
        sx={{
          '@md': {
            fontSize: '$xl',
          },
        }}
        color={color}>
        {text}
      </AvatarFallbackText>
    </Avatar>
  );
};

export const AlphaBadge = () => {
  return createBadge('#e67e22', 'white', 'A');
};

export const PrecatechumenateBadge = () => {
  return createBadge(colors.precatechumenate, 'black', 'P');
};

export const CatechumenateBadge = () => {
  return createBadge(colors.catechumenate, 'black', 'C');
};

export const ElectionBadge = () => {
  return createBadge(colors.election, 'black', 'E');
};

export const LiturgyBadge = () => {
  return createBadge(colors.liturgy, 'black', 'L');
};

export const BadgeByStage = (props: { stage: string }) => {
  const { stage } = props;

  if (stage == 'precatechumenate') {
    return <PrecatechumenateBadge />;
  } else if (stage == 'catechumenate') {
    return <CatechumenateBadge />;
  } else if (stage == 'election') {
    return <ElectionBadge />;
  } else if (stage == 'liturgy') {
    return <LiturgyBadge />;
  }
};
