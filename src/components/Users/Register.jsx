// /client/src/pages/Register.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as apiService from '../../services/userService';
import { registerUserModel } from '../Shared/Models/registerUserModel ';
const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  //destructuring get register, handleSubmit, formState: { errors } from useForm()
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const registerUser = new registerUserModel(data.fullName, data.email, data.password);
      const response = await apiService.registerUser(registerUser);

      if (response.success) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        alert('Registration failed: ' + (response.message || 'Try again.'));
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h4 className="mb-4 text-center">Register</h4>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                 {...register('fullName', { required: 'Name is required' })}
                placeholder="Enter full name"
              />
              {errors.fullName && <small className="text-danger">{errors.fullName.message}</small>}
            </Form.Group>

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

            <Button type="submit" className="w-100">Register</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;