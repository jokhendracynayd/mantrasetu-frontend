import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import type { RootState, AppDispatch } from '../store/store';
import { fetchServices, fetchAvailablePandits } from '../store/slices/bookingSlice';
import { serviceAPI } from '../services/api';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { getLargeServicePlaceholder, getPanditPlaceholder } from '../utils/placeholder';

// Dummy data for services
const dummyServices: Service[] = [
  {
    id: '1',
    name: 'Maha Lakshmi Puja',
    description: 'Seek blessings of Goddess Lakshmi for wealth, prosperity, and abundance. This sacred ceremony includes traditional rituals, mantras, and offerings.',
    category: 'POOJA',
    subcategory: 'Devotional',
    durationMinutes: 120,
    basePrice: 2500,
    isVirtual: false,
    requiresSamagri: true,
    instructions: 'Traditional Lakshmi puja with all necessary materials.',
    isActive: true,
    imageUrl: getLargeServicePlaceholder('Lakshmi Puja'),
    tags: ['lakshmi', 'wealth', 'prosperity', 'abundance'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Vedic Astrology Reading',
    description: 'Get personalized astrological guidance based on your birth chart. Includes predictions, remedies, and life guidance from expert astrologers.',
    category: 'ASTROLOGY',
    subcategory: 'Consultation',
    durationMinutes: 60,
    basePrice: 1500,
    isVirtual: true,
    requiresSamagri: false,
    instructions: 'Please provide your birth details for accurate analysis.',
    isActive: true,
    imageUrl: getLargeServicePlaceholder('Astrology'),
    tags: ['astrology', 'birth chart', 'predictions', 'guidance'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Griha Pravesh Puja',
    description: 'Bless your new home with traditional house warming ceremony. Includes Vastu Shastra consultation and purification rituals.',
    category: 'POOJA',
    subcategory: 'Housewarming',
    durationMinutes: 180,
    basePrice: 3500,
    isVirtual: false,
    requiresSamagri: true,
    instructions: 'Please provide the house address and preferred date.',
    isActive: true,
    imageUrl: getLargeServicePlaceholder('Griha Pravesh'),
    tags: ['housewarming', 'vastu', 'prosperity', 'new home'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Virtual Mantra Chanting',
    description: 'Experience the power of sacred mantras through live virtual sessions. Learn proper pronunciation and spiritual significance.',
    category: 'CONSULTATION',
    subcategory: 'Spiritual',
    durationMinutes: 45,
    basePrice: 800,
    isVirtual: true,
    requiresSamagri: false,
    instructions: 'Virtual session will be conducted via video call.',
    isActive: true,
    imageUrl: getLargeServicePlaceholder('Mantra Chanting'),
    tags: ['mantra', 'chanting', 'spiritual', 'virtual'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Rudrabhishek Puja',
    description: 'Powerful Shiva worship ceremony for spiritual growth and protection. Includes 108 names of Lord Shiva and sacred offerings.',
    category: 'POOJA',
    subcategory: 'Devotional',
    durationMinutes: 150,
    basePrice: 3000,
    isVirtual: false,
    requiresSamagri: true,
    instructions: 'Please specify if you want to perform at temple or home.',
    isActive: true,
    imageUrl: getLargeServicePlaceholder('Rudrabhishek'),
    tags: ['shiva', 'obstacles', 'strength', 'success'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Kundali Analysis',
    description: 'Comprehensive birth chart analysis including planetary positions, doshas, and personalized remedies for life challenges.',
    category: 'ASTROLOGY',
    subcategory: 'Analysis',
    durationMinutes: 90,
    basePrice: 2000,
    isVirtual: true,
    requiresSamagri: false,
    instructions: 'Please provide your birth details for comprehensive analysis.',
    isActive: true,
    imageUrl: getLargeServicePlaceholder('Kundali'),
    tags: ['kundali', 'birth chart', 'analysis', 'remedies'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  durationMinutes: number;
  basePrice: number;
  isVirtual: boolean;
  requiresSamagri: boolean;
  instructions?: string;
  isActive: boolean;
  imageUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const ServicesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { services, isLoading, error } = useSelector((state: RootState) => state.booking);
  const [searchParams] = useSearchParams();
  const panditId = searchParams.get('panditId');
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [apiServices, setApiServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState<boolean>(true);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [selectedPandit, setSelectedPandit] = useState<any>(null);
  const [isLoadingPandit, setIsLoadingPandit] = useState<boolean>(false);

  useEffect(() => {
    const fetchServicesFromAPI = async () => {
      try {
        setIsLoadingServices(true);
        setServicesError(null);
        const response = await serviceAPI.getAllServices();
        setApiServices(response.data.services || []);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        setServicesError('Failed to load services');
        setApiServices([]);
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchServicesFromAPI();
  }, []);

  useEffect(() => {
    const fetchPanditDetails = async () => {
      if (panditId) {
        try {
          setIsLoadingPandit(true);
          // For now, we'll use the pandit data from the homepage API
          // In a real app, you'd have a dedicated pandit detail API
          const response = await fetch(`${import.meta.env.VITE_API_URL|| 'http://localhost:3000/api/v1'}/homepage`);
          const data = await response.json();
          
          if (data.success && data.data.featuredPandits) {
            const pandit = data.data.featuredPandits.find((p: any) => p.id === panditId);
            setSelectedPandit(pandit || null);
          }
        } catch (error) {
          console.error('Failed to fetch pandit details:', error);
          setSelectedPandit(null);
        } finally {
          setIsLoadingPandit(false);
        }
      } else {
        setSelectedPandit(null);
      }
    };

    fetchPanditDetails();
  }, [panditId]);

  const categories = [
    { value: 'all', label: 'All Services' },
    { value: 'POOJA', label: 'Poojas' },
    { value: 'ASTROLOGY', label: 'Astrology' },
    { value: 'HAVAN', label: 'Havan' },
    { value: 'KATHA', label: 'Katha' },
    { value: 'SPECIAL_OCCASION', label: 'Special Occasions' },
    { value: 'CONSULTATION', label: 'Consultation' },
  ];

  // Use API data if available, fallback to dummy data
  const servicesToDisplay = apiServices.length > 0 ? apiServices : dummyServices;

  const filteredServices = servicesToDisplay.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.tags && service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const handleBookService = async (serviceId: string) => {
    try {
      // Navigate to bookings page with service ID to start booking process
      window.location.href = `/bookings?service=${serviceId}`;
    } catch (error) {
      console.error('Failed to book service:', error);
      // Still navigate to bookings page even if API fails
      window.location.href = `/bookings?service=${serviceId}`;
    }
  };

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'POOJA':
      case 'pooja': return '🕉️';
      case 'ASTROLOGY':
      case 'astrology': return '🔮';
      case 'HAVAN': return '🔥';
      case 'KATHA': return '📖';
      case 'SPECIAL_OCCASION': return '🎉';
      case 'CONSULTATION': return '💬';
      case 'virtual': return '💻';
      case 'products': return '🛍️';
      default: return '✨';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'pooja': return '#ff6b35';
      case 'astrology': return '#8b5cf6';
      case 'virtual': return '#06b6d4';
      case 'products': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <ServicesContainer>
      <Container>
        {selectedPandit ? (
          <PanditProfileSection>
            <PanditProfileCard>
              <PanditImage>
                <img src={selectedPandit.image || getPanditPlaceholder(selectedPandit.name)} alt={selectedPandit.name} />
              </PanditImage>
              <PanditDetails>
                <PanditName>{selectedPandit.name}</PanditName>
                <PanditTitle>{selectedPandit.title}</PanditTitle>
                <RatingContainer>
                  <Stars>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} filled={i < Math.floor(selectedPandit.rating)}>
                        ★
                      </Star>
                    ))}
                  </Stars>
                  <RatingValue>{selectedPandit.rating.toFixed(1)}</RatingValue>
                </RatingContainer>
                <Experience>{selectedPandit.experience} experience</Experience>
                <Specializations>
                  {selectedPandit.specializations.map((spec: string, i: number) => (
                    <SpecializationTag key={i}>{spec}</SpecializationTag>
                  ))}
                </Specializations>
                <Languages>
                  Languages: {selectedPandit.languages.join(', ')}
                </Languages>
                <HourlyRate>₹{selectedPandit.hourlyRate}/hour</HourlyRate>
                {selectedPandit.bio && <Bio>{selectedPandit.bio}</Bio>}
                <ViewProfileButton as={Link} to={`/pandit/${selectedPandit.id}`}>
                  View Full Profile
                </ViewProfileButton>
              </PanditDetails>
            </PanditProfileCard>
          </PanditProfileSection>
        ) : null}
        
        <ServicesHeader>
          <ServicesTitle>
            {selectedPandit ? `Services by ${selectedPandit.name}` : 'Our Spiritual Services'}
          </ServicesTitle>
          <ServicesSubtitle>
            {selectedPandit ? `Book services with ${selectedPandit.name}` : 'Discover our comprehensive range of authentic spiritual services'}
          </ServicesSubtitle>
          
          <ServicesStats>
            <StatItem>
              <StatNumber>{servicesToDisplay.length}</StatNumber>
              <StatLabel>Total Services</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{servicesToDisplay.filter(s => s.category === 'POOJA').length}</StatNumber>
              <StatLabel>Poojas</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{servicesToDisplay.filter(s => s.category === 'ASTROLOGY').length}</StatNumber>
              <StatLabel>Astrology</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{servicesToDisplay.filter(s => s.isVirtual).length}</StatNumber>
              <StatLabel>Virtual Services</StatLabel>
            </StatItem>
          </ServicesStats>
        </ServicesHeader>

        <ServicesContent>
          {/* Search and Filter Section */}
          <FilterSection>
            <SearchContainer>
              <SearchInput
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchContainer>
            
            <CategoryFilters>
              {categories.map((category) => (
                <CategoryButton
                  key={category.value}
                  active={selectedCategory === category.value}
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label}
                </CategoryButton>
              ))}
            </CategoryFilters>
          </FilterSection>

          {/* Services Grid */}
          {isLoadingServices ? (
            <LoadingContainer>
              <LoadingSpinner size="large" />
            </LoadingContainer>
          ) : servicesError ? (
            <ErrorContainer>
              <ErrorMessage>{servicesError}</ErrorMessage>
              <Button variant="primary" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </ErrorContainer>
          ) : filteredServices.length > 0 ? (
            <ServicesGrid>
              {filteredServices.map((service) => (
                <ServiceCard key={service.id}>
                  <ServiceImage>
                    {service.imageUrl ? (
                      <img src={service.imageUrl} alt={service.name} />
                    ) : (
                      <ServiceIcon>
                        {getServiceIcon(service.category)}
                      </ServiceIcon>
                    )}
                    <CategoryBadge category={service.category}>
                      {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                    </CategoryBadge>
                    <VirtualBadge isVirtual={service.isVirtual}>
                      {service.isVirtual ? 'Virtual' : 'In-Person'}
                    </VirtualBadge>
                  </ServiceImage>
                  
                  <ServiceContent>
                    <ServiceTitle>{service.name}</ServiceTitle>
                    <ServiceDescription>{service.description}</ServiceDescription>
                    
                    <ServiceDetails>
                      <ServiceDetail>
                        <DetailLabel>Duration:</DetailLabel>
                        <DetailValue>{service.durationMinutes > 0 ? `${service.durationMinutes} minutes` : 'N/A'}</DetailValue>
                      </ServiceDetail>
                      <ServiceDetail>
                        <DetailLabel>Price:</DetailLabel>
                        <DetailValue>₹{service.basePrice}</DetailValue>
                      </ServiceDetail>
                      <ServiceDetail>
                        <DetailLabel>Type:</DetailLabel>
                        <DetailValue>{service.isVirtual ? 'Virtual' : 'In-Person'}</DetailValue>
                      </ServiceDetail>
                      <ServiceDetail>
                        <DetailLabel>Category:</DetailLabel>
                        <DetailValue>{service.category.charAt(0).toUpperCase() + service.category.slice(1).toLowerCase()}</DetailValue>
                      </ServiceDetail>
                    </ServiceDetails>
                    
                    <ServiceActions>
                      <Button
                        variant="primary"
                        size="medium"
                        onClick={() => handleBookService(service.id)}
                      >
                        Book Service
                      </Button>
                      <Button
                        variant="outline"
                        size="medium"
                        onClick={() => window.location.href = `/services/${service.id}`}
                      >
                        Learn More
                      </Button>
                    </ServiceActions>
                  </ServiceContent>
                </ServiceCard>
              ))}
            </ServicesGrid>
          ) : (
            <EmptyState>
              <EmptyTitle>No Services Found</EmptyTitle>
              <EmptyDescription>
                {searchQuery || selectedCategory !== 'all'
                  ? 'No services match your current filters. Try adjusting your search criteria.'
                  : 'No services are currently available. Please check back later.'
                }
              </EmptyDescription>
              <Button variant="primary" onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}>
                Clear Filters
              </Button>
            </EmptyState>
          )}
        </ServicesContent>
      </Container>
    </ServicesContainer>
  );
};

const ServicesContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: ${({ theme }) => theme.spacing[8]} 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const ServicesHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[12]};
`;

const ServicesTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ServicesSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const ServicesStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-top: ${({ theme }) => theme.spacing[8]};
  padding: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const ServicesContent = styled.div``;

const FilterSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  padding: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const SearchContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.base};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CategoryFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const CategoryButton = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme, active }) => 
    active ? theme.colors.primary : theme.colors.gray300};
  background: ${({ theme, active }) => 
    active ? theme.colors.primary : theme.colors.white};
  color: ${({ theme, active }) => 
    active ? theme.colors.white : theme.colors.textPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme, active }) => 
      active ? theme.colors.primary : theme.colors.gray100};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;

const ServiceCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: all ${({ theme }) => theme.transitions.normal};
  border: 1px solid ${({ theme }) => theme.colors.gray200};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows['2xl']};
  }
`;

const ServiceImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}20, ${({ theme }) => theme.colors.secondary}20);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ServiceIcon = styled.div`
  font-size: 4rem;
  opacity: 0.7;
`;

const CategoryBadge = styled.div<{ category: string }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing[3]};
  left: ${({ theme }) => theme.spacing[3]};
  background: ${({ category }) => {
    switch (category) {
      case 'POOJA': return '#ff6b35';
      case 'ASTROLOGY': return '#8b5cf6';
      case 'HAVAN': return '#dc2626';
      case 'KATHA': return '#059669';
      case 'SPECIAL_OCCASION': return '#7c3aed';
      case 'CONSULTATION': return '#0891b2';
      case 'pooja': return '#ff6b35';
      case 'astrology': return '#8b5cf6';
      case 'virtual': return '#06b6d4';
      case 'products': return '#10b981';
      default: return '#6b7280';
    }
  }};
  color: white;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const VirtualBadge = styled.div<{ isVirtual: boolean }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing[3]};
  right: ${({ theme }) => theme.spacing[3]};
  background: ${({ isVirtual, theme }) => isVirtual ? theme.colors.info : theme.colors.success};
  color: white;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ServiceContent = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const ServiceTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const ServiceDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ServiceDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ServiceDetail = styled.div`
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
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const ServiceActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const EmptyDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  line-height: 1.6;
`;

const PanditProfileSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const PanditProfileCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const PanditImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid ${({ theme }) => theme.colors.primary};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PanditDetails = styled.div`
  flex: 1;
`;

const PanditName = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const PanditTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled.span<{ filled: boolean }>`
  color: ${({ filled, theme }) => filled ? theme.colors.secondary : theme.colors.gray300};
  font-size: ${({ theme }) => theme.fontSizes.base};
`;

const RatingValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Experience = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Specializations = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const SpecializationTag = styled.span`
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const Languages = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const HourlyRate = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Bio = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const ViewProfileButton = styled(Button)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-top: ${({ theme }) => theme.spacing[4]};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
  }
`;

export default ServicesPage;
