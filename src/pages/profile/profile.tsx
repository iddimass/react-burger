import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { logoutUser } from '@services/user/user-actions';
import { clearUserError, selectUserLoading } from '@services/user/user-slice';
import { AppRoutes } from '@utils/constants';

import styles from './profile.module.css';

export const ProfilePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectUserLoading);

  const handleLogout = (): void => {
    dispatch(clearUserError());

    void dispatch(logoutUser())
      .unwrap()
      .catch(() => {
        // Токены очищаются и при ошибке выхода
      })
      .finally(() => {
        void navigate(AppRoutes.LOGIN, { replace: true });
      });
  };

  return (
    <main className={styles.container}>
      <nav className={styles.navigation}>
        <NavLink
          to={AppRoutes.PROFILE}
          end
          className={({ isActive }) =>
            `${styles.link} text text_type_main-medium ${
              isActive ? styles.link_active : ''
            }`
          }
        >
          Профиль
        </NavLink>

        <NavLink
          to={AppRoutes.PROFILE_ORDERS}
          className={({ isActive }) =>
            `${styles.link} text text_type_main-medium ${
              isActive ? styles.link_active : ''
            }`
          }
        >
          История заказов
        </NavLink>

        <button
          className={`${styles.link} ${styles.button} text text_type_main-medium`}
          type="button"
          onClick={handleLogout}
          disabled={isLoading}
        >
          Выход
        </button>

        <p className="text text_type_main-default text_color_inactive mt-20">
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </nav>

      <Outlet />
    </main>
  );
};
