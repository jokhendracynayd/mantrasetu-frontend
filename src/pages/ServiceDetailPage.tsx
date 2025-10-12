import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import type { Service } from '../types';
import { serviceAPI } from '../services/api';

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPandit, setSelectedPandit] = useState<string>('');

  // Fetch service data
  useEffect(() => {
    const fetchService = async () => {
      if (!id) {
        setError('Service ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await serviceAPI.getService(id);
        setService(response.data);
      } catch (error: any) {
        console.error('Error fetching service:', error);
        setError(error.response?.data?.message || 'Failed to fetch service');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <ServiceContainer>
        <Container>
          <LoadingContainer>
            <LoadingSpinner size="large" />
            <LoadingText>Loading service details...</LoadingText>
          </LoadingContainer>
        </Container>
      </ServiceContainer>
    );
  }

  // Error state
  if (error || !service) {
    return (
      <ServiceContainer>
        <Container>
          <NotFoundContainer>
            <NotFoundTitle>Service Not Found</NotFoundTitle>
            <NotFoundDescription>
              {error || 'The service you\'re looking for doesn\'t exist or has been removed.'}
            </NotFoundDescription>
            <Button variant="primary" onClick={() => navigate('/services')}>
              Back to Services
            </Button>
          </NotFoundContainer>
        </Container>
      </ServiceContainer>
    );
  }

  const handleBookService = () => {
    if (selectedPandit) {
      navigate(`/bookings?service=${service.id}&pandit=${selectedPandit}`);
    } else {
      navigate(`/bookings?service=${service.id}`);
    }
  };

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'pooja': return '🕉️';
      case 'astrology': return '🔮';
      case 'virtual': return '💻';
      case 'products': return '🛍️';
      default: return '✨';
    }
  };


  return (
    <ServiceContainer>
      <Container>
        <ServiceHeader>
          <Breadcrumb>
            <BreadcrumbLink to="/services">Services</BreadcrumbLink>
            <BreadcrumbSeparator>›</BreadcrumbSeparator>
            <BreadcrumbCurrent>{service.name}</BreadcrumbCurrent>
          </Breadcrumb>
          
          <ServiceTitle>{service.name}</ServiceTitle>
          <ServiceSubtitle>{service.description}</ServiceSubtitle>
        </ServiceHeader>

        <ServiceContent>
          <ServiceMain>
            <ServiceImage>
              {service.imageUrl ? (
                <img src={service.imageUrl} alt={service.name} />
              ) : (
                <ServiceIcon>{getServiceIcon(service.category)}</ServiceIcon>
              )}
              <CategoryBadge category={service.category}>
                {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
              </CategoryBadge>
              <VirtualBadge isVirtual={service.isVirtual}>
                {service.isVirtual ? 'Virtual' : 'In-Person'}
              </VirtualBadge>
            </ServiceImage>

            <ServiceDetails>
              <DetailGrid>
                <DetailItem>
                  <DetailLabel>Duration</DetailLabel>
                  <DetailValue>{service.durationMinutes > 0 ? `${service.durationMinutes} minutes` : 'N/A'}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Price</DetailLabel>
                  <DetailValue>₹{service.basePrice}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Type</DetailLabel>
                  <DetailValue>{service.isVirtual ? 'Virtual' : 'In-Person'}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Category</DetailLabel>
                  <DetailValue>{service.category.charAt(0).toUpperCase() + service.category.slice(1)}</DetailValue>
                </DetailItem>
              </DetailGrid>

              <DetailedDescription>
                <h3>About This Service</h3>
                <p>{service.description}</p>
              </DetailedDescription>

              {service.instructions && (
                <RequirementsSection>
                  <h3>Instructions</h3>
                  <RequirementsList>
                    <RequirementItem>
                      <RequirementIcon>•</RequirementIcon>
                      {service.instructions}
                    </RequirementItem>
                  </RequirementsList>
                </RequirementsSection>
              )}
            </ServiceDetails>
          </ServiceMain>

          <ServiceSidebar>
            <BookingCard>
              <BookingTitle>Book This Service</BookingTitle>
              <BookingPrice>₹{service.basePrice}</BookingPrice>
              <BookingDuration>{service.durationMinutes > 0 ? `${service.durationMinutes} minutes` : 'N/A'}</BookingDuration>
              
              <PanditSelection>
                <PanditLabel>Select Pandit</PanditLabel>
                <PanditOption
                  selected={selectedPandit === 'default'}
                  onClick={() => setSelectedPandit('default')}
                >
                  <PanditInfo>
                    <PanditName>Available Pandits</PanditName>
                    <PanditSpecialization>Expert in {service.category} services</PanditSpecialization>
                    <PanditRating>⭐ 4.8+ rating</PanditRating>
                  </PanditInfo>
                </PanditOption>
              </PanditSelection>

              <BookingActions>
                <Button
                  variant="primary"
                  size="large"
                  fullWidth
                  onClick={handleBookService}
                >
                  Book Now
                </Button>
                <Button
                  variant="outline"
                  size="large"
                  fullWidth
                  onClick={() => navigate('/services')}
                >
                  Back to Services
                </Button>
              </BookingActions>
            </BookingCard>
          </ServiceSidebar>
        </ServiceContent>
      </Container>
    </ServiceContainer>
  );
};

const ServiceContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: ${({ theme }) => theme.spacing[8]} 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const ServiceHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const BreadcrumbLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  &:hover {
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const BreadcrumbCurrent = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const ServiceTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ServiceSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const ServiceContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing[8]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[6]};
  }
`;

const ServiceMain = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const ServiceImage = styled.div`
  height: 300px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}20, ${({ theme }) => theme.colors.secondary}20);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ServiceIcon = styled.div`
  font-size: 6rem;
  opacity: 0.7;
`;

const CategoryBadge = styled.div<{ category: string }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing[4]};
  left: ${({ theme }) => theme.spacing[4]};
  background: ${({ category }) => {
    switch (category) {
      case 'pooja': return '#ff6b35';
      case 'astrology': return '#8b5cf6';
      case 'virtual': return '#06b6d4';
      case 'products': return '#10b981';
      default: return '#6b7280';
    }
  }};
  color: white;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const VirtualBadge = styled.div<{ isVirtual: boolean }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing[4]};
  right: ${({ theme }) => theme.spacing[4]};
  background: ${({ isVirtual, theme }) => isVirtual ? theme.colors.info : theme.colors.success};
  color: white;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ServiceDetails = styled.div``;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const DetailLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DetailValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const DetailedDescription = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  h3 {
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.7;
    white-space: pre-line;
  }
`;


const RequirementsSection = styled.div`
  h3 {
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`;

const RequirementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const RequirementItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RequirementIcon = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const ServiceSidebar = styled.div``;

const BookingCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  position: sticky;
  top: ${({ theme }) => theme.spacing[8]};
`;

const BookingTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const BookingPrice = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const BookingDuration = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const PanditSelection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const PanditLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const PanditOption = styled.div<{ selected: boolean }>`
  padding: ${({ theme }) => theme.spacing[4]};
  border: 2px solid ${({ selected, theme }) => selected ? theme.colors.primary : theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  background: ${({ selected, theme }) => selected ? `${theme.colors.primary}10` : 'transparent'};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const PanditInfo = styled.div``;

const PanditName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const PanditSpecialization = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const PanditRating = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const BookingActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const NotFoundContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const NotFoundTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const NotFoundDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[12]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const LoadingText = styled.p`
  margin-top: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

export default ServiceDetailPage;
