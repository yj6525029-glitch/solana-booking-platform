'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface ListPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ListPropertyModal({ isOpen, onClose }: ListPropertyModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    city: '',
    country: '',
    pricePerNight: '',
    propertyType: 'villa',
    description: '',
    imageUrl: '',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ''
  });

  const propertyTypes = ['villa', 'penthouse', 'estate', 'cabin', 'castle'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Property submitted:', formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-luxury relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold gold-shimmer">List Your Property</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-cream/60" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" placeholder="Property Title" onChange={handleChange} className="w-full px-4 py-2 glass bg-white/5 rounded-xl text-cream" required />
          <div className="grid grid-cols-2 gap-4">
            <input name="city" placeholder="City" onChange={handleChange} className="w-full px-4 py-2 glass bg-white/5 rounded-xl text-cream" required />
            <input name="country" placeholder="Country" onChange={handleChange} className="w-full px-4 py-2 glass bg-white/5 rounded-xl text-cream" required />
          </div>
          <input name="pricePerNight" type="number" step="0.01" placeholder="Price per night (SOL)" onChange={handleChange} className="w-full px-4 py-2 glass bg-white/5 rounded-xl text-cream" required />
          <select name="propertyType" onChange={handleChange} className="w-full px-4 py-2 glass bg-white/5 rounded-xl text-cream">
            {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <textarea name="description" placeholder="Description" rows={3} onChange={handleChange} className="w-full px-4 py-2 glass bg-white/5 rounded-xl text-cream" required />
          <input name="imageUrl" placeholder="Image URL" onChange={handleChange} className="w-full px-4 py-2 glass bg-white/5 rounded-xl text-cream" />
          <div className="grid grid-cols-3 gap-4">
            <input name="maxGuests" type="number" placeholder="Guests" onChange={handleChange} className="w-full px-4 py-2 glass bg-white/5 rounded-xl text-cream" />
            <input name="bedrooms" type="number" placeholder="Bedrooms" onChange={handleChange} className="w-full px-4 py-2 glass bg-white/5 rounded-xl text-cream" />
            <input name="bathrooms" type="number" placeholder="Bathrooms" onChange={handleChange} className="w-full px-4 py-2 glass bg-white/5 rounded-xl text-cream" />
          </div>
          <input name="amenities" placeholder="Amenities (comma separated)" onChange={handleChange} className="w-full px-4 py-2 glass bg-white/5 rounded-xl text-cream" />
          
          <button type="submit" className="w-full py-3 gold-shimmer rounded-xl font-bold text-midnight hover:opacity-90">
            List Property
          </button>
        </form>
      </div>
    </div>
  );
}