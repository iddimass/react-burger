import { Link } from 'react-router-dom';

import { AppRoutes } from '@utils/constants';

import styles from './not-found.module.css';

export const NotFoundPage = (): React.JSX.Element => {
  return (
    <main className={styles.container}>
      <h1 className="text text_type_digits-large">404</h1>
      <p className="text text_type_main-medium mt-5">Страница не найдена</p>

      <Link
        className="text text_type_main-default text_color_inactive"
        to={AppRoutes.HOME}
      >
        Вернуться на главную
      </Link>
    </main>
  );
};
