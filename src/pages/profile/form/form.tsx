import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState, type FormEvent } from 'react';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { updateUser } from '@services/user/user-actions';
import {
  clearUserError,
  selectUser,
  selectUserError,
  selectUserLoading,
} from '@services/user/user-slice';

import styles from './form.module.css';

export const ProfileForm = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setPassword('');
    dispatch(clearUserError());
  }, [dispatch, user]);

  const isChanged =
    name !== (user?.name ?? '') || email !== (user?.email ?? '') || password !== '';

  const handleCancel = (): void => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setPassword('');
    dispatch(clearUserError());
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!user || !isChanged || isLoading) {
      return;
    }

    dispatch(clearUserError());

    void dispatch(updateUser({ name, email, password }))
      .unwrap()
      .then(() => {
        setPassword('');
      })
      .catch(() => {
        // Ошибка отображается из userSlice.
      });
  };

  return (
    <section className={styles.content}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          value={name}
          placeholder="Имя"
          icon="EditIcon"
          onChange={(event) => setName(event.target.value)}
          extraClass="mb-6"
        />

        <Input
          type="email"
          name="email"
          value={email}
          placeholder="Логин"
          icon="EditIcon"
          onChange={(event) => setEmail(event.target.value)}
          extraClass="mb-6"
        />

        <Input
          type="password"
          name="password"
          value={password}
          placeholder="Пароль"
          icon="EditIcon"
          onChange={(event) => setPassword(event.target.value)}
        />

        {isChanged && (
          <div className={`${styles.actions} mt-6`}>
            <Button
              htmlType="button"
              type="secondary"
              size="medium"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Отмена
            </Button>

            <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
              {isLoading ? 'Сохраняем...' : 'Сохранить'}
            </Button>
          </div>
        )}

        {error && (
          <p className={`${styles.error} text text_type_main-default mt-6`}>{error}</p>
        )}
      </form>
    </section>
  );
};
