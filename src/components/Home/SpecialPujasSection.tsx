import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import type { ServiceCard } from '../../types/homepage';

interface SpecialPujasSectionProps {
  services?: ServiceCard[];
}

const SpecialPujasSection: React.FC<SpecialPujasSectionProps> = ({ 
  services = [] 
}) => {

  return (
    <SectionContainer>
      <Container>
        <SectionHeader>
          <SectionTitle>MantraSetu Special Pujas</SectionTitle>
          <ViewAllLink to="/services">
            View all <ArrowIcon>→</ArrowIcon>
          </ViewAllLink>
        </SectionHeader>

        <PujasGrid>
          {services.length > 0 ? (
            services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PujaCard as={Link} to={service.link}>
                  <OrnamentalBorder>
                    <svg viewBox="0 0 200 200" width="100%" height="100%">
                      <defs>
                        <pattern id={`puja-ornament-${service.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M20 0 L25 15 L40 20 L25 25 L20 40 L15 25 L0 20 L15 15 Z" fill="#ffd700" opacity="0.3"/>
                        </pattern>
                      </defs>
                      <circle cx="100" cy="100" r="90" fill={`url(#puja-ornament-${service.id})`} />
                      <circle cx="100" cy="100" r="85" fill="none" stroke="#ffd700" strokeWidth="2" opacity="0.5" />
                      <circle cx="100" cy="100" r="75" fill="none" stroke="#ffd700" strokeWidth="1" opacity="0.3" />
                    </svg>
                  </OrnamentalBorder>
                  
                  <PujaImage>
                    <img src={service.image || `https://via.placeholder.com/200x200/ff6b35/ffffff?text=${service.name.substring(0, 2)}`} alt={service.name} />
                  </PujaImage>
                  
                  <PujaContent>
                    <PujaTitle>{service.name}</PujaTitle>
                    <PujaDescription>{service.description}</PujaDescription>
                    {service.basePrice && (
                      <PujaPrice>Starting from ₹{service.basePrice}</PujaPrice>
                    )}
                  </PujaContent>
                </PujaCard>
              </motion.div>
            ))
          ) : (
            <EmptyState>
              <EmptyStateText>No featured services available at the moment.</EmptyStateText>
              <EmptyStateButton as={Link} to="/services">
                Browse All Services
              </EmptyStateButton>
            </EmptyState>
          )}
        </PujasGrid>
      </Container>
    </SectionContainer>
  );
};

const SectionContainer = styled.section`
  padding: ${({ theme }) => theme.spacing[20]} 0;
  background: ${({ theme }) => theme.colors.white};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing[16]} 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[12]};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
    text-align: center;
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }
`;

const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const ArrowIcon = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  transition: transform ${({ theme }) => theme.transitions.fast};
  
  ${ViewAllLink}:hover & {
    transform: translateX(4px);
  }
`;

const PujasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing[8]};

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: ${({ theme }) => theme.spacing[6]};
  }
`;

const PujaCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: all ${({ theme }) => theme.transitions.normal};
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  width: 280px;
  height: 280px;
  margin: 0 auto;

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadows['2xl']};
  }

  @media (max-width: 768px) {
    width: 250px;
    height: 250px;
    padding: ${({ theme }) => theme.spacing[6]};
  }
`;

const OrnamentalBorder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
`;

const PujaImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  position: relative;
  z-index: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const PujaContent = styled.div`
  position: relative;
  z-index: 1;
`;

const PujaTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const PujaDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const PujaPrice = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[12]};
  text-align: center;
`;

const EmptyStateText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const EmptyStateButton = styled(Link)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  transition: all ${({ theme }) => theme.transitions.normal};
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
  }
`;

export default SpecialPujasSection;
