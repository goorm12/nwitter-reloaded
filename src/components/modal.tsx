import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
`;
export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <ModalOverlay onClick={onClose}>
      <Modal>
        <button onClick={onClose}>닫기</button>
        {children}
      </Modal>
    </ModalOverlay>
  );
}
