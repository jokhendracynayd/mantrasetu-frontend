import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import styled from 'styled-components';
import { motion } from 'framer-motion';

import { registerUser } from '../store/slices/authSlice';
import type{ RootState, AppDispatch } from '../store/store';

import Logo from '../components/Common/Logo';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import LoadingSpinner from '../components/Common/LoadingSpinner';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch('password');


  const onSubmit = async (data: RegisterForm, event?: React.BaseSyntheticEvent) => {
    // Prevent default form submission
    if (event) {
      event.preventDefault();
    }
    
    setIsLoading(true);
    setIsSuccess(false);
    
    try {
      const response = await dispatch(registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      })).unwrap();
      
      setIsSuccess(true);
      toast.success('Registration successful! Welcome to MantraSetu!');
      
      // Only clear form and redirect after successful registration
      setTimeout(() => {
        // Reset form only after success
        reset();
        navigate('/dashboard');
      }, 1500);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error || 'Registration failed. Please try again.');
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

  const handleGoogleRegister = () => {
    // Implement Google OAuth
    toast.success('Google registration coming soon!');
  };

  // Password strength indicator component
  const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
    const getStrength = (pwd: string) => {
      let score = 0;
      if (pwd.length >= 8) score++;
      if (/[a-z]/.test(pwd)) score++;
      if (/[A-Z]/.test(pwd)) score++;
      if (/\d/.test(pwd)) score++;
      if (/[^A-Za-z0-9]/.test(pwd)) score++;
      return score;
    };

    const strength = getStrength(password);
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['#f44336', '#ff9800', '#ffc107', '#4caf50', '#2e7d32'];

    return (
      <PasswordStrengthContainer>
        <StrengthBar>
          {[1, 2, 3, 4, 5].map((level) => (
            <StrengthSegment
              key={level}
              active={level <= strength}
              color={strengthColors[strength - 1] || '#f44336'}
            />
          ))}
        </StrengthBar>
        <StrengthText color={strengthColors[strength - 1] || '#f44336'}>
          {strengthLabels[strength - 1] || 'Very Weak'}
        </StrengthText>
      </PasswordStrengthContainer>
    );
  };

  return (
    <RegisterContainer>
      <LeftSection>
        <LogoContainer>
          <Logo size="extra-large" />
          <Tagline>Your Spiritual Journey Begins Here</Tagline>
        </LogoContainer>
      </LeftSection>

      <RightSection>
        <RegisterFormContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <RegisterTitle>CREATE ACCOUNT</RegisterTitle>
            <RegisterSubtitle>Join thousands of spiritual seekers</RegisterSubtitle>
            
            <Form onSubmit={handleFormSubmit}>
              {isSuccess && (
                <SuccessMessage>
                  ✅ Registration successful! Redirecting to dashboard...
                </SuccessMessage>
              )}
              
              <NameRow>
                <InputGroup>
                  <Input
                    type="text"
                    placeholder="First Name"
                    icon="user"
                    {...register('firstName', {
                      required: 'First name is required',
                      minLength: {
                        value: 2,
                        message: 'First name must be at least 2 characters',
                      },
                    })}
                    error={errors.firstName?.message}
                  />
                </InputGroup>

                <InputGroup>
                  <Input
                    type="text"
                    placeholder="Last Name"
                    icon="user"
                    {...register('lastName', {
                      required: 'Last name is required',
                      minLength: {
                        value: 2,
                        message: 'Last name must be at least 2 characters',
                      },
                    })}
                    error={errors.lastName?.message}
                  />
                </InputGroup>
              </NameRow>

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
                  type="tel"
                  placeholder="Phone Number"
                  icon="phone"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[\+]?[1-9][\d]{0,15}$/,
                      message: 'Please enter a valid phone number',
                    },
                    minLength: {
                      value: 10,
                      message: 'Phone number must be at least 10 digits',
                    },
                  })}
                  error={errors.phone?.message}
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
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                    },
                  })}
                  error={errors.password?.message}
                />
                {password && (
                  <PasswordStrengthIndicator password={password} />
                )}
              </InputGroup>

              <InputGroup>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  icon="lock"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                  error={errors.confirmPassword?.message}
                />
              </InputGroup>

              <TermsCheckbox>
                <CheckboxInput
                  type="checkbox"
                  id="acceptTerms"
                  {...register('acceptTerms', { 
                    required: 'You must accept the terms and conditions' 
                  })}
                />
                <CheckboxLabel htmlFor="acceptTerms">
                  I agree to the{' '}
                  <Link to="/terms">Terms of Service</Link> and{' '}
                  <Link to="/privacy">Privacy Policy</Link>
                </CheckboxLabel>
              </TermsCheckbox>
              {errors.acceptTerms && (
                <ErrorText>{errors.acceptTerms.message}</ErrorText>
              )}

              <ActionButtons>
                <SubmitButton
                  type="submit"
                  variant="primary"
                  size="large"
                  disabled={isLoading}
                  fullWidth
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="small" />
                      <span style={{ marginLeft: '8px' }}>Creating Account...</span>
                    </>
                  ) : (
                    'CREATE ACCOUNT'
                  )}
                </SubmitButton>
              </ActionButtons>

              <Divider>
                <span>OR</span>
              </Divider>

              <PanditRegisterButton
                type="button"
                onClick={() => navigate('/pandit-onboarding')}
                variant="outline"
                size="large"
                fullWidth
              >
                🕉️ Register as Pandit Ji
              </PanditRegisterButton>

              <GoogleButton
                type="button"
                onClick={handleGoogleRegister}
                variant="secondary"
                size="large"
                fullWidth
              >
                <GoogleIcon>G</GoogleIcon>
                Sign up with Google
              </GoogleButton>

              <LoginLink>
                Already have an account? <Link to="/login">Sign in</Link>
              </LoginLink>
            </Form>
          </motion.div>
        </RegisterFormContainer>
      </RightSection>
    </RegisterContainer>
  );
};

