import { createPortal } from "react-dom";
import { styled } from "styled-components";

const ModalContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(200, 200, 200, 0.8);
`;

const ModalContent = styled.div`
  width: 70vw;
  height: 70vh;
  background-color: white;
  box-shadow: 0px 0px 15px gray;
  border-radius: 5px;
  padding: 10px;
  position: absolute;
`;

const Modal = ({ onClose, children }) => {
  return createPortal(
    <ModalContainer
      onClick={() => {
        onClose();
      }}
    >
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {children}
      </ModalContent>
    </ModalContainer>,
    document.getElementById("root-modal")
  );
};

export default Modal;
