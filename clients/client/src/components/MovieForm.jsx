import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { MovieSchema, genres } from '../validationSchemas';

function MovieForm({ initialData = {}, onSubmit }) {
  return (
    <Formik
      initialValues={{
        title: initialData.title || '',
        description: initialData.description || '',
        poster_url: initialData.poster_url || '',
        genre: initialData.genre || '',
      }}
      validationSchema={MovieSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Назва</label>
            <Field type="text" name="title" className="form-control" />
            <ErrorMessage name="title" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Опис</label>
            <Field as="textarea" name="description" className="form-control" />
            <ErrorMessage name="description" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label htmlFor="poster_url" className="form-label">URL постера</label>
            <Field type="text" name="poster_url" className="form-control" />
            <ErrorMessage name="poster_url" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label htmlFor="genre" className="form-label">Жанр</label>
            <Field as="select" name="genre" className="form-select">
              <option value="">Оберіть жанр</option>
              {genres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </Field>
            <ErrorMessage name="genre" component="div" className="text-danger" />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            Зберегти
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default MovieForm;
