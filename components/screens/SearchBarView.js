import React from 'react';
import { View } from 'react-native';
import { Container, Content, Input, Item } from 'native-base';
import debounce from 'lodash/debounce';

class DebouncedInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.sendTextChange = this.sendTextChange.bind(this);
  }

  componentDidMount() {
    this.sendTextChange = debounce(this.sendTextChange, 500);
    this.setState({ text: this.props.text });
  }

  handleTextChange(text) {
    this.setState({ text: text });
    this.sendTextChange(text.trim());
  }

  sendTextChange(text) {
    this.props.searchHandler(this.props.searchTextFilterId, text);
  }

  render() {
    return (
      <Input
        placeholder="Buscar..."
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
      <View>
        <Item>
          <DebouncedInput
            searchHandler={props.searchHandler}
            searchTextFilter={props.searchTextFilter}
            searchTextFilterId={props.searchTextFilterId}
          />
        </Item>
      </View>
    );
  }
  return (
    <Container>
      {searchView}
      <Content>{props.children}</Content>
    </Container>
  );
};

export default SearchBarView;
