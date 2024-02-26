import React, { Component } from 'react';
import isPropValid from '@emotion/is-prop-valid';
import { StyleSheetManager } from 'styled-components';

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import { Loader } from './Loader/Loader';
import { fetchImages } from './api';

import { MainWrapper, Container, LoaderWrap } from './App.styled';

export class App extends Component {
  state = {
    pictures: [],
    query: '',
    page: 1,
    status: '',
    isLoading: false,
    isModalVisible: false,
    modalImage: { url: '', alt: '' },
    hasMorePages: false,
  };

  shouldForwardProp(propName, target) {
    if (typeof target === 'string') {
      return isPropValid(propName);
    }
    return true;
  }

  async componentDidUpdate(prevProps, prevState) {
    const { page, query } = this.state;

    if (
      this.state.page !== prevState.page ||
      this.state.query !== prevState.query
    ) {
      try {
        let result = await fetchImages(query, page);
        if (result.hits.length === 0) {
          this.setState({ status: 'rejected', isLoading: false });
          throw new Error('something went wrong');
        }
        this.setState(prevState => {
          return {
            pictures: [...prevState.pictures, ...result.hits],
            status: 'resolved',
            hasMorePages: page < Math.ceil(result.totalHits / 12),
            isLoading: false,
          };
        });
        console.log(this.state.pictures);
      } catch (error) {
        console.log(error);
        this.setState({ status: 'rejected', isLoading: false });
      }
    }
  }

  onBtnClick = async () => {
    this.setState(prevState => {
      return {
        page: prevState.page + 1,
        isLoading: true,
      };
    });
  };

  addPictures = ({ query }) => {
    this.setState({
      query: query,
      pictures: [],
      page: 1,
      status: 'pending',
      hasMorePages: false,
    });
  };
  onImageClick = (imageUrl, imageAlt) => {
    this.setState({
      isModalVisible: true,
      modalImage: { url: imageUrl, alt: imageAlt },
    });
  };
  closeModal = () => {
    this.setState({ isModalVisible: false });
  };
  render() {
    const { pictures, status, isLoading, hasMorePages, isModalVisible } =
      this.state;
    return (
      <StyleSheetManager shouldForwardProp={this.shouldForwardProp}>
        <MainWrapper>
          <Modal
            isVisible={isModalVisible}
            imageUrl={this.state.modalImage.url}
            alt={this.state.modalImage.alt}
            onClose={this.closeModal}
          />
          <Searchbar onSubmit={this.addPictures} />
          {status === 'rejected' && <div>Something went wrong</div>}
          {status === 'pending' && <Loader />}
          {status === 'resolved' && (
            <Container>
              <ImageGallery items={pictures} onClick={this.onImageClick} />
              {isLoading && (
                <LoaderWrap>
                  <Loader />
                </LoaderWrap>
              )}
              {hasMorePages && <Button onLoadMoreBtnClick={this.onBtnClick} />}
            </Container>
          )}
        </MainWrapper>
      </StyleSheetManager>
    );
  }
}
