import styles from './modal-overlay.module.css';

type TModalOverlayProps = {
  onClick: () => void;
};

const ModalOverlay = ({ onClick }: TModalOverlayProps): React.JSX.Element => (
  <div className={styles.overlay} onClick={onClick} />
);

export default ModalOverlay;
