// /client/src/pages/Login.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Card, Container } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { loginUserModel } from '../Shared/Models/loginUserModel';
import * as apiService from '../../services/userService';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit =async (data) => {
  try {
    const loginUser = new loginUserModel(data.email, data.password);
    const response = await apiService.loginUser(loginUser);
    if (response.success && loginUser.Email === response.email.toLowerCase().trim()) {
      navigate('/dashboard', { state: { email: loginUser.Email } });
    } else {
      alert('Invalid email or password!');
    }
  }
  catch (error) {
      console.error('Registration error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h4 className="mb-4 text-center">Login</h4>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                 {...register('email', { required: 'Email is required' })}
                placeholder="Enter email"
              />
              {errors.email && <small className="text-danger">{errors.email.message}</small>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                {...register('password', { required: 'Password is required' })}
                placeholder="Enter password"
              />
              {errors.password && <small className="text-danger">{errors.password.message}</small>}
            </Form.Group>

            <Button type="submit" className="w-100 mb-2">Login</Button>
            <div className="text-center">
              <span>Don't have an account? </span>
              <Link to="/register">Register</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
  