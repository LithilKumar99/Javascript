import React from "react";
import { Modal, Button } from "react-bootstrap";
import { CloseButton } from "./StyledComponent";
import { useColor } from "../../Context/ColorContext";

const CustomModal = ({ show, onHide, onSubmit, title, children, className, size, buttonValue }) => {
  const { backgroundColor, textColor } = useColor();

  return (
    <Modal show={show} onHide={onHide}
      size={size} centered>
      <Modal.Header className={`d-flex justify-content-between align-items-center py-2 pe-2 ${className}`}
        style={{ backgroundColor: backgroundColor, color: textColor }}>
        <Modal.Title>
          {title}
        </Modal.Title>
        <CloseButton
          onClick={onHide}
          className='ms-auto'
        ><i className='bi bi-x'></i>
        </CloseButton>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onSubmit} style={{ backgroundColor: backgroundColor, color: textColor }}>
          {buttonValue}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
