import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import styled from 'styled-components';
import { motion } from 'framer-motion';

import { loginUser } from '../store/slices/authSlice';
import type{ RootState } from '../store/store';
import type{ AppDispatch } from '../store/store';
import Logo from '../components/Common/Logo';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import LoadingSpinner from '../components/Common/LoadingSpinner';

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginForm>();


  const onSubmit = async (data: LoginForm, event?: React.BaseSyntheticEvent) => {
    // Prevent default form submission
    if (event) {
      event.preventDefault();
    }
    
    setIsLoading(true);
    setIsSuccess(false);
    
    try {
      const response = await dispatch(loginUser(data)).unwrap();
      
      setIsSuccess(true);
      toast.success('Login successful!');
      
      // Only clear form and redirect after successful login
      setTimeout(() => {
        // Reset form only after success
        reset();
        navigate('/dashboard');
      }, 1500);
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error || 'Login failed. Please try again.');
      // Don't clear form on error - keep user data
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Let react-hook-form handle the submission
    await handleSubmit(onSubmit)(event);
  };

  const handleGoogleLogin = () => {
    // Implement Google OAuth
    toast.success('Google login coming soon!');
  };

  return (
    <LoginContainer>
      <LeftSection>
        <LogoContainer>
          <Logo size="extra-large" />
          <Tagline>Your Spiritual Journey Begins Here</Tagline>
        </LogoContainer>
      </LeftSection>

      <RightSection>
        <LoginFormContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoginTitle>LOGIN</LoginTitle>
            
            <Form onSubmit={handleFormSubmit}>
              {isSuccess && (
                <SuccessMessage>
                  ✅ Login successful! Redirecting to dashboard...
                </SuccessMessage>
              )}
              
              <InputGroup>
                <Input
                  type="email"
                  placeholder="Email Address"
                  icon="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  error={errors.email?.message}
                />
              </InputGroup>

              <InputGroup>
                <Input
                  type="password"
                  placeholder="Password"
                  icon="lock"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  error={errors.password?.message}
                />
              </InputGroup>

              <ForgotPasswordLink to="/forgot-password">
                Forgot Password?
              </ForgotPasswordLink>

              <Button
                type="submit"
                variant="primary"
                size="large"
                disabled={isLoading}
                fullWidth
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span style={{ marginLeft: '8px' }}>Logging in...</span>
                  </>
                ) : (
                  'LOGIN'
                )}
              </Button>

              <Divider>
                <span>OR</span>
              </Divider>

              <GoogleButton
                type="button"
                onClick={handleGoogleLogin}
                variant="secondary"
                size="large"
                fullWidth
              >
                <GoogleIcon>G</GoogleIcon>
                Sign up with Google
              </GoogleButton>

              <SignupLink>
                Don't have an account? <Link to="/register">Sign up</Link>
              </SignupLink>
            </Form>
          </motion.div>
        </LoginFormContainer>
      </RightSection>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8a65 100%);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.white};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      ${({ theme }) => theme.colors.primary}20 1px,
      transparent 1px
    );
    background-size: 20px 20px;
    animation: float 20s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(30px, -30px) rotate(120deg); }
    66% { transform: translate(-20px, 20px) rotate(240deg); }
  }

  @media (max-width: 768px) {
    min-height: 40vh;
  }
`;

const LogoContainer = styled.div`
  text-align: center;
  z-index: 1;
  position: relative;
`;

const Tagline = styled.p`
  margin-top: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    rgba(255, 107, 53, 0.9) 0%,
    rgba(255, 138, 101, 0.9) 100%
  ),
  url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  background-size: cover;
  background-position: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/src/assets/Rectangle.svg');
    background-size: 200px 200px;
    animation: sparkle 15s linear infinite;
  }

  @keyframes sparkle {
    0% { transform: translate(0, 0); }
    100% { transform: translate(-200px, -200px); }
  }

  @media (max-width: 768px) {
    min-height: 60vh;
  }
`;

const LoginFormContainer = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[8]};
  width: 100%;
  max-width: 400px;
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  z-index: 1;
  position: relative;

  @media (max-width: 768px) {
    margin: ${({ theme }) => theme.spacing[4]};
    padding: ${({ theme }) => theme.spacing[6]};
  }
`;

const LoginTitle = styled.h1`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  letter-spacing: 2px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const SuccessMessage = styled.div`
  background: ${({ theme }) => theme.colors.success}20;
  border: 1px solid ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.success};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-align: center;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ForgotPasswordLink = styled(Link)`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-align: right;
  text-decoration: underline;
  opacity: 0.8;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spacing[4]} 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.white}40;
  }

  span {
    padding: 0 ${({ theme }) => theme.spacing[4]};
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }
`;

const GoogleButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid ${({ theme }) => theme.colors.gray300};

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
    border-color: ${({ theme }) => theme.colors.gray400};
  }
`;

const GoogleIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4285f4;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const SignupLink = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  a {
    color: ${({ theme }) => theme.colors.white};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    text-decoration: underline;

    &:hover {
      opacity: 0.8;
    }
  }
`;


export default LoginPage;
