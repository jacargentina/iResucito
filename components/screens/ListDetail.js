import React from 'react';
import { connect } from 'react-redux';
import { Icon, List } from 'native-base';
import BaseScreen from './BaseScreen';
import LiturgiaChooser from './LiturgiaChooser';
import { LIST_SHARE } from '../actions';
import { getSalmosFromList } from '../selectors';
import AppNavigatorConfig from '../AppNavigatorConfig';

const ListDetail = props => {
  return (
    <BaseScreen>
      <List>
        <LiturgiaChooser
          listName={props.list.name}
          listMap={props.listMap}
          listKey="ambiental"
        />
        <LiturgiaChooser
          listName={props.list.name}
          listMap={props.listMap}
          listKey="entrada"
        />
        <LiturgiaChooser
          listName={props.list.name}
          listMap={props.listMap}
          listKey="1-monicion"
        />
        <LiturgiaChooser
          listName={props.list.name}
          listMap={props.listMap}
          listKey="1"
        />
        {props.listMap.has('1-salmo') && (
          <LiturgiaChooser
            listName={props.list.name}
            listMap={props.listMap}
            listKey="1-salmo"
          />
        )}
        <LiturgiaChooser
          listName={props.list.name}
          listMap={props.listMap}
          listKey="2-monicion"
        />
        <LiturgiaChooser
          listName={props.list.name}
          listMap={props.listMap}
          listKey="2"
        />
        {props.listMap.has('2-salmo') && (
          <LiturgiaChooser
            listName={props.list.name}
            listMap={props.listMap}
            listKey="2-salmo"
          />
        )}
        {props.listMap.has('3-monicion') && (
          <LiturgiaChooser
            listName={props.list.name}
            listMap={props.listMap}
            listKey="3-monicion"
          />
        )}
        {props.listMap.has('3') && (
          <LiturgiaChooser
            listName={props.list.name}
            listMap={props.listMap}
            listKey="3"
          />
        )}
        {props.listMap.has('3-salmo') && (
          <LiturgiaChooser
            listName={props.list.name}
            listMap={props.listMap}
            listKey="3-salmo"
          />
        )}
        <LiturgiaChooser
          listName={props.list.name}
          listMap={props.listMap}
          listKey="evangelio-monicion"
        />
        <LiturgiaChooser
          listName={props.list.name}
          listMap={props.listMap}
          listKey="evangelio"
        />
        {props.listMap.has('paz') && (
          <LiturgiaChooser
            listName={props.list.name}
            listMap={props.listMap}
            listKey="paz"
          />
        )}
        {props.listMap.has('comunion') && (
          <LiturgiaChooser
            listName={props.list.name}
            listMap={props.listMap}
            listKey="comunion"
          />
        )}
        <LiturgiaChooser
          listName={props.list.name}
          listMap={props.listMap}
          listKey="salida"
        />
      </List>
    </BaseScreen>
  );
};

const mapStateToProps = (state, props) => {
  return {
    list: props.navigation.state.params.list,
    listMap: getSalmosFromList(state, props)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    listShare: (list, items) => {
      dispatch({ type: LIST_SHARE, list: list.name, items: items });
    }
  };
};

const ShareList = props => {
  if (props.listMap.keys().length == 0) {
    return null;
  }
  return (
    <Icon
      name="share"
      style={{
        marginTop: 4,
        marginRight: 12,
        color: AppNavigatorConfig.navigationOptions.headerTitleStyle.color
      }}
      onPress={() =>
        props.listShare(props.navigation.state.params.list, props.items)}
    />
  );
};

const ShareListButton = connect(mapStateToProps, mapDispatchToProps)(ShareList);

ListDetail.navigationOptions = props => ({
  title: props.navigation.state.params
    ? props.navigation.state.params.list.name
    : 'Lista',
  headerRight: <ShareListButton {...props} />
});

export default connect(mapStateToProps, mapDispatchToProps)(ListDetail);
