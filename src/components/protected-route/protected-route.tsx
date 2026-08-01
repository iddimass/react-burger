import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Navigate, useLocation, type Location } from 'react-router-dom';

import { useAppSelector } from '@services/hooks';
import { selectIsAuthenticated, selectIsAuthChecked } from '@services/user/user-slice';
import { AppRoutes } from '@utils/constants';

import type { ReactNode } from 'react';

import styles from './protected-route.module.css';

type TProtectedRouteProps = {
  children: ReactNode;
  onlyUnAuth?: boolean;
};

type TProtectedRouteLocationState = {
  from?: Location;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
}: TProtectedRouteProps): React.JSX.Element => {
  const location = useLocation();
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthChecked) {
    return (
      <div className={styles.container}>
        <Preloader />
      </div>
    );
  }

  if (onlyUnAuth && isAuthenticated) {
    const locationState = location.state as TProtectedRouteLocationState | null;
    const destination = locationState?.from ?? AppRoutes.HOME;

    return <Navigate to={destination} replace />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to={AppRoutes.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
