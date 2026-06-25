import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import ModalOverlay from '@components/modal-overlay/modal-overlay';

import styles from './modal.module.css';

type TModalProps = {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ title, onClose, children }: TModalProps): React.JSX.Element => {
  const modal = document.getElementById('modals');

  // processing esc
  useEffect(() => {
    const handleKeyEsc = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyEsc);
    return (): void => document.removeEventListener('keydown', handleKeyEsc);
  }, [onClose]);

  return createPortal(
    <>
      <ModalOverlay onClick={onClose} />
      <div className={`${styles.modal} pb-15 pl-10 pr-10 pt-10`}>
        <div className={`${styles.header}`}>
          {title && <h2 className={`text text_type_main-large`}>{title}</h2>}
          <CloseIcon type="primary" onClick={onClose} className={styles.close} />
        </div>
        {children}
      </div>
    </>,
    modal!
  );
};

export default Modal;
