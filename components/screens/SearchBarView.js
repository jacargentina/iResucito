import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { Input, Item, Icon } from 'native-base';
import debounce from 'lodash/debounce';
import commonTheme from '../../native-base-theme/variables/platform';
import I18n from '../translations';

class DebouncedInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.searchTextFilter
    };
    this.inSearch = false;
    this.handleTextChange = this.handleTextChange.bind(this);
    this.sendTextChange = this.sendTextChange.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.text !== nextProps.searchTextFilter) {
      return {
        text: nextProps.searchTextFilter
      };
    }
  }

  componentDidMount() {
    this.sendTextChange = debounce(this.sendTextChange, 500);
    this.setState({ text: this.props.searchTextFilter });
  }

  handleTextChange(text) {
    if (!this.inSearch) {
      this.setState({ text: text });
      this.sendTextChange(text.trim());
    }
  }

  sendTextChange(text) {
    this.inSearch = true;
    this.props.searchHandler(this.props.searchTextFilterId, text);
    if (this.props.afterSearchHandler) {
      this.props.afterSearchHandler();
    }
    this.inSearch = false;
  }

  render() {
    return (
      <Input
        style={{
          lineHeight: 20,
          height: commonTheme.searchBarHeight
        }}
        placeholder={I18n.t('ui.search placeholder')}
        onChangeText={this.handleTextChange}
        value={this.state.text}
        returnKeyType="search"
        autoCapitalize="none"
        clearButtonMode="always"
        autoCorrect={false}
      />
    );
  }
}

const SearchBarView = props => {
  if (props.searchHandler && props.searchTextFilterId) {
    var searchView = (
      <View
        style={{
          backgroundColor: commonTheme.toolbarInputColor,
          borderRadius: 16,
          margin: 10
        }}>
        <Item
          style={{
            height: commonTheme.searchBarHeight,
            borderColor: 'transparent',
            paddingHorizontal: 15
          }}>
          <Icon name="search" />
          <DebouncedInput
            searchHandler={props.searchHandler}
            searchTextFilter={props.searchTextFilter}
            searchTextFilterId={props.searchTextFilterId}
            afterSearchHandler={props.afterSearchHandler}
          />
        </Item>
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      {searchView}
      <View
        style={{
          flex: 1,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: commonTheme.listBorderColor
        }}>
        {props.children}
      </View>
    </View>
  );
};

export default connect()(SearchBarView);
