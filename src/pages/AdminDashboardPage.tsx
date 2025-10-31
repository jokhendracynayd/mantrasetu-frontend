import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import type { RootState, AppDispatch } from '../store/store';
import { fetchBookings } from '../store/slices/bookingSlice';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const AdminDashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { bookings, isLoading } = useSelector((state: RootState) => state.booking);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const allBookings = Array.isArray(bookings) ? bookings : [];
  const pendingBookings = allBookings.filter(booking => booking.status === 'PENDING');
  const confirmedBookings = allBookings.filter(booking => booking.status === 'CONFIRMED');
  const completedBookings = allBookings.filter(booking => booking.status === 'COMPLETED');
  const cancelledBookings = allBookings.filter(booking => booking.status === 'CANCELLED');

  const totalRevenue = completedBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const pendingRevenue = allBookings
    .filter(booking => booking.status === 'COMPLETED' && booking.paymentStatus === 'PENDING')
    .reduce((sum, booking) => sum + booking.totalAmount, 0);

  return (
    <DashboardContainer>
      <Container>
        <DashboardHeader>
          <DashboardTitle>
            Admin Dashboard
          </DashboardTitle>
          <DashboardSubtitle>Welcome back, {user?.firstName || 'Admin'}! Manage the platform</DashboardSubtitle>
        </DashboardHeader>

        <DashboardContent>
          <DashboardGrid>
            <DashboardCard>
              <CardTitle>Platform Overview</CardTitle>
              <CardContent>
                <StatsList>
                  <StatItem>
                    <StatLabel>Total Bookings</StatLabel>
                    <StatValue>{allBookings.length}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Pending</StatLabel>
                    <StatValue>{pendingBookings.length}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Confirmed</StatLabel>
                    <StatValue>{confirmedBookings.length}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Completed</StatLabel>
                    <StatValue>{completedBookings.length}</StatValue>
                  </StatItem>
                </StatsList>
              </CardContent>
            </DashboardCard>

            <DashboardCard>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardContent>
                <StatsList>
                  <StatItem>
                    <StatLabel>Total Revenue</StatLabel>
                    <StatValue>₹{totalRevenue.toLocaleString()}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Pending Payments</StatLabel>
                    <StatValue>₹{pendingRevenue.toLocaleString()}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Average Booking Value</StatLabel>
                    <StatValue>₹{allBookings.length > 0 ? Math.round(totalRevenue / allBookings.length) : 0}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Cancellation Rate</StatLabel>
                    <StatValue>{allBookings.length > 0 ? Math.round((cancelledBookings.length / allBookings.length) * 100) : 0}%</StatValue>
                  </StatItem>
                </StatsList>
              </CardContent>
            </DashboardCard>

            <DashboardCard>
              <CardTitle>Recent Bookings</CardTitle>
              <CardContent>
                {isLoading ? (
                  <LoadingSpinner size="small" />
                ) : allBookings.length > 0 ? (
                  <BookingList>
                    {allBookings.slice(0, 5).map((booking) => (
                      <BookingItem key={booking.id}>
                        <BookingInfo>
                          <BookingService>{booking.service.name}</BookingService>
                          <BookingDate>{new Date(booking.bookingDate).toLocaleDateString()}</BookingDate>
                          <BookingClient>{booking.user.firstName} {booking.user.lastName}</BookingClient>
                        </BookingInfo>
                        <BookingStatus status={booking.status}>
                          {booking.status}
                        </BookingStatus>
                      </BookingItem>
                    ))}
                  </BookingList>
                ) : (
                  <EmptyState>
                    <p>No bookings found.</p>
                  </EmptyState>
                )}
              </CardContent>
            </DashboardCard>

            <DashboardCard>
              <CardTitle>Quick Actions</CardTitle>
              <CardContent>
                <ActionList>
                  <ActionItem>
                    <Button variant="primary" size="small" fullWidth onClick={() => navigate('/admin/users')}>
                      Manage Users
                    </Button>
                  </ActionItem>
                  <ActionItem>
                    <Button variant="outline" size="small" fullWidth onClick={() => navigate('/admin/pandits')}>
                      Manage Pandits
                    </Button>
                  </ActionItem>
                  <ActionItem>
                    <Button variant="outline" size="small" fullWidth onClick={() => navigate('/admin/services')}>
                      Manage Services
                    </Button>
                  </ActionItem>
                  <ActionItem>
                    <Button variant="outline" size="small" fullWidth onClick={() => navigate('/admin/analytics')}>
                      View Analytics
                    </Button>
                  </ActionItem>
                  <ActionItem>
                    <Button variant="outline" size="small" fullWidth>
                      System Settings
                    </Button>
                  </ActionItem>
                </ActionList>
              </CardContent>
            </DashboardCard>
          </DashboardGrid>
        </DashboardContent>
      </Container>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: ${({ theme }) => theme.spacing[8]} 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const DashboardHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[12]};
`;

const DashboardTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const DashboardSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DashboardContent = styled.div``;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;

const DashboardCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const CardContent = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const BookingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const BookingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const BookingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const BookingService = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const BookingDate = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const BookingClient = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const BookingStatus = styled.span<{ status: string }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${({ status, theme }) => {
    switch (status) {
      case 'CONFIRMED':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'PENDING':
        return `
          background: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
        `;
      case 'COMPLETED':
        return `
          background: ${theme.colors.info}20;
          color: ${theme.colors.info};
        `;
      case 'CANCELLED':
        return `
          background: ${theme.colors.error}20;
          color: ${theme.colors.error};
        `;
      default:
        return `
          background: ${theme.colors.gray100};
          color: ${theme.colors.gray800};
        `;
    }
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[6]} 0;
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const ActionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ActionItem = styled.div`
  width: 100%;
`;

export default AdminDashboardPage;
