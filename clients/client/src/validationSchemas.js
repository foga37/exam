import * as Yup from 'yup';

export const genres = [
  'Action', 'Drama', 'Comedy', 'Thriller', 'Horror', 
  'Sci-Fi', 'Romance', 'Adventure', 'Fantasy', 'Animation', 
  'Documentary', 'Mystery', 'Crime'
];

export const MovieSchema = Yup.object().shape({
  title: Yup.string()
    .required('Обов’язкове поле')
    .min(2, 'Мінімум 2 символи'),
  description: Yup.string()
    .max(500, 'Максимум 500 символів'),
  poster_url: Yup.string()
    .url('Невірний URL')
    .required('Обов’язкове поле'),
  genre: Yup.string()
    .oneOf(genres, 'Недопустимий жанр')
    .required('Обов’язкове поле'),
});
