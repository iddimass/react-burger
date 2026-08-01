import { IngredientModal, IngredientPage } from '@/pages/ingredient/ingredient';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { fetchIngredients } from '@/services/ingredients/ingredients-actions';
import {
  selectIngredientsLoading,
  selectIngredientsError,
} from '@/services/ingredients/ingredients-slice';
import { clearOrder, selectOrderNumber } from '@/services/order/order-slice';
import { checkUserAuth } from '@/services/user/user-actions';
import { selectIsAuthChecked } from '@/services/user/user-slice';
import { AppRoutes } from '@/utils/constants';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect } from 'react';
import { Route, Routes, useLocation, type Location } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import Modal from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { ProtectedRoute } from '@components/protected-route/protected-route';
import { ForgotPasswordPage } from '@pages/auth/forgot-password/forgot-password';
import { LoginPage } from '@pages/auth/login/login';
import { RegisterPage } from '@pages/auth/register/register';
import { ResetPasswordPage } from '@pages/auth/reset-password/reset-password';
import { FeedPage } from '@pages/feed/feed';
import { HomePage } from '@pages/home/home';
import { NotFoundPage } from '@pages/not-found/not-found';
import { ProfileForm } from '@pages/profile/form/form';
import { ProfileOrdersPage } from '@pages/profile/orders/orders';
import { ProfilePage } from '@pages/profile/profile';

import styles from './app.module.css';

type TAppLocationState = {
  backgroundLocation?: Location;
};

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const locationState = location.state as TAppLocationState | null;
  const backgroundLocation = locationState?.backgroundLocation;

  const isLoading = useAppSelector(selectIngredientsLoading);
  const ingredientsError = useAppSelector(selectIngredientsError);
  const orderNumber = useAppSelector(selectOrderNumber);
  const isAuthChecked = useAppSelector(selectIsAuthChecked);

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  const handleCloseOrderModal = useCallback(() => {
    dispatch(clearOrder());
  }, [dispatch]);

  if (isLoading || !isAuthChecked)
    return (
      <div className={styles.app}>
        <Preloader />
      </div>
    );

  if (ingredientsError) {
    return (
      <p
        className={`${styles.app} text text_type_main-medium`}
        style={{ textAlign: 'center', justifyContent: 'center' }}
      >
        Возникли космические неполадки :(
        <br />
        {ingredientsError}
      </p>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation ?? location}>
        <Route path={AppRoutes.HOME} element={<HomePage />} />
        <Route path={AppRoutes.INGREDIENT} element={<IngredientPage />} />
        <Route path={AppRoutes.FEED} element={<FeedPage />} />

        <Route
          path={AppRoutes.LOGIN}
          element={
            <ProtectedRoute onlyUnAuth>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={AppRoutes.REGISTER}
          element={
            <ProtectedRoute onlyUnAuth>
              <RegisterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={AppRoutes.FORGOT_PASSWORD}
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={AppRoutes.RESET_PASSWORD}
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={AppRoutes.PROFILE}
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileForm />} />
          <Route path="orders" element={<ProfileOrdersPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path={AppRoutes.INGREDIENT} element={<IngredientModal />} />
        </Routes>
      )}

      {orderNumber !== null && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default App;
