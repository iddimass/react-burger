import styles from './feed.module.css';

export const FeedPage = (): React.JSX.Element => {
  return (
    <main className={`${styles.container}`}>
      <h1 className="text text_type_main-large">Лента заказов</h1>
      <p className="text text_type_main-default text_color_inactive">
        Страница находится в разработке
      </p>
    </main>
  );
};
