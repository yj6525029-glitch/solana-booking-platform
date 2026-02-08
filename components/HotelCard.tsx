'use client';

import { useState } from 'react';
import { BookingModal } from './BookingModal';
import { MapPin, Star, Users, ChevronRight } from 'lucide-react';
import { Hotel } from '@/data/hotels';

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedNights, setSelectedNights] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const totalPrice = (hotel.price * selectedNights).toFixed(2);

  // Calculate itinerary preview
  const itinerayPreview = hotel.itinerary.slice(0, 2).map(day => day.title).join(', ');

  return (
    <>
      <div 
        className="glass rounded-2xl overflow-hidden card-hover cursor-pointer group animate-slide-up"
        style={{ animationDelay: `${parseInt(hotel.id) * 100}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={hotel.image}
            alt={hotel.name}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isHovered ? 'scale-105 brightness-110' : 'scale-100'
            }`}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
          
          {/* Rating Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-1 glass-strong rounded-full px-3 py-1.5">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold text-white">{hotel.rating}</span>
          </div>

          {/* Availability Badge */}
          <div className={`absolute top-4 right-4 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
            hotel.roomsAvailable > 0 
              ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400' 
              : 'bg-rose-500/20 border border-rose-500/50 text-rose-400'
          }`}>
            {hotel.roomsAvailable > 0 
              ? `${hotel.roomsAvailable} rooms left` 
              : 'Fully booked'}
          </div>

          {/* Country Tag */}
          <div className="absolute bottom-4 left-4 glass-strong rounded-full px-3 py-1.5">
            <span className="text-xs font-medium text-cyan-300">{hotel.country}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                {hotel.name}
              </h3>
              <div className="flex items-center gap-1.5 text-gray-400">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-sm">{hotel.location}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{hotel.description}</p>

          {/* Itinerary Preview */}
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-white/5">
            <p className="text-xs text-gray-400 mb-1">Sample itinerary:</p>
            <p className="text-xs text-cyan-300 font-medium">{itinerayPreview}</p>
          </div>

          {/* Amenities */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {hotel.amenities.slice(0, 5).map((amenity) => (
              <span 
                key={amenity} 
                className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300"
              >
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 5 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-400">
                +{hotel.amenities.length - 5}
              </span>
            )}
          </div>

          {/* Price & Action */}
          <div className="flex items-end justify-between pt-4 border-t border-white/10">
            <div>
              <p className="text-xs text-gray-400 mb-1">per night</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-emerald-400">{hotel.price}</span>
                <span className="text-sm text-gray-400">SOL</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowModal(true)}
              disabled={hotel.roomsAvailable === 0}
              className="btn-gradient px-5 py-3 rounded-xl font-semibold text-white shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Book Now
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <BookingModal 
        hotel={hotel} 
        nights={selectedNights}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          // Could refresh room availability here
        }}
      />
    </>
  );
}
