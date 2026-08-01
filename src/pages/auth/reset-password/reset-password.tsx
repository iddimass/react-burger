import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { resetPassword } from '@services/user/user-actions';
import {
  clearUserError,
  selectUserError,
  selectUserLoading,
} from '@services/user/user-slice';
import { AppRoutes } from '@utils/constants';
import {
  clearPasswordResetAccess,
  isPasswordResetAllowed,
} from '@utils/password-reset-storage';

import styles from '../auth.module.css';

export const ResetPasswordPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const isLoading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);
  const canResetPassword = isPasswordResetAllowed();

  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    dispatch(clearUserError());

    void dispatch(resetPassword({ password, token }))
      .unwrap()
      .then(() => {
        clearPasswordResetAccess();
        void navigate(AppRoutes.LOGIN, { replace: true });
      })
      .catch(() => {
        // Ошибка отображается из userSlice.
      });
  };

  if (!canResetPassword) {
    return <Navigate to={AppRoutes.FORGOT_PASSWORD} replace />;
  }

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>

        <PasswordInput
          name="password"
          value={password}
          placeholder="Введите новый пароль"
          onChange={(event) => setPassword(event.target.value)}
          extraClass="mb-6"
        />

        <Input
          type="text"
          name="token"
          value={token}
          placeholder="Введите код из письма"
          onChange={(event) => setToken(event.target.value)}
          extraClass="mb-6"
        />

        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Сохраняем...' : 'Сохранить'}
        </Button>

        {error && (
          <p className={`${styles.error} text text_type_main-default mt-6`}>{error}</p>
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
