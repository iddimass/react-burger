import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { loginUser } from '@services/user/user-actions';
import {
  clearUserError,
  selectUserError,
  selectUserLoading,
} from '@services/user/user-slice';
import { AppRoutes } from '@utils/constants';

import styles from '../auth.module.css';

type TLoginLocationState = {
  from?: {
    pathname: string;
  };
};

export const LoginPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const isLoading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);

  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    dispatch(clearUserError());

    void dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        const locationState = location.state as TLoginLocationState | null;
        const destination = locationState?.from?.pathname ?? AppRoutes.HOME;

        void navigate(destination, { replace: true });
      })
      .catch(() => {
        // Ошибка отображается из userSlice.
      });
  };

  // У меня в firefox при нажатии Enter в поле пароля форма не отправляется, поэтому добавил обработчик.
  const handlePasswordKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Вход</h1>

        <EmailInput
          name="email"
          value={email}
          placeholder="E-mail"
          onChange={(event) => setEmail(event.target.value)}
          extraClass="mb-6"
          errorText="Ой! Почта написана неверно :("
        />

        <PasswordInput
          name="password"
          value={password}
          placeholder="Пароль"
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={handlePasswordKeyDown}
          extraClass="mb-6"
        />

        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Входим...' : 'Войти'}
        </Button>

        {error && (
          <p className={`${styles.error} text text_type_main-default mt-6`}>{error}</p>
        )}
      </form>

      <div className={`${styles.links} mt-20`}>
        <p className="text text_type_main-default text_color_inactive">
          Вы — новый пользователь?{' '}
          <Link className={styles.link} to={AppRoutes.REGISTER}>
            Зарегистрироваться
          </Link>
        </p>

        <p className="text text_type_main-default text_color_inactive">
          Забыли пароль?{' '}
          <Link className={styles.link} to={AppRoutes.FORGOT_PASSWORD}>
            Восстановить пароль
          </Link>
        </p>
      </div>
    </main>
  );
};
