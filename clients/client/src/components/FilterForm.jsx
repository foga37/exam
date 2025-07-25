import React from 'react';
import { Formik, Form, Field } from 'formik';
import './FilterForm.css';

function FilterForm({ genre, search, sort, onSubmit }) {
  return (
    <Formik
      initialValues={{ genre, search, sort }}
      enableReinitialize
      onSubmit={(values) => {
        if (typeof onSubmit === 'function') {
          onSubmit(values);
        }
      }}
    >
      {({ resetForm }) => (
        <Form className="filter-form">
          <Field
            type="text"
            name="search"
            placeholder="Пошук"
            className="filter-input"
          />

          <Field
            as="select"
            name="genre"
            className="filter-select"
            style={{ maxWidth: '150px' }}
          >
            <option value="">Всі жанри</option>
            <option value="Action">Action</option>
            <option value="Drama">Drama</option>
            <option value="Comedy">Comedy</option>
            <option value="Thriller">Thriller</option>
            <option value="Horror">Horror</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Romance">Romance</option>
            <option value="Adventure">Adventure</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Animation">Animation</option>
            <option value="Documentary">Documentary</option>
            <option value="Mystery">Mystery</option>
            <option value="Crime">Crime</option>
          </Field>

          <Field
            as="select"
            name="sort"
            className="filter-select"
            style={{ maxWidth: '150px' }}
          >
            <option value="">Без сортування</option>
            <option value="title">За назвою</option>
            <option value="year">За роком</option>
            <option value="rating">За рейтингом</option>
          </Field>

          <button type="submit" className="btn-filter btn">
            Фільтрувати
          </button>

          <button
            type="button"
            onClick={() => resetForm()}
            className="btn-clear btn"
          >
            Очистити
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default FilterForm;
