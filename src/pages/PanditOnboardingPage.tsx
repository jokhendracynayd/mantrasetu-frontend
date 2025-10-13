import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import type { RootState, AppDispatch } from '../store/store';
import { panditAPI } from '../services/api';

import Header from '../components/Layout/Header';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import LoadingSpinner from '../components/Common/LoadingSpinner';

interface PanditOnboardingForm {
  // User Registration Fields
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  gender: 'Male' | 'Female' | 'Other';

  // Pandit Professional Fields
  experienceYears: number;
  specialization: string[];
  languagesSpoken: string[];
  serviceAreas: string[];
  availability: 'Offline' | 'Online' | 'Both';
  bio: string;
  education: string;
  achievements: string[];
  verificationDocuments: {
    certificate?: File | null;
    idProof?: File | null;
    photo?: File | null;
    gallery?: File[] | null;
  };
}

const PanditOnboardingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [availability, setAvailability] = useState<'Offline' | 'Online' | 'Both'>('Both');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string[]>([]);
  const [selectedServiceAreas, setSelectedServiceAreas] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<string[]>(['']);
  const [verificationFiles, setVerificationFiles] = useState<{
    certificate?: File | null;
    idProof?: File | null;
    photo?: File | null;
    gallery?: File[] | null;
  }>({});
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<PanditOnboardingForm>({
    defaultValues: {
      // User Registration Fields
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      gender: 'Male',
      // Pandit Professional Fields
      experienceYears: 0,
      specialization: [],
      languagesSpoken: [],
      serviceAreas: [],
      availability: 'Both',
      bio: '',
      education: '',
      achievements: [''],
      verificationDocuments: {
        gallery: [],
      },
    },
  });

  const password = watch('password');

  const languages = ['Hindi', 'Sanskrit', 'English', 'Tamil', 'Telugu', 'Bengali', 'Gujarati', 'Marathi', 'Kannada', 'Malayalam', 'Punjabi', 'Assamese'];
  const specializations = [
    'वैदिक अनुष्ठान (Vedic Rituals)',
    'ज्योतिष (Astrology)',
    'विवाह संस्कार (Marriage Ceremonies)',
    'गृह प्रवेश (House Warming)',
    'नामकरण (Naming Ceremony)',
    'अन्नप्राशन (First Feeding)',
    'मुंडन (Hair Cutting)',
    'यज्ञ (Yajna)',
    'पूजा (Puja)',
    'हवन (Havan)',
    'संस्कार (Sanskar)',
    'व्रत (Vrat)',
    'अन्य (Other)'
  ];
  const serviceAreas = [
    'Delhi NCR',
    'Mumbai',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Hyderabad',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
    'Online Puja',
    'PAN India',
    'North Zone',
    'South Zone',
    'East Zone',
    'West Zone'
  ];

  // Update form values when state changes
  useEffect(() => {
    setValue('languagesSpoken', selectedLanguages);
  }, [selectedLanguages, setValue]);

  useEffect(() => {
    setValue('specialization', selectedSpecialization);
  }, [selectedSpecialization, setValue]);

  useEffect(() => {
    setValue('serviceAreas', selectedServiceAreas);
  }, [selectedServiceAreas, setValue]);

  useEffect(() => {
    setValue('achievements', achievements.filter(a => a.trim() !== ''));
  }, [achievements, setValue]);

  useEffect(() => {
    setValue('gender', gender);
  }, [gender, setValue]);

  useEffect(() => {
    setValue('availability', availability);
  }, [availability, setValue]);

  const handleLanguageToggle = (language: string) => {
    const updated = selectedLanguages.includes(language)
      ? selectedLanguages.filter(l => l !== language)
      : [...selectedLanguages, language];
    setSelectedLanguages(updated);
  };

  const handleSpecializationToggle = (specialization: string) => {
    const updated = selectedSpecialization.includes(specialization)
      ? selectedSpecialization.filter(s => s !== specialization)
      : [...selectedSpecialization, specialization];
    setSelectedSpecialization(updated);
  };

  const handleServiceAreaToggle = (area: string) => {
    const updated = selectedServiceAreas.includes(area)
      ? selectedServiceAreas.filter(a => a !== area)
      : [...selectedServiceAreas, area];
    setSelectedServiceAreas(updated);
  };

  const handleAchievementChange = (index: number, value: string) => {
    const updated = [...achievements];
    updated[index] = value;
    setAchievements(updated);
  };

  const addAchievement = () => {
    setAchievements([...achievements, '']);
  };

  const removeAchievement = (index: number) => {
    if (achievements.length > 1) {
      const updated = achievements.filter((_, i) => i !== index);
      setAchievements(updated);
    }
  };

  const handleFileUpload = (type: 'certificate' | 'idProof' | 'photo' | 'gallery', event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (type === 'gallery') {
      const fileList = Array.from(files);
      setVerificationFiles(prev => ({ ...prev, gallery: fileList }));
      setValue('verificationDocuments.gallery', fileList);
    } else {
      const file = files[0];
      setVerificationFiles(prev => ({ ...prev, [type]: file }));
      setValue(`verificationDocuments.${type}`, file);
    }
  };

  const onSubmit = async (data: PanditOnboardingForm) => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (selectedLanguages.length === 0) {
        toast.error('Please select at least one language');
        return;
      }
      if (selectedSpecialization.length === 0) {
        toast.error('Please select at least one specialization');
        return;
      }
      if (selectedServiceAreas.length === 0) {
        toast.error('Please select at least one service area');
        return;
      }
      if (data.password !== data.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (!data.acceptTerms) {
        toast.error('Please accept the terms and conditions');
        return;
      }
      if (!data.gender) {
        toast.error('Please select gender');
        return;
      }
      if (!data.availability) {
        toast.error('Please select availability (Offline/Online/Both)');
        return;
      }

      const formData = new FormData();
      
      // Add user registration fields
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('password', data.password);
      formData.append('role', 'PANDIT'); // Set role as PANDIT
      formData.append('gender', data.gender);
      
      // Add pandit professional fields
      formData.append('experienceYears', data.experienceYears.toString());
      formData.append('specialization', JSON.stringify(selectedSpecialization));
      formData.append('languagesSpoken', JSON.stringify(selectedLanguages));
      formData.append('serviceAreas', JSON.stringify(selectedServiceAreas));
      formData.append('availability', data.availability);
      formData.append('bio', data.bio);
      formData.append('education', data.education);
      formData.append('achievements', JSON.stringify(achievements.filter(a => a.trim() !== '')));
      
      // Add verification documents as files
      if (verificationFiles.certificate) {
        formData.append('certificate', verificationFiles.certificate);
      }
      if (verificationFiles.idProof) {
        formData.append('idProof', verificationFiles.idProof);
      }
      if (verificationFiles.photo) {
        formData.append('photo', verificationFiles.photo);
      }
      if (verificationFiles.gallery && verificationFiles.gallery.length) {
        verificationFiles.gallery.forEach((g, idx) => {
          formData.append('gallery', g, g.name);
        });
      }

      // Call pandit registration API (this will create user account and pandit profile)
      const response = await panditAPI.registerPandit(formData);
      
      if (response.data) {
        toast.success('Registration successful! Please wait while we verify your details. You will receive an email confirmation once your profile is approved.');
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Error registering pandit:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to register as pandit. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingContainer>
      {/* Header */}
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Main Content */}
      <MainContent>
        <FormContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Form Header */}
            <FormHeader>
              <FormTitle>आचार्य-पंडित पंजीकरण प्रपत्र</FormTitle>
              <FormSubtitle>Acharya-Pandit Registration Form</FormSubtitle>
            </FormHeader>

            <Form onSubmit={handleSubmit(onSubmit)}>
              {/* Personal Information */}
              <SectionTitle>Personal Information</SectionTitle>
              
              <FormRow>
                <InputGroup>
                  <Label>First Name *</Label>
                  <Input
                    type="text"
                    placeholder="Enter your first name"
                    {...register('firstName', { 
                      required: 'First name is required',
                      minLength: { value: 2, message: 'First name must be at least 2 characters' }
                    })}
                    error={errors.firstName?.message}
                  />
                </InputGroup>

                <InputGroup>
                  <Label>Last Name *</Label>
                  <Input
                    type="text"
                    placeholder="Enter your last name"
                    {...register('lastName', { 
                      required: 'Last name is required',
                      minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                    })}
                    error={errors.lastName?.message}
                  />
                </InputGroup>
              </FormRow>

              <FormRow>
                <InputGroup>
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
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
                  <Label>Phone Number *</Label>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    {...register('phone', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Please enter a valid 10-digit phone number',
                      },
                    })}
                    error={errors.phone?.message}
                  />
                </InputGroup>
              </FormRow>

              <FormRow>
                <InputGroup>
                  <Label>Password *</Label>
                  <Input
                    type="password"
                    placeholder="Create a strong password"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                    error={errors.password?.message}
                  />
                </InputGroup>

                <InputGroup>
                  <Label>Confirm Password *</Label>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    {...register('confirmPassword', { 
                      required: 'Please confirm your password',
                      validate: value => value === password || 'Passwords do not match'
                    })}
                    error={errors.confirmPassword?.message}
                  />
                </InputGroup>
              </FormRow>

              {/* Gender and Availability */}
              <FormRow>
                <InputGroup>
                  <Label>Gender *</Label>
                  <QualificationGrid>
                    <QualificationOption>
                      <RadioInput
                        type="radio"
                        id="gender-male"
                        checked={gender === 'Male'}
                        onChange={() => setGender('Male')}
                      />
                      <RadioLabel htmlFor="gender-male">Male</RadioLabel>
                    </QualificationOption>
                    <QualificationOption>
                      <RadioInput
                        type="radio"
                        id="gender-female"
                        checked={gender === 'Female'}
                        onChange={() => setGender('Female')}
                      />
                      <RadioLabel htmlFor="gender-female">Female</RadioLabel>
                    </QualificationOption>
                    <QualificationOption>
                      <RadioInput
                        type="radio"
                        id="gender-other"
                        checked={gender === 'Other'}
                        onChange={() => setGender('Other')}
                      />
                      <RadioLabel htmlFor="gender-other">Other</RadioLabel>
                    </QualificationOption>
                  </QualificationGrid>
                </InputGroup>

                <InputGroup>
                  <Label>Availability *</Label>
                  <QualificationGrid>
                    <QualificationOption>
                      <RadioInput
                        type="radio"
                        id="availability-offline"
                        checked={availability === 'Offline'}
                        onChange={() => setAvailability('Offline')}
                      />
                      <RadioLabel htmlFor="availability-offline">Offline</RadioLabel>
                    </QualificationOption>
                    <QualificationOption>
                      <RadioInput
                        type="radio"
                        id="availability-online"
                        checked={availability === 'Online'}
                        onChange={() => setAvailability('Online')}
                      />
                      <RadioLabel htmlFor="availability-online">Online</RadioLabel>
                    </QualificationOption>
                    <QualificationOption>
                      <RadioInput
                        type="radio"
                        id="availability-both"
                        checked={availability === 'Both'}
                        onChange={() => setAvailability('Both')}
                      />
                      <RadioLabel htmlFor="availability-both">Both</RadioLabel>
                    </QualificationOption>
                  </QualificationGrid>
                </InputGroup>
              </FormRow>

              {/* Terms and Conditions */}
              <InputGroup>
                <CheckboxContainer>
                  <CheckboxInput
                    type="checkbox"
                    id="acceptTerms"
                    {...register('acceptTerms', { 
                      required: 'You must accept the terms and conditions'
                    })}
                  />
                  <CheckboxLabel htmlFor="acceptTerms">
                    I accept the <TermsLink href="#" target="_blank">Terms and Conditions</TermsLink> and <PrivacyLink href="#" target="_blank">Privacy Policy</PrivacyLink> *
                  </CheckboxLabel>
                </CheckboxContainer>
                {errors.acceptTerms && <ErrorText>{errors.acceptTerms.message}</ErrorText>}
              </InputGroup>

              {/* Professional Details */}
              <SectionTitle>Professional Details</SectionTitle>
              
              <FormRow>
                <InputGroup>
                  <Label>अनुभव (वर्ष) * (Experience in Years *)</Label>
                  <Input
                    type="number"
                    placeholder="Years of experience"
                    {...register('experienceYears', { 
                      required: 'Experience is required',
                      min: { value: 0, message: 'Experience cannot be negative' },
                      max: { value: 50, message: 'Maximum experience is 50 years' }
                    })}
                    error={errors.experienceYears?.message}
                  />
                </InputGroup>
                <InputGroup>
                  <Label>शिक्षा * (Education *)</Label>
                  <Input
                    type="text"
                    placeholder="Your educational background"
                    {...register('education', { 
                      required: 'Education is required',
                      minLength: { value: 5, message: 'Please provide more details about your education' }
                    })}
                    error={errors.education?.message}
                  />
                </InputGroup>
              </FormRow>

              {/* Languages */}
              <SectionTitle>भाषाएँ * (Languages Known / Speaks *)</SectionTitle>
              <LanguagesGrid>
                {languages.map((language) => (
                  <LanguageOption key={language}>
                    <CheckboxInput
                      type="checkbox"
                      id={language}
                      checked={selectedLanguages.includes(language)}
                      onChange={() => handleLanguageToggle(language)}
                    />
                    <CheckboxLabel htmlFor={language}>{language}</CheckboxLabel>
                  </LanguageOption>
                ))}
              </LanguagesGrid>

              {/* Specialization */}
              <SectionTitle>विशेषज्ञता * (Specialization *)</SectionTitle>
              <SpecializationGrid>
                {specializations.map((specialization) => (
                  <SpecializationOption key={specialization}>
                    <CheckboxInput
                      type="checkbox"
                      id={specialization}
                      checked={selectedSpecialization.includes(specialization)}
                      onChange={() => handleSpecializationToggle(specialization)}
                    />
                    <CheckboxLabel htmlFor={specialization}>{specialization}</CheckboxLabel>
                  </SpecializationOption>
                ))}
              </SpecializationGrid>

              {/* Service Areas */}
              <SectionTitle>सेवा क्षेत्र * (Service Areas *)</SectionTitle>
              <ServiceAreasGrid>
                {serviceAreas.map((area) => (
                  <ServiceAreaOption key={area}>
                    <CheckboxInput
                      type="checkbox"
                      id={area}
                      checked={selectedServiceAreas.includes(area)}
                      onChange={() => handleServiceAreaToggle(area)}
                    />
                    <CheckboxLabel htmlFor={area}>{area}</CheckboxLabel>
                  </ServiceAreaOption>
                ))}
              </ServiceAreasGrid>

              {/* Achievements */}
              <SectionTitle>उपलब्धियां (Achievements)</SectionTitle>
              <AchievementsContainer>
                {achievements.map((achievement, index) => (
                  <AchievementInput key={index}>
                    <Input
                      type="text"
                      placeholder={`Achievement ${index + 1}`}
                      value={achievement}
                      onChange={(e) => handleAchievementChange(index, e.target.value)}
                    />
                    {achievements.length > 1 && (
                      <RemoveButton type="button" onClick={() => removeAchievement(index)}>
                        ✕
                      </RemoveButton>
                    )}
                  </AchievementInput>
                ))}
                <AddAchievementButton type="button" onClick={addAchievement}>
                  + Add Achievement
                </AddAchievementButton>
              </AchievementsContainer>

              {/* Bio */}
              <InputGroup>
                <Label>जीवन परिचय * (Bio *)</Label>
                <TextArea
                  placeholder="Tell us about your spiritual journey, experience, and what makes you unique..."
                  {...register('bio', { 
                    required: 'Bio is required',
                    minLength: { value: 50, message: 'Bio must be at least 50 characters' },
                    maxLength: { value: 1000, message: 'Bio must be less than 1000 characters' }
                  })}
                />
                {errors.bio && <ErrorText>{errors.bio.message}</ErrorText>}
              </InputGroup>

              {/* Verification Documents */}
              <SectionTitle>प्रमाणीकरण दस्तावेज (Verification Documents)</SectionTitle>
              <DocumentsContainer>
                <DocumentUpload>
                  <Label>शिक्षा प्रमाणपत्र (Shiksha Pramanpatra)</Label>
                  <FileUploadSection>
                    <FileInput
                      type="file"
                      id="certificate"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload('certificate', e)}
                    />
                    <FileUploadLabel htmlFor="certificate">
                      {verificationFiles.certificate ? verificationFiles.certificate.name : 'No file chosen'}
                    </FileUploadLabel>
                    <UploadButton type="button" onClick={() => document.getElementById('certificate')?.click()}>
                      Upload Certificate
                    </UploadButton>
                  </FileUploadSection>
                </DocumentUpload>

                <DocumentUpload>
                  <Label>पहचान प्रमाण (ID Proof)</Label>
                  <FileUploadSection>
                    <FileInput
                      type="file"
                      id="idProof"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload('idProof', e)}
                    />
                    <FileUploadLabel htmlFor="idProof">
                      {verificationFiles.idProof ? verificationFiles.idProof.name : 'No file chosen'}
                    </FileUploadLabel>
                    <UploadButton type="button" onClick={() => document.getElementById('idProof')?.click()}>
                      Upload ID Proof
                    </UploadButton>
                  </FileUploadSection>
                </DocumentUpload>

                <DocumentUpload>
                  <Label>फोटो (Photo)</Label>
                  <FileUploadSection>
                    <FileInput
                      type="file"
                      id="photo"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('photo', e)}
                    />
                    <FileUploadLabel htmlFor="photo">
                      {verificationFiles.photo ? verificationFiles.photo.name : 'No file chosen'}
                    </FileUploadLabel>
                    <UploadButton type="button" onClick={() => document.getElementById('photo')?.click()}>
                      Upload Photo
                    </UploadButton>
                  </FileUploadSection>
                </DocumentUpload>

                <DocumentUpload>
                  <Label>गैलरी (Gallery)</Label>
                  <FileUploadSection>
                    <FileInput
                      type="file"
                      id="gallery"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload('gallery', e)}
                    />
                    <FileUploadLabel htmlFor="gallery">
                      {verificationFiles.gallery && verificationFiles.gallery.length
                        ? `${verificationFiles.gallery.length} file(s) selected`
                        : 'No files chosen'}
                    </FileUploadLabel>
                    <UploadButton type="button" onClick={() => document.getElementById('gallery')?.click()}>
                      Upload Gallery
                    </UploadButton>
                  </FileUploadSection>
                </DocumentUpload>
              </DocumentsContainer>

              {/* Action Buttons */}
              <ActionButtons>
                <SubmitButton
                  type="submit"
                  variant="primary"
                  size="large"
                  disabled={isLoading}
                >
                  {isLoading ? <LoadingSpinner size="small" /> : 'Submit'}
                </SubmitButton>
                
                <ClearButton
                  type="button"
                  variant="outline"
                  size="large"
                  onClick={() => window.location.reload()}
                >
                  Clear
                </ClearButton>
              </ActionButtons>
            </Form>
          </motion.div>
        </FormContainer>
      </MainContent>
    </OnboardingContainer>
  );
};

