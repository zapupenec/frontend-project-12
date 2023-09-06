/* eslint-disable import/prefer-default-export */
import { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container, Row, Col, Card, Form, FloatingLabel, Button, Image,
} from 'react-bootstrap';
import { object, ref, string } from 'yup';

import signupImage from '../../assets/signup.jpg';
import { useAuth } from '../../contexts';
import { routes } from '../../routes';

const getSchema = () => {
  const schema = object().shape({
    username: string()
      .min(3)
      .max(20)
      .required(),
    password: string()
      .min(6)
      .required(),
    confirmPassword: string()
      .oneOf([ref('password')]),
  });

  return schema;
};

export const SignupPage = () => {
  const { t } = useTranslation();

  const { isSignUpFailed, signUp } = useAuth();

  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: getSchema(),
    onSubmit: ({ username, password }) => {
      signUp(username, password, () => {
        formik.setSubmitting(false);
        inputRef.current.focus();
      });
    },
  });

  const isValid = (fieldName) => (
    (formik.touched[fieldName] && formik.errors[fieldName]) || isSignUpFailed
  );

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <Col md="6" className="d-flex align-items-center justify-content-center">
                <Image src={signupImage} roundedCircle alt={t('signupPage.title')} />
              </Col>
              <Form className="col col-md-6" onSubmit={formik.handleSubmit} noValidate>
                <h1 className="text-center mb-4">{t('signupPage.title')}</h1>
                <FloatingLabel className="mb-3" controlId="username" label={t('signupPage.fields.username')}>
                  <Form.Control
                    type="username"
                    placeholder={t('signupPage.fields.username')}
                    name="username"
                    autoComplete="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    required
                    ref={inputRef}
                    disabled={formik.isSubmitting}
                    isInvalid={isValid('username')}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {t(formik.errors.username)}
                  </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel className="mb-3" controlId="password" label={t('signupPage.fields.password')}>
                  <Form.Control
                    type="password"
                    placeholder={t('signupPage.fields.password')}
                    name="password"
                    autoComplete="new-password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    required
                    disabled={formik.isSubmitting}
                    isInvalid={isValid('password')}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {t(formik.errors.password)}
                  </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel className="mb-4" controlId="confirmPassword" label={t('signupPage.fields.confirmPassword')}>
                  <Form.Control
                    type="password"
                    placeholder={t('signupPage.fields.confirmPassword')}
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    required
                    disabled={formik.isSubmitting}
                    isInvalid={isValid('confirmPassword')}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {isSignUpFailed ? t('errors.signup') : t(formik.errors.confirmPassword)}
                  </Form.Control.Feedback>
                </FloatingLabel>
                <Button
                  variant="outline-primary"
                  type="submit"
                  className="w-100"
                  disabled={formik.isSubmitting}
                >
                  {t('buttons.signup')}
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>{t('signupPage.text')}</span>
                <Link to={routes.pages.login}>{t('signupPage.link')}</Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
