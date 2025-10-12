import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { generatePlaceholderImage, getPanditPlaceholder } from '../utils/placeholder';

interface PanditProfile {
  id: string;
  name: string;
  title: string;
  rating: number;
  experience: string;
  specializations: string[];
  languages: string[];
  image: string;
  hourlyRate: number;
  bio: string;
  phone?: string;
  address?: string;
  gallery?: string[];
  reviews?: Array<{
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

const PanditProfilePage: React.FC = () => {
  const { panditId } = useParams<{ panditId: string }>();
  const [pandit, setPandit] = useState<PanditProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPanditProfile = async () => {
      if (!panditId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch pandit data from homepage API
        const response = await fetch(`${import.meta.env.VITE_API_URL|| 'http://localhost:3000/api/v1'}/homepage`);
        const data = await response.json();

        if (data.success && data.data.featuredPandits) {
          const panditData = data.data.featuredPandits.find((p: any) => p.id === panditId);
          
          if (panditData) {
            // Transform the data to match our interface
            const profile: PanditProfile = {
              id: panditData.id,
              name: panditData.name,
              title: panditData.title,
              rating: panditData.rating,
              experience: panditData.experience,
              specializations: panditData.specializations,
              languages: panditData.languages,
              image: panditData.image,
              hourlyRate: panditData.hourlyRate,
              bio: panditData.bio,
              phone: '+91 XXXXX XXXXX', // Masked for privacy
              address: '123, Anywhere, City Anycity', // Placeholder
              gallery: [
                generatePlaceholderImage(200, 150, 'Puja 1'),
                generatePlaceholderImage(200, 150, 'Puja 2'),
                generatePlaceholderImage(200, 150, 'Puja 3')
              ],
              reviews: [
                {
                  id: '1',
                  name: 'Priya R',
                  rating: 4,
                  comment: 'Pandit ji guided us beautifully during our Grih Pravesh. His knowledge and dedication are unmatched.',
                  date: '2024-01-15'
                },
                {
                  id: '2',
                  name: 'Rahul',
                  rating: 5,
                  comment: 'Highly professional and authentic puja services. Truly blessed experience.',
                  date: '2024-01-10'
                }
              ]
            };
            setPandit(profile);
          } else {
            setError('Pandit not found');
          }
        } else {
          setError('Failed to load pandit data');
        }
      } catch (err) {
        console.error('Error fetching pandit profile:', err);
        setError('Failed to load pandit profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPanditProfile();
  }, [panditId]);

  if (isLoading) {
    return (
      <ProfileContainer>
        <LoadingContainer>
          <LoadingSpinner size="large" />
          <LoadingText>Loading pandit profile...</LoadingText>
        </LoadingContainer>
      </ProfileContainer>
    );
  }

  if (error || !pandit) {
    return (
      <ProfileContainer>
        <ErrorContainer>
          <ErrorTitle>Pandit Not Found</ErrorTitle>
          <ErrorMessage>{error || 'The requested pandit profile could not be found.'}</ErrorMessage>
          <Button as={Link} to="/services" variant="primary">
            Back to Services
          </Button>
        </ErrorContainer>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ProfileCard>
          {/* Profile Header */}
          <ProfileHeader>
            <ProfileImage>
              <img 
                src={pandit.image || getPanditPlaceholder(pandit.name)} 
                alt={pandit.name} 
              />
            </ProfileImage>
            <ProfileInfo>
              <PanditName>{pandit.name}</PanditName>
              <Specialization>
                Specialist in {pandit.specializations.slice(0, 3).join(', ')}
              </Specialization>
              <RatingContainer>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} filled={i < Math.floor(pandit.rating)}>
                    ★
                  </Star>
                ))}
              </RatingContainer>
            </ProfileInfo>
          </ProfileHeader>

          {/* Contact Details */}
          <InfoSection>
            <SectionTitle>Contact Details</SectionTitle>
            <ContactItem>
              <ContactIcon>📞</ContactIcon>
              <ContactText>{pandit.phone}</ContactText>
            </ContactItem>
            <ContactItem>
              <ContactIcon>📍</ContactIcon>
              <ContactText>{pandit.address}</ContactText>
            </ContactItem>
          </InfoSection>

          {/* Languages */}
          <InfoSection>
            <SectionTitle>Languages</SectionTitle>
            <LanguagesContainer>
              {pandit.languages.map((language, index) => (
                <LanguageTag key={index}>{language}</LanguageTag>
              ))}
            </LanguagesContainer>
          </InfoSection>

          {/* About */}
          <InfoSection>
            <SectionHeader>
              <SectionTitle>About Pandit Ji</SectionTitle>
              <MoreLink>More</MoreLink>
            </SectionHeader>
            <AboutText>{pandit.bio}</AboutText>
          </InfoSection>

          {/* Gallery */}
          <InfoSection>
            <SectionTitle>Gallery - Past Puja Pictures & Recording</SectionTitle>
            <GalleryContainer>
              {pandit.gallery?.map((image, index) => (
                <GalleryImage key={index}>
                  <img src={image} alt={`Puja ${index + 1}`} />
                </GalleryImage>
              ))}
            </GalleryContainer>
          </InfoSection>

          {/* Reviews */}
          <InfoSection>
            <SectionTitle>Ratings & Reviews</SectionTitle>
            <ReviewsContainer>
              {pandit.reviews?.map((review) => (
                <ReviewCard key={review.id}>
                  <ReviewHeader>
                    <ReviewerName>{review.name}</ReviewerName>
                    <ReviewRating>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} filled={i < review.rating}>
                          ★
                        </Star>
                      ))}
                    </ReviewRating>
                  </ReviewHeader>
                  <ReviewComment>{review.comment}</ReviewComment>
                </ReviewCard>
              ))}
            </ReviewsContainer>
          </InfoSection>

          {/* Action Buttons */}
          <ActionButtons>
            <BookButton variant="primary" size="large">
              Book Puja with Pandit Ji
            </BookButton>
            <ConsultButton variant="secondary" size="large">
              Consult Pandit Ji
            </ConsultButton>
            <DetailsButton variant="outline" size="medium">
              View Full Service Details
            </DetailsButton>
          </ActionButtons>
        </ProfileCard>
      </motion.div>
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  padding: ${({ theme }) => theme.spacing[8]} 0;
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
  color: ${({ theme }) => theme.colors.white};
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
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  opacity: 0.9;
`;

const ProfileCard = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  border: 3px solid #ff6b35;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  padding-bottom: ${({ theme }) => theme.spacing[6]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray200};

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ProfileImage = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #ff6b35;
  box-shadow: ${({ theme }) => theme.shadows.lg};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const PanditName = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Specialization = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 4px;
`;

