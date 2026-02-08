'use client';

import { useState } from 'react';
import { MapPin, Star, Users, Bed, Bath, Crown, ChevronRight } from 'lucide-react';
import { Property } from '@/data/listings';

interface PropertyCardProps {
  property: Property;
}

const propertyTypeIcons: Record<string, string> = {
  villa: '🏛️',
  penthouse: '🏙️',
  estate: '🏰',
  cabin: '🏔️',
  castle: '🏯',
  yacht: '⛵',
  island: '🏝️',
};

export function PropertyCard({ property }: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="card-luxury group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered ? 'scale-110 brightness-110' : 'scale-100'
          }`}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {property.verified && (
            <div className="verified-badge">
              <Crown className="w-3 h-3" />
              <span>Verified</span>
            </div>
          )}
          <span className="property-tag text-gold">
            {propertyTypeIcons[property.propertyType] || '🏠'} {property.propertyType}
          </span>
        </div>

        {/* Price Tag */}
        <div className="absolute top-4 right-4 glass-luxury px-4 py-2 rounded-xl">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-gold">{property.pricePerNight}</span>
            <span className="text-xs text-cream/60">SOL/night</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Location */}
        <div className="flex items-center gap-2 text-cream/60 text-sm mb-3">
          <MapPin className="w-4 h-4 text-gold" />
          <span>{property.location.city}, {property.location.country}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-cream mb-2 group-hover:text-gold transition-colors line-clamp-1">
          {property.title}
        </h3>

        {/* Description */}
        <p className="text-cream/60 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-cream/60 mb-4">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{property.maxGuests}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="font-bold text-cream">{property.rating}</span>
          </div>
          <span className="text-cream/40 text-sm">({property.reviewCount} reviews)</span>
        </div>

        {/* Amenities Preview */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {property.amenities.slice(0, 3).map((amenity) => (
            <span 
              key={amenity}
              className="text-xs px-2 py-1 rounded-full bg-white/5 text-cream/60 border border-white/10"
            >
              {amenity}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-cream/60">
              +{property.amenities.length - 3}
            </span>
          )}
        </div>

        {/* CTA */}
        <button className="btn-luxury w-full flex items-center justify-center gap-2">
          Book Now
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
