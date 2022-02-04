import { Loader } from 'semantic-ui-react';

const Index = () => {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Loader active inline="centered" size="large" content="Loading..." />
    </div>
  );
};

export default Index;