const Star = styled.span<{ filled: boolean }>`
  color: ${({ filled }) => filled ? '#ffd700' : '#e5e7eb'};
  font-size: ${({ theme }) => theme.fontSizes.xl};
`;

const InfoSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border-left: 4px solid #ff6b35;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const MoreLink = styled.span`
  color: #ff6b35;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  text-decoration: underline;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ContactIcon = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const ContactText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const LanguagesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const LanguageTag = styled.span`
  background: #ff6b35;
  color: white;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const AboutText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const GalleryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const GalleryImage = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};

  img {
    width: 100%;
    height: 120px;
    object-fit: cover;
  }
`;

const ReviewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const ReviewCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ReviewerName = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ReviewRating = styled.div`
  display: flex;
  gap: 2px;
`;

const ReviewComment = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[8]};
`;

const BookButton = styled(Button)`
  background: #ff6b35;
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};

  &:hover {
    background: #e55a2b;
  }
`;

const ConsultButton = styled(Button)`
  background: #dc2626;
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};

  &:hover {
    background: #b91c1c;
  }
`;

const DetailsButton = styled(Button)`
  background: transparent;
  color: #ff6b35;
  border: 2px solid #ff6b35;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  &:hover {
    background: #ff6b35;
    color: white;
  }
`;

export default PanditProfilePage;

