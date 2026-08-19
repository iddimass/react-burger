import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { forgotPassword } from '@services/user/user-actions';
import {
  clearUserError,
  selectUserError,
  selectUserLoading,
} from '@services/user/user-slice';
import { AppRoutes } from '@utils/constants';
import { allowPasswordReset } from '@utils/password-reset-storage';

import styles from '../auth.module.css';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const isLoading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);
  const displayedError = validationError ?? error;

  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setValidationError('Ой! Введите почту');
      return;
    }

    setValidationError(null);
    dispatch(clearUserError());

    void dispatch(forgotPassword(normalizedEmail))
      .unwrap()
      .then(() => {
        allowPasswordReset();
        void navigate(AppRoutes.RESET_PASSWORD);
      })
      .catch(() => {
        // Ошибка отображается из userSlice.
      });
  };

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>

        <EmailInput
          name="email"
          value={email}
          placeholder="Укажите e-mail"
          onChange={(event) => {
            setEmail(event.target.value);
            setValidationError(null);
          }}
          extraClass="mb-6"
          errorText={validationError ?? undefined}
        />

        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Отправляем...' : 'Восстановить'}
        </Button>

        {displayedError && (
          <p className={`${styles.error} text text_type_main-default mt-6`}>
            {displayedError}
          </p>
        )}
      </form>

      <div className={`${styles.links} mt-20`}>
        <p className="text text_type_main-default text_color_inactive">
          Вспомнили пароль?{' '}
          <Link className={styles.link} to={AppRoutes.LOGIN}>
            Войти
          </Link>
        </p>
      </div>
    </main>
  );
};
