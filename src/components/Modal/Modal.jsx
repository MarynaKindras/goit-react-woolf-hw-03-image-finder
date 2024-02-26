import { Overlay, ModalWin } from './Modal.styled';

import React, { Component } from 'react';

export class Modal extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  };

  handleKeyDown = e => {
    if (e.key === 'Escape') {
      this.props.onClose();
    }
  };

  render() {
    const { isVisible, imageUrl, alt } = this.props;
    return (
      <Overlay isVisible={isVisible} onClick={this.handleOverlayClick}>
        <ModalWin>
          <img src={imageUrl} alt={alt} />
        </ModalWin>
      </Overlay>
    );
  }
}
