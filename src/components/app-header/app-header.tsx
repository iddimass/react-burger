import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, NavLink, useMatch } from 'react-router-dom';

import { AppRoutes } from '@utils/constants';

import styles from './app-header.module.css';

export const AppHeader = (): React.JSX.Element => {
  const isIngredientRoute = useMatch(AppRoutes.INGREDIENT) !== null;

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to={AppRoutes.HOME}
            end
            className={({ isActive }) =>
              `${styles.link} ${isActive || isIngredientRoute ? styles.link_active : ''}`
            }
          >
            {({ isActive }) => {
              const isConstructorActive = isActive || isIngredientRoute;

              return (
                <>
                  <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
                  <p className="text text_type_main-default ml-2">Конструктор</p>
                </>
              );
            }}
          </NavLink>

          <NavLink
            to={AppRoutes.FEED}
            className={({ isActive }) =>
              `${styles.link} ml-10 ${isActive ? styles.link_active : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Лента заказов</p>
              </>
            )}
          </NavLink>
        </div>

        <Link to={AppRoutes.HOME} className={styles.logo}>
          <Logo />
        </Link>

        <NavLink
          to={AppRoutes.PROFILE}
          className={({ isActive }) =>
            `${styles.link} ${styles.link_position_last} ${
              isActive ? styles.link_active : ''
            }`
          }
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p className="text text_type_main-default ml-2">Личный кабинет</p>
            </>
          )}
        </NavLink>
      </nav>
    </header>
  );
};
