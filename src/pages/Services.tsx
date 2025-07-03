import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Grid, List, MapPin, Calendar, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/components/Layout';
import { useServices } from '@/hooks/useServices';
import { ServiceTypeEnum } from '@/types/service';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

const Services = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const { data: services, isLoading } = useServices({
    serviceType: selectedServiceType === 'all' ? undefined : selectedServiceType,
    priceMin: priceMin ? parseFloat(priceMin) : undefined,
    priceMax: priceMax ? parseFloat(priceMax) : undefined,
    region: selectedRegion === 'all' ? undefined : selectedRegion
  });

  const { user } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Farming Services</h1>
          {user && (
            <Link to="/services/new">
              <Button>Post a Service</Button>
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Service Type Filter */}
            <div>
              <Select
                onValueChange={setSelectedServiceType}
                defaultValue={selectedServiceType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Service Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {Object.entries(ServiceTypeEnum).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Region Filter */}
            <div>
              <Select
                onValueChange={setSelectedRegion}
                defaultValue={selectedRegion}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="punjab">Punjab</SelectItem>
                  <SelectItem value="sindh">Sindh</SelectItem>
                  <SelectItem value="kpk">KPK</SelectItem>
                  <SelectItem value="balochistan">Balochistan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Min Price"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max Price"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
              />
            </div>

            {/* Sort By */}
            <div>
              <Select onValueChange={setSortBy} defaultValue={sortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-end mb-4 space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* Services Grid/List */}
        {isLoading ? (
          <div className="text-center py-8">Loading services...</div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-4'}>
            {services?.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className={`group ${
                  viewMode === 'grid'
                    ? 'block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'
                    : 'flex items-center bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4'
                }`}
              >
                <div className={viewMode === 'grid' ? '' : 'flex-1'}>
                  {service.images && service.images.length > 0 && (
                    <div className={viewMode === 'grid' ? 'aspect-w-16 aspect-h-9' : 'w-48 h-32'}>
                      <img
                        src={service.images[0]}
                        alt={service.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {ServiceTypeEnum[service.service_type as keyof typeof ServiceTypeEnum]
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        Rs {service.price.toLocaleString()} / {service.price_unit.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {service.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {service.location_city}, {service.location_province}
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(new Date(service.created_at), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Services; 