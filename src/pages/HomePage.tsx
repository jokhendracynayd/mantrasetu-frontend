import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import HeroSection from '../components/Home/HeroSection';
import SpiritualJourneySection from '../components/Home/SpiritualJourneySection';
import SpecialPujasSection from '../components/Home/SpecialPujasSection';
import FindPanditSection from '../components/Home/FindPanditSection';
import WhyChooseUsSection from '../components/Home/WhyChooseUsSection';
import MantraSetuToolsSection from '../components/Home/MantraSetuToolsSection';
import SpiritualLibrarySection from '../components/Home/SpiritualLibrarySection';
import PromotionalBanner from '../components/Home/PromotionalBanner';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useHomepageData } from '../hooks/useHomepageData';

const HomePage: React.FC = () => {
  const { data, loading, error, refetch } = useHomepageData();

  if (loading) {
    return (
      <HomePageContainer>
        <LoadingContainer>
          <LoadingSpinner size="large" />
          <LoadingText>Loading homepage content...</LoadingText>
        </LoadingContainer>
      </HomePageContainer>
    );
  }

  if (error) {
    return (
      <HomePageContainer>
        <ErrorContainer>
          <ErrorTitle>Failed to load homepage</ErrorTitle>
          <ErrorMessage>{error}</ErrorMessage>
          <RetryButton onClick={refetch}>Try Again</RetryButton>
        </ErrorContainer>
      </HomePageContainer>
    );
  }

  if (!data) {
    return (
      <HomePageContainer>
        <ErrorContainer>
          <ErrorTitle>No data available</ErrorTitle>
          <ErrorMessage>Unable to load homepage content.</ErrorMessage>
          <RetryButton onClick={refetch}>Try Again</RetryButton>
        </ErrorContainer>
      </HomePageContainer>
    );
  }

  return (
    <HomePageContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          minHeight: '100vh',
          width: '100%'
        }}
      >
        <HeroSection heroContent={data!.hero} />
        <SpiritualJourneySection />
        <SpecialPujasSection services={data!.featuredServices} />
        <FindPanditSection pandits={data!.featuredPandits} />
        <PromotionalBanner stats={data!.stats} />
        <WhyChooseUsSection />
        <MantraSetuToolsSection />
        <SpiritualLibrarySection />
      </motion.div>
    </HomePageContainer>
  );
};

const HomePageContainer = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255, 107, 53, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 107, 53, 0.05) 0%, transparent 50%);
  min-height: 100vh;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const LoadingText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  gap: ${({ theme }) => theme.spacing[4]};
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
`;

const ErrorTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const RetryButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export default HomePage;
