
export interface LocationDetails {
  placeName: string;
  category: string;
  description: string;
  rating: number;
  imageKeyword: string;
  address?: string;
  groundingUrl?: string;
  customImageUrl?: string;
  attribution?: string;
  photoReference?: string;
  mediaOptions?: {
    heroImage: string;
    videoTour: {
      id: string;
      url: string;
      thumb: string;
      title: string;
    } | null;
  };
  // Keeping legacy fields for backward compatibility during refactor
  video?: {
    id: string;
    url: string;
    thumb: string;
    title: string;
  };
}

export interface DayItinerary {
  day: number;
  title: string;
  morning: LocationDetails;
  afternoon: LocationDetails;
  evening: LocationDetails;
  accommodation?: LocationDetails;
  rainAlternate: string; // Indoor luxury alternate activity
  vibeDeck: string; // Music style or playlist name
}

export interface ItineraryResponse {
  clientName: string;
  destination: string;
  summary: string;
  itinerary: DayItinerary[];
  tips: {
    currency: string;
    tipping: string;
    dressCode: string;
    etiquette: string;
  };
  destinationImageUrl?: string;
  destinationImageAttribution?: string;
  destinationVideo?: {
    id: string;
    url: string;
    thumb: string;
    title: string;
  };
}

export interface ItineraryRequest {
  destination: string;
  duration: string;
  clientName: string;
  vibe: 'adventurous' | 'relaxing' | 'cultural' | 'romantic' | 'family';
  budgetLevel: 'premium' | 'ultra-luxury' | 'exclusive';
  interests: string[];
  travelPace: number;
  notes?: string;
  agentName?: string;
  agentBusiness?: string;
}

export interface ClientRecord {
  id: string;
  user_id: string;
  name: string;
  last_destination: string | null;
  status: 'active' | 'pending' | 'completed' | null;
  created_at?: string;
}