// Styled Components
const OnboardingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8a65 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="%23ffffff" opacity="0.1"/><circle cx="80" cy="80" r="1.5" fill="%23ffffff" opacity="0.1"/><circle cx="40" cy="70" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="90" cy="30" r="2.5" fill="%23ffffff" opacity="0.1"/><circle cx="10" cy="90" r="1" fill="%23ffffff" opacity="0.1"/></svg>');
    background-size: 200px 200px;
    animation: sparkle 15s linear infinite;
  }

  @keyframes sparkle {
    0% { transform: translate(0, 0); }
    100% { transform: translate(-200px, -200px); }
  }
`;


const MainContent = styled.main`
  padding: ${({ theme }) => theme.spacing[8]} 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 80px);
`;

const FormContainer = styled.div`
  background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%);
  border-radius: ${({ theme }) => theme.borderRadius['3xl']};
  padding: ${({ theme }) => theme.spacing[8]};
  width: 100%;
  max-width: 800px;
  margin: 0 ${({ theme }) => theme.spacing[4]};
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  border: 4px solid ${({ theme }) => theme.colors.secondary};
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #ff6b35, #ffd700, #ff6b35);
    border-radius: ${({ theme }) => theme.borderRadius['3xl']};
    z-index: -1;
  }
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const FormTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const FormSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
`;

const GoogleAccountSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const GoogleAccountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const GoogleEmail = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SwitchAccountLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const GoogleNotice = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const RequiredText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.error};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  padding-bottom: ${({ theme }) => theme.spacing[2]};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.base};
  background: ${({ theme }) => theme.colors.white};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.base};
  background: ${({ theme }) => theme.colors.white};
  min-height: 120px;
  resize: vertical;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const LanguagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing[3]};
`;