const RegisterContainer = styled.div`
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
    min-height: 30vh;
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
  );
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/assets/images/Rectangle.png');
    background-size: 200px 200px;
    animation: sparkle 15s linear infinite;
  }

  @keyframes sparkle {
    0% { transform: translate(0, 0); }
    100% { transform: translate(-200px, -200px); }
  }

  @media (max-width: 768px) {
    min-height: 70vh;
  }
`;

const RegisterFormContainer = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[8]};
  width: 100%;
  max-width: 500px;
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  z-index: 1;
  position: relative;

  @media (max-width: 768px) {
    margin: ${({ theme }) => theme.spacing[4]};
    padding: ${({ theme }) => theme.spacing[6]};
  }
`;

const RegisterTitle = styled.h1`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  letter-spacing: 2px;
`;

const RegisterSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.base};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  opacity: 0.9;
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

const NameRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[3]};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
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

const LoginLink = styled.p`
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

// Password Strength Indicator Components
const PasswordStrengthContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const StrengthBar = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StrengthSegment = styled.div<{ active: boolean; color: string }>`
  flex: 1;
  height: 4px;
  background: ${({ active, color }) => (active ? color : '#e0e0e0')};
  border-radius: 2px;
  transition: background-color 0.3s ease;
`;

const StrengthText = styled.span<{ color: string }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ color }) => color};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const TermsCheckbox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[2]};
  margin: ${({ theme }) => theme.spacing[4]} 0;
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${({ theme }) => theme.colors.primary};
  margin-top: 2px;
`;

const CheckboxLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.white};
  line-height: 1.4;
  cursor: pointer;

  a {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: underline;
    font-weight: ${({ theme }) => theme.fontWeights.medium};

    &:hover {
      opacity: 0.8;
    }
  }
`;

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.error};
  margin-top: ${({ theme }) => theme.spacing[1]};
  display: block;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing[6]};
`;

const SubmitButton = styled(Button)`
  flex: 1;
`;

const PanditRegisterButton = styled(Button)`
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.white};
  border-color: ${({ theme }) => theme.colors.secondary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};

  &:hover {
    background: ${({ theme }) => theme.colors.secondaryDark};
    border-color: ${({ theme }) => theme.colors.secondaryDark};
    transform: translateY(-2px);
  }
`;

export default RegisterPage;
