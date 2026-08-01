import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { registerUser } from '@services/user/user-actions';
import {
  clearUserError,
  selectUserError,
  selectUserLoading,
} from '@services/user/user-slice';
import { AppRoutes } from '@utils/constants';

import styles from '../auth.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isLoading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);

  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    dispatch(clearUserError());

    void dispatch(registerUser({ name, email, password }))
      .unwrap()
      .then(() => {
        void navigate(AppRoutes.HOME, { replace: true });
      })
      .catch(() => {
        // Ошибка отображается из userSlice.
      });
  };

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Регистрация</h1>

        <Input
          type="text"
          name="name"
          value={name}
          placeholder="Имя"
          onChange={(event) => setName(event.target.value)}
          extraClass="mb-6"
        />

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
          extraClass="mb-6"
        />

        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>

        {error && (
          <p className={`${styles.error} text text_type_main-default mt-6`}>{error}</p>
        )}
      </form>

      <div className={`${styles.links} mt-20`}>
        <p className="text text_type_main-default text_color_inactive">
          Уже зарегистрированы?{' '}
          <Link className={styles.link} to={AppRoutes.LOGIN}>
            Войти
          </Link>
        </p>
      </div>
    </main>
  );
};
