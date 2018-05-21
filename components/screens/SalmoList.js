import React from 'react';
import { connect } from 'react-redux';
import { Text } from 'native-base';
import { FlatList, Keyboard } from 'react-native';
import SearchBarView from './SearchBarView';
import SalmoListItem from './SalmoListItem';
import AppNavigatorConfig from '../AppNavigatorConfig';
import { setSalmosFilterText } from '../actions';
import {
  makeGetProcessedSalmos,
  getShowSalmosBadge,
  getCurrentRouteKey,
  getCurrentRouteSalmosTextFilter
} from '../selectors';
import I18n from '../translations';

class SalmoList extends React.Component {
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
                resaltar={this.props.textFilter}
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
      textFilterId: getCurrentRouteKey(state),
      textFilter: getCurrentRouteSalmosTextFilter(state),
      items: getProcessedSalmos(state, props),
      showBadge: getShowSalmosBadge(state)
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    filtrarHandler: (inputId, text) => {
      dispatch(setSalmosFilterText(inputId, text));
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
    <Text
      style={{
        marginRight: 8,
        fontSize: 10,
        color: AppNavigatorConfig.navigationOptions(props).headerTitleStyle.color
      }}>
      {props.items.length}
    </Text>
  );
};

const ConnectedCountText = connect(makeMapStateToProps)(CountText);

SalmoList.navigationOptions = props => ({
  title:
    props.navigation.state.params && props.navigation.state.params.title
      ? props.navigation.state.params.title
      : 'Sin titulo',
  headerRight: <ConnectedCountText {...props} />
});

export default connect(makeMapStateToProps, mapDispatchToProps)(SalmoList);
