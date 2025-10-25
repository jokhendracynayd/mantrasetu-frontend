import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

import type { RootState, AppDispatch } from '../store/store';
import { fetchServices, fetchAvailablePandits } from '../store/slices/bookingSlice';
import { serviceAPI } from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { getLargeServicePlaceholder, getPanditPlaceholder } from '../utils/placeholder';
import { Calendar, Clock, Sparkles, Star, Search, MapPin, Video } from 'lucide-react';

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
  const navigate = useNavigate();
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

  const handleBookService = (serviceId: string) => {
    navigate(`/bookings?service=${serviceId}`);
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="container mx-auto px-4">
        {/* Pandit Profile Section */}
        {selectedPandit && (
          <Card className="mb-8 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={selectedPandit.image || getPanditPlaceholder(selectedPandit.name)}
                    alt={selectedPandit.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                  />
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold text-foreground mb-2">{selectedPandit.name}</h2>
                  <p className="text-muted-foreground mb-3">{selectedPandit.title}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(selectedPandit.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{selectedPandit.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{selectedPandit.experience} experience</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedPandit.specializations.map((spec: string, i: number) => (
                      <Badge key={i} variant="secondary">{spec}</Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Languages: {selectedPandit.languages.join(', ')}
                  </p>
                  <p className="text-lg font-semibold text-primary mb-3">
                    ₹{selectedPandit.hourlyRate}/hour
                  </p>
                  {selectedPandit.bio && (
                    <p className="text-sm text-muted-foreground mb-4">{selectedPandit.bio}</p>
                  )}
                  <Button asChild variant="outline">
                    <Link to={`/pandit/${selectedPandit.id}`}>View Full Profile</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {selectedPandit ? `Services by ${selectedPandit.name}` : 'Our Spiritual Services'}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {selectedPandit ? `Book services with ${selectedPandit.name}` : 'Discover our comprehensive range of authentic spiritual services'}
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <p className="text-3xl font-bold text-primary">{servicesToDisplay.length}</p>
              <p className="text-sm text-muted-foreground">Total Services</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <p className="text-3xl font-bold text-primary">
                {servicesToDisplay.filter(s => s.category === 'POOJA').length}
              </p>
              <p className="text-sm text-muted-foreground">Poojas</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <p className="text-3xl font-bold text-primary">
                {servicesToDisplay.filter(s => s.category === 'ASTROLOGY').length}
              </p>
              <p className="text-sm text-muted-foreground">Astrology</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <p className="text-3xl font-bold text-primary">
                {servicesToDisplay.filter(s => s.isVirtual).length}
              </p>
              <p className="text-sm text-muted-foreground">Virtual</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="rounded-full"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {isLoadingServices ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="large" />
          </div>
        ) : servicesError ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{servicesError}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card 
                key={service.id}
                className="hover-elevate group border-primary/20 h-full flex flex-col"
              >
                <CardHeader 
                  className="p-0 flex-shrink-0 cursor-pointer"
                  onClick={() => navigate(`/services/${service.id}`)}
                >
                  <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
                    {service.imageUrl ? (
                      <img 
                        src={service.imageUrl} 
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <span className="text-6xl">{getServiceIcon(service.category)}</span>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                      {service.category}
                    </Badge>
                    
                    {/* Virtual/In-Person Badge */}
                    <Badge 
                      variant={service.isVirtual ? 'default' : 'secondary'}
                      className="absolute top-3 right-3 gap-1"
                    >
                      {service.isVirtual ? (
                        <>
                          <Video className="w-3 h-3" />
                          Virtual
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3 h-3" />
                          In-Person
                        </>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent 
                  className="p-4 flex-grow flex flex-col cursor-pointer"
                  onClick={() => navigate(`/services/${service.id}`)}
                >
                  <CardTitle className="text-lg mb-2 flex items-center gap-2 flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-primary" />
                    {service.name}
                  </CardTitle>
                  
                  <p className="text-muted-foreground text-sm mb-3 flex-grow line-clamp-3">
                    {service.description}
                  </p>
                  
                  <div className="space-y-2 mb-4 flex-shrink-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Duration: {service.durationMinutes > 0 ? `${service.durationMinutes} minutes` : 'N/A'}
                    </div>
                    <div className="flex items-center gap-2 text-lg font-bold text-primary">
                      ₹{service.basePrice}
                    </div>
                    {service.tags && service.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {service.tags.slice(0, 3).map((tag: string) => (
                          <span 
                            key={tag} 
                            className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors mt-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookService(service.id);
                    }}
                  >
                    Book Service
                    <Star className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              No services found matching your criteria.
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
