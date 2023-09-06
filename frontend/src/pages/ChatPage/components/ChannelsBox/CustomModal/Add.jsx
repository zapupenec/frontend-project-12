/* eslint-disable import/prefer-default-export */
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import { useFormik } from 'formik';

import { channelsSelectors } from '../../../../../store/slices';
import { filterProfanity } from '../../../../../lib';
import { useAPI } from '../../../../../contexts';

const getSchema = (channelNames) => {
  const schema = object().shape({
    name: string()
      .min(3)
      .max(20)
      .required()
      .notOneOf(channelNames),
  });

  return schema;
};

export const Add = ({ hideModal }) => {
  const { t } = useTranslation();
  const { addChannel } = useAPI();

  const channelNames = useSelector(channelsSelectors.selectChanelNames);

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: getSchema(channelNames),
    onSubmit: (values) => {
      const name = filterProfanity.clean(values.name);

      addChannel({ name }, () => {
        hideModal();
      });
    },
  });

  return (
    <Form
      onSubmit={formik.handleSubmit}
      noValidate
    >
      <Form.Group controlId="name">
        <Form.Control
          name="name"
          className="mb-2"
          required
          ref={inputRef}
          onChange={formik.handleChange}
          value={formik.values.name}
          isInvalid={formik.touched.name && formik.errors.name}
          disabled={formik.isSubmitting}
        />
        <Form.Label visuallyHidden>{t('modals.channelName')}</Form.Label>
        <Form.Control.Feedback type="invalid">
          {t(formik.errors.name)}
        </Form.Control.Feedback>
      </Form.Group>
      <div className="d-flex justify-content-end">
        <Button
          className="me-2"
          variant="secondary"
          onClick={hideModal}
        >
          {t('buttons.cancel')}
        </Button>
        <Button type="submit" variant="primary">{t('buttons.send')}</Button>
      </div>
    </Form>
  );
};
