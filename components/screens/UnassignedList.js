// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Badge, Text, ListItem, Body, Right, Icon } from 'native-base';
import { FlatList, Keyboard } from 'react-native';
import SearchBarView from './SearchBarView';
import Highlighter from 'react-native-highlight-words';
import AppNavigatorOptions from '../AppNavigatorOptions';
import { setInputFilterText } from '../actions';
import commonTheme from '../../native-base-theme/variables/platform';
import textTheme from '../../native-base-theme/components/Text';
import {
  getFilteredAvailableSongsForPatch,
  getCurrentRouteKey,
  getCurrentRouteInputTextFilter
} from '../selectors';
import I18n from '../translations';

class UnassignedList extends React.Component<any> {
  listRef: any;
  textStyles: any;
  noteStyles: any;

  static navigationOptions = (props: any) => {
    return {
      title: I18n.t('search_title.unassigned'),
      headerRight: <ConnectedCountText {...props} />
    };
  };

  constructor(props) {
    super(props);
    this.textStyles = textTheme(commonTheme);
    this.noteStyles = this.textStyles['.note'];
    delete this.textStyles['.note'];
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
          keyExtractor={item => item.nombre}
          renderItem={({ item }) => {
            return (
              <ListItem>
                <Body>
                  <Highlighter
                    style={this.textStyles}
                    highlightStyle={{
                      backgroundColor: 'yellow'
                    }}
                    searchWords={[this.props.textFilter]}
                    textToHighlight={item.titulo}
                  />
                  <Highlighter
                    style={this.noteStyles}
                    highlightStyle={{
                      backgroundColor: 'yellow'
                    }}
                    searchWords={[this.props.textFilter]}
                    textToHighlight={item.fuente}
                  />
                </Body>
                <Right>
                  <Icon
                    name="link"
                    style={{
                      fontSize: 32,
                      color: commonTheme.brandPrimary
                    }}
                    onPress={() => this.props.chooseSongForLocale(item)}
                  />
                </Right>
              </ListItem>
            );
          }}
        />
      </SearchBarView>
    );
  }
}

const makeMapStateToProps = (state, props) => {
  return {
    items: getFilteredAvailableSongsForPatch(state, props),
    textFilterId: getCurrentRouteKey(state, props),
    textFilter: getCurrentRouteInputTextFilter(state, props)
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    filtrarHandler: (inputId, text) => {
      dispatch(setInputFilterText(inputId, text));
    },
    chooseSongForLocale: item => {
      // TODO
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

export default connect(makeMapStateToProps, mapDispatchToProps)(UnassignedList);
