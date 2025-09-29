import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import Button from '../UI/Button';
import type { HeroContent } from '../../types/homepage';

interface HeroSectionProps {
  heroContent?: HeroContent;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  heroContent = {
    title: 'Authentic Rituals, Guided by Learned Pandits',
    description: 'Book Verified Pandits for Astrology, Grih Pravesh, Satyanarayan, and all rituals on MantraSetu.',
    buttonText: 'Book Pandit Ji',
    buttonLink: '/services'
  }
}) => {
  return (
    <HeroContainer>
      <Container>
        <HeroContent>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HeroText>
              <HeroTitle>{heroContent.title}</HeroTitle>
              <HeroDescription>
                {heroContent.description}
              </HeroDescription>
              <HeroButtons>
                <Button
                  variant="primary"
                  size="large"
                  as={Link}
                  to={heroContent.buttonLink}
                >
                  {heroContent.buttonText}
                </Button>
              </HeroButtons>
            </HeroText>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <HeroImage>
              <PanditIllustration>
                <img 
                  src={heroContent.imageUrl || require('../../assets/image.png')} 
                  alt={heroContent.imageAlt || "Pandit performing traditional puja ceremony"} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </PanditIllustration>
            </HeroImage>
          </motion.div>
        </HeroContent>
        
        {/* Carousel dots */}
        <CarouselDots>
          <Dot active />
          <Dot />
          <Dot />
        </CarouselDots>
      </Container>
    </HeroContainer>
  );
};

const HeroContainer = styled.section`
  background: #ff6b35;
  padding: ${({ theme }) => theme.spacing[20]} 0;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing[16]} 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
  position: relative;
  z-index: 1;
`;

const HeroContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[12]};
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[8]};
    text-align: center;
  }
`;

const HeroText = styled.div`
  color: ${({ theme }) => theme.colors.white};
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes['4xl']};
  }

  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }
`;

const HeroDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  opacity: 0.9;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.base};
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: 480px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;

const HeroImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PanditIllustration = styled.div`
  width: 400px;
  height: 400px;
  
  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
  }
`;

const CarouselDots = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[8]};
`;

const Dot = styled.div<{ active?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ active, theme }) => active ? theme.colors.white : 'rgba(255, 255, 255, 0.5)'};
  transition: background ${({ theme }) => theme.transitions.fast};
`;

export default HeroSection;