const LanguageOption = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

const CheckboxLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
`;

const QualificationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[3]};
`;

const QualificationOption = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const RadioInput = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

const RadioLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
`;

const SpecializationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[3]};
`;

const SpecializationOption = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FileUploadSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
`;

const FileInput = styled.input`
  display: none;
`;

const FileUploadLabel = styled.label`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
`;

const UploadButton = styled.button`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing[8]};
`;

const SubmitButton = styled(Button)`
  background: ${({ theme }) => theme.colors.error};
  border-color: ${({ theme }) => theme.colors.error};

  &:hover {
    background: #d32f2f;
    border-color: #d32f2f;
  }
`;

const ClearButton = styled(Button)`
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textPrimary};
  border-color: ${({ theme }) => theme.colors.gray300};

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
    border-color: ${({ theme }) => theme.colors.gray400};
  }
`;

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.error};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const ServiceAreasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ServiceAreaOption = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const AchievementsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const AchievementInput = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const RemoveButton = styled.button`
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: #d32f2f;
  }
`;

const AddAchievementButton = styled.button`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};
  align-self: flex-start;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const DocumentsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const DocumentUpload = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const TermsLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;
  
  &:hover {
    opacity: 0.8;
  }
`;

const PrivacyLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;
  
  &:hover {
    opacity: 0.8;
  }
`;

export default PanditOnboardingPage;
