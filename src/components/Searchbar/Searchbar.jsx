import React, { Component } from 'react';

import {
  Header,
  Form,
  FormWrapper,
  SearchBtn,
  SearchInput,
} from './Searchbar.styled';
import { CiSearch } from 'react-icons/ci';

export class Searchbar extends Component {
  state = {
    query: '',
  };
  handleQueryChange = e => {
    this.setState({ query: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { query } = this.state;
    this.props.onSubmit({ query: query });
    this.setState({ query: '' });
  };

  render() {
    return (
      <Header>
        <Form onSubmit={this.handleSubmit}>
          <FormWrapper>
            <SearchBtn type="submit">
              <CiSearch />
            </SearchBtn>
            <SearchInput
              type="text"
              name="search"
              value={this.state.query}
              autoComplete="off"
              autoFocus
              placeholder="Search images and photos"
              onChange={this.handleQueryChange}
            />
          </FormWrapper>
        </Form>
      </Header>
    );
  }
}
