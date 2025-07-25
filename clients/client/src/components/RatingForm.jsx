import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const RatingSchema = Yup.object().shape({
  rating: Yup.number()
    .required('Оцініть фільм')
    .min(1, 'Мінімум 1')
    .max(5, 'Максимум 5'),
});

function RatingForm({ initialData = {}, onSubmit }) {
  return (
    <Formik
      initialValues={{
        rating: initialData.rating || '',
      }}
      validationSchema={RatingSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        await onSubmit(values);
        setSubmitting(false);
        resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div>
            <label>Ваша оцінка (1-5):</label>
            <Field as="select" name="rating">
              <option value="">Оберіть рейтинг</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </Field>
            <ErrorMessage name="rating" component="div" style={{ color: 'red' }} />
          </div>

          <button type="submit" disabled={isSubmitting}>Поставити оцінку</button>
        </Form>
      )}
    </Formik>
  );
}

export default RatingForm;
