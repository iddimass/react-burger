import styles from './modal-overlay.module.css';

type TModalOverlayProps = {
  onClick: () => void;
};

const ModalOverlay = ({ onClick }: TModalOverlayProps): React.JSX.Element => (
  <div
    className={styles.overlay}
    data-testid="modal-overlay"
    aria-hidden="true"
    onClick={onClick}
  />
);

export default ModalOverlay;
