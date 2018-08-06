// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Badge, Text } from 'native-base';
import { FlatList, Keyboard } from 'react-native';
import SearchBarView from './SearchBarView';
import SalmoListItem from './SalmoListItem';
import AppNavigatorOptions from '../AppNavigatorOptions';
import { setInputFilterText } from '../actions';
import {
  makeGetProcessedSalmos,
  getShowSalmosBadge,
  getCurrentRouteKey,
  getCurrentRouteInputTextFilter
} from '../selectors';
import I18n from '../translations';

class SalmoList extends React.Component<any> {
  listRef: any;

  static navigationOptions = (props: any) => {
    return {
      title: props.navigation.getParam('title', 'Sin título'),
      headerRight: <ConnectedCountText {...props} />
    };
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SearchBarView
        searchTextFilterId={this.props.textFilterId}
        searchTextFilter={this.props.textFilter}
        searchHandler={this.props.filtrarHandler}
        afterSearchHandler={() => {
          if (this.props.items.length > 0) {
            setTimeout(() => {
              this.listRef.scrollToIndex({ index: 0, animated: true });
            }, 10);
          }
        }}>
        {this.props.items.length == 0 && (
          <Text note style={{ textAlign: 'center', paddingTop: 20 }}>
            {I18n.t('ui.no songs found')}
          </Text>
        )}
        <FlatList
          ref={ref => {
            this.listRef = ref;
          }}
          onScrollBeginDrag={() => Keyboard.dismiss()}
          keyboardShouldPersistTaps="always"
          data={this.props.items}
          keyExtractor={item => item.path}
          renderItem={({ item }) => {
            return (
              <SalmoListItem
                key={item.nombre}
                showBadge={this.props.showBadge}
                salmo={item}
                onPress={this.props.onPress}
                highlight={this.props.textFilter}
              />
            );
          }}
        />
      </SearchBarView>
    );
  }
}

const makeMapStateToProps = () => {
  const getProcessedSalmos = makeGetProcessedSalmos();
  const mapStateToProps = (state, props) => {
    return {
      textFilterId: getCurrentRouteKey(state, props),
      textFilter: getCurrentRouteInputTextFilter(state, props),
      items: getProcessedSalmos(state, props).toJS(),
      showBadge: getShowSalmosBadge(state, props)
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    filtrarHandler: (inputId, text) => {
      dispatch(setInputFilterText(inputId, text));
    },
    onPress: salmo => {
      if (props.onPress) {
        props.onPress(salmo);
      } else {
        props.navigation.navigate('SalmoDetail', { salmo: salmo });
      }
    }
  };
};

const CountText = props => {
  return (
    <Badge style={{ marginTop: 8, marginRight: 6 }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: 'bold',
          fontStyle: 'italic',
          textAlign: 'center',
          color: AppNavigatorOptions.headerTitleStyle.color
        }}>
        {props.items.length}
      </Text>
    </Badge>
  );
};

const ConnectedCountText = connect(makeMapStateToProps)(CountText);

export default connect(makeMapStateToProps, mapDispatchToProps)(SalmoList);
