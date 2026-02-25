
import { GoogleGenAI, Type } from "@google/genai";
import { ItineraryRequest, ItineraryResponse } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// Helper: Google Custom Search (Vision Layer)
const fetchGoogleCustomSearch = async (query: string): Promise<string | null> => {
  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    console.warn("Missing Google Maps API Key for Custom Search");
    return null;
  }
  const CX = '017074375268816707097:mumzbs_mq_e'; // Specific Search ID
  try {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${CX}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&searchType=image&imgSize=large&num=3`;
    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`[Custom Search Error] ${response.status} ${response.statusText}`);
      const errData = await response.json();
      console.warn('Error details:', errData);
      return null;
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      // Vision Logic: Filter for high-res images
      const validImage = data.items.find((item: any) => {
        return item.image?.height > 600 && item.image?.width > 800;
      });
      return validImage ? validImage.link : data.items[0].link;
    }
    return null;
  } catch (error) {
    console.warn("Google Custom Search Failed", error);
    return null;
  }
};

export const generateCustomVisual = async (placeName: string, keyword: string): Promise<string> => {
  if (!API_KEY) throw new Error("Missing Gemini API Key");
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `High-end luxury editorial photography of ${placeName}.
  Style: Architectural Digest, cinematic lighting, ultra-sharp focus, professional color grading.
  Context: ${keyword}. Elegant and aspirational atmosphere. No people, focus on the architecture and ambiance.`;

  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64EncodeString = part.inlineData.data;
      return `data:image/png;base64,${base64EncodeString}`;
    }
  }

  throw new Error("No image generated");
};

export const generateItinerary = async (params: ItineraryRequest): Promise<ItineraryResponse> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const paceDescription = [
    "extremely relaxed with plenty of downtime",
    "gentle and balanced",
    "steady with one main activity per half-day",
    "active and engaging",
    "highly fast-paced and packed with experiences"
  ][params.travelPace - 1];

  const prompt = `You are the 'Aiolos Travel Architect'-the world's most elite travel advisor.
  Create an ultra-luxury travel itinerary for ${params.clientName} in ${params.destination} for ${params.duration}.
  Vibe: ${params.vibe}. Budget: ${params.budgetLevel}. Pace: ${paceDescription}.
  Interests: ${params.interests.join(", ")}.
  Notes: ${params.notes || "None"}.

  CORE STANDARDS (Non-Negotiable):
  1. SENSORY HOOK: Every activity description MUST describe a scent, sound, or physical feeling.
  2. SECRET ACCESS: Prioritize 'private after-hours,' 'backdoor entry,' or 'curator-led' over standard visits.
  3. BESPOKE STACK: Mention how $100 credits are used for 'off-menu' moments (e.g., private tasting, spa credit).
  4. AGENTIC ALTERNATE: Every day MUST include a 'Rain Alternate' indoor luxury experience.
  5. VIBE DECK: Suggest a local music style or playlist name to set the psychological stage for the day.
  6. KNOW BEFORE YOU GO: Provide 4 essential tips: Currency (e.g., 'Euro (EUR), cards widely accepted'), Tipping (e.g., '10-15% for service'), Dress Code (e.g., 'Smart casual, no shorts at dinner'), and Etiquette (a specific cultural do/don't).

  INSTRUCTIONS:
  1. For every morning, afternoon, and evening activity, select a REAL prestigious location.
  2. For the accommodation, suggest a world-class 5-star hotel or resort.
  3. Use the 'googleSearch' tool to verify that these places are open, highly rated, and prestigious.
  4. Provide details in a structured JSON format following the schema.
  5. Include a specific search-friendly 'imageKeyword' for each place (e.g., 'hotel de crillon pool' or 'louvre museum interior').
  6. Ensure the 'description' is alluring and professional (approx 20-30 words).`;

  const locationSchema = {
    type: Type.OBJECT,
    properties: {
      placeName: { type: Type.STRING },
      category: { type: Type.STRING, description: "e.g., Fine Dining, Museum, Landmark, Luxury Hotel" },
      description: { type: Type.STRING },
      rating: { type: Type.NUMBER, description: "Rating out of 5.0" },
      imageKeyword: { type: Type.STRING },
      address: { type: Type.STRING }
    },
    required: ["placeName", "category", "description", "rating", "imageKeyword"]
  };

  const generateWithRetry = async (retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Attempt ${i + 1} with model: gemini-flash-latest...`);
        return await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                clientName: { type: Type.STRING },
                destination: { type: Type.STRING },
                summary: { type: Type.STRING },
                itinerary: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      day: { type: Type.NUMBER },
                      title: { type: Type.STRING },
                      morning: locationSchema,
                      afternoon: locationSchema,
                      evening: locationSchema,
                      accommodation: locationSchema,
                      rainAlternate: { type: Type.STRING, description: "Indoor luxury alternate activity" },
                      vibeDeck: { type: Type.STRING, description: "Music style or playlist name" }
                    },
                    required: ["day", "title", "morning", "afternoon", "evening", "accommodation", "rainAlternate", "vibeDeck"]
                  }
                },
                tips: {
                  type: Type.OBJECT,
                  properties: {
                    currency: { type: Type.STRING },
                    tipping: { type: Type.STRING },
                    dressCode: { type: Type.STRING },
                    etiquette: { type: Type.STRING }
                  },
                  required: ["currency", "tipping", "dressCode", "etiquette"]
                }
              },
              required: ["clientName", "destination", "summary", "itinerary", "tips"]
            }
          }
        });
      } catch (error: any) {
        const isRetryable = error.status === 429 || error.status === 503 || error.message.includes("429") || error.message.includes("503");
        if (isRetryable && i < retries - 1) {
          console.warn(`Attempt ${i + 1} failed with ${error.status || error.message}. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        } else {
          throw error;
        }
      }
    }
    throw new Error("Max retries exceeded for content generation.");
  };

  // Helper: Fetch YouTube Visual (Thumbnail + Video Data)
  const getYouTubeVisual = async (query: string) => {
    const youtubeKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    if (!youtubeKey) return null;

    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoDefinition=high&maxResults=1&key=${youtubeKey}`);
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        const vid = data.items[0];
        return {
          id: vid.id.videoId,
          url: `https://www.youtube.com/watch?v=${vid.id.videoId}`,
          thumb: vid.snippet.thumbnails.maxres?.url || vid.snippet.thumbnails.high?.url || vid.snippet.thumbnails.default?.url,
          title: vid.snippet.title,
          isYouTube: true
        };
      }
    } catch (err) {
      console.warn(`[YouTube Visual] Failed for ${query}`, err);
    }
    return null;
  };

  // Helper: Fetch Pexels Image
  const getPexelsImage = async (query: string) => {
    const pexelsKey = import.meta.env.VITE_PEXELS_API_KEY;
    if (!pexelsKey) return null;

    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
        headers: { Authorization: pexelsKey }
      });

      if (!response.ok) return null;

      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        const photo = data.photos[0];
        return {
          url: photo.src.landscape || photo.src.large,
          attribution: `Photo by ${photo.photographer} via Pexels`
        };
      }
    } catch (err) {
      console.warn(`[Pexels] Failed for ${query}`, err);
    }
    return null;
  };

  try {
    const response = await generateWithRetry();

    const text = response.text;
    if (!text) throw new Error("Failed to generate content: Empty response");

    const data = JSON.parse(text) as ItineraryResponse;
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Google Places Service (only if available)
    let placesService: any = null;
    if ((window as any).google && (window as any).google.maps && (window as any).google.maps.places) {
      placesService = new (window as any).google.maps.places.PlacesService(document.createElement('div'));
    }

    const fetchGooglePhoto = (query: string, selectMode: 'best' | 'random' = 'best'): Promise<{ url: string; attribution: string } | null> => {
      return new Promise((resolve) => {
        if (!placesService) {
          resolve(null);
          return;
        }

        // console.log(`Fetching photo for: ${query} (${selectMode})`); // Reduced logging
        placesService.textSearch({ query }, (results: any, status: any) => {
          if (status === 'OK' && results && results.length > 0) {
            let place;
            if (selectMode === 'random') {
              const maxIdx = Math.min(results.length, 5);
              const randomIdx = Math.floor(Math.random() * maxIdx);
              place = results[randomIdx];
            } else {
              place = results[0];
            }

            let url = null;
            let attribution = '';

            if (place.photos && place.photos.length > 0) {
              url = place.photos[0].getUrl({ maxWidth: 800 });
              attribution = (place.html_attributions && place.html_attributions.length > 0) ? place.html_attributions[0] : '';
            }
            resolve({ url, attribution });
          } else {
            resolve(null);
          }
        });
      });
    };

    // Process Locations: Hierarchy of Visuals
    const processLocation = async (loc: any, type: 'activity' | 'accommodation' = 'activity') => {
      if (!loc) return;

      let heroImage: string | null = null;
      let videoTour: any = null;

      // PARALLEL STREAM: Fetch Video Tour (Motion Guide)
      // We start this immediately so it runs alongside image search
      const videoPromise = getYouTubeVisual(`${loc.placeName} ${data.destination} 4K tour luxury`);

      // SERIAL WATERFALL: zero-placeholder image logic

      // Step A: Google Places (Verified Photo)
      if (placesService) {
        let googleQueries = [];
        if (loc.imageKeyword) googleQueries.push(`${loc.imageKeyword} ${data.destination}`);
        googleQueries.push(`${loc.placeName} in ${data.destination}`);

        for (const query of googleQueries) {
          const result = await fetchGooglePhoto(query, 'best');
          if (result && result.url) {
            heroImage = result.url;
            loc.attribution = result.attribution;
            loc.groundingUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
            break;
          }
        }
      }

      // Step B: Google Custom Search ID (Vision Layer Fallback)
      if (!heroImage) {
        console.log(`[Waterfall B] Trying Custom Search for: ${loc.placeName}`);
        try {
          const csImage = await fetchGoogleCustomSearch(`${loc.placeName} ${data.destination} luxury interior photography`);
          if (csImage) {
            heroImage = csImage;
            console.log(`[Waterfall B] Success for: ${loc.placeName}`);
          }
        } catch (e) {
          console.error(`[Waterfall B] Error for ${loc.placeName}`, e);
        }
      }

      // Step C: YouTube Cinematic Thumbnail
      if (!heroImage) {
        console.log(`[Waterfall C] Trying YouTube Thumbnail for: ${loc.placeName}`);
        const ytThumb = await getYouTubeVisual(`${loc.placeName} ${data.destination} 4K cinematic`);
        if (ytThumb && ytThumb.thumb) {
          heroImage = ytThumb.thumb;
          loc.attribution = `Visual via ${ytThumb.title}`;
          console.log(`[Waterfall C] Success for: ${loc.placeName}`);
        }
      }

      // Step D: Pexels Aesthetic (Vibe Shot)
      if (!heroImage) {
        console.log(`[Waterfall D] Trying Pexels Vibe for: ${loc.category}`);
        const pexelsQuery = `${loc.placeName} ${data.destination}`; // Try specific first
        let pexelsImg = await getPexelsImage(pexelsQuery);

        if (!pexelsImg && loc.category) {
          // Try category fallback on Pexels
          pexelsImg = await getPexelsImage(`${loc.category} ${data.destination} luxury`);
        }

        if (pexelsImg) {
          heroImage = pexelsImg.url;
          loc.attribution = pexelsImg.attribution;
          console.log(`[Waterfall D] Success for: ${loc.placeName}`);
        }
      }

      // Step E (Safety Net): Destination Fallback (Absolute last resort, no loremflickr)
      if (!heroImage) {
        console.warn(`[Waterfall E] HIT FALLBACK for: ${loc.placeName}. Fetching destination fallback.`);

        // 1. Try Custom Search for Destination
        let destImage = await fetchGoogleCustomSearch(`${data.destination} luxury travel`);

        // 2. Try Pexels for Destination
        if (!destImage) {
          console.log(`[Waterfall E] Custom Search failed for destination. Trying Pexels.`);
          const pexelsDest = await getPexelsImage(`${data.destination} luxury travel`);
          if (pexelsDest) {
            destImage = pexelsDest.url;
            loc.attribution = pexelsDest.attribution;
          }
        }

        // 3. Last Resort Hardcoded
        heroImage = destImage || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200';
      }

      // Await Video Tour
      const videoResult = await videoPromise;
      if (videoResult) {
        videoTour = {
          id: videoResult.id,
          url: videoResult.url,
          thumb: videoResult.thumb,
          title: videoResult.title
        };
      }

      // Assign to MediaOptions
      loc.mediaOptions = {
        heroImage: heroImage || '', // Should never be empty due to Step E
        videoTour: videoTour
      };

      // Legacy fields for backward compat
      loc.customImageUrl = heroImage;
      loc.video = videoTour;

      if (!loc.groundingUrl) {
        loc.groundingUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.placeName + " " + data.destination)}`;
      }
    };

    // Task B: Destination Image
    const fetchDestinationImage = async () => {
      let img = await getPexelsImage(`${data.destination} luxury travel`);

      if (!img && placesService) {
        img = await fetchGooglePhoto(`${data.destination} travel luxury 4k`);
      }

      // If still no image, try YouTube thumb as last resort for destination?
      if (!img) {
        const yt = await getYouTubeVisual(`${data.destination} travel cinematic 4k`);
        if (yt && yt.thumb) {
          img = { url: yt.thumb, attribution: `Video by ${yt.title}` };
        }
      }

      if (img) {
        data.destinationImageUrl = img.url;
        data.destinationImageAttribution = img.attribution;
      }
    };

    // Task C: Destination Video
    const fetchDestinationVideo = async () => {
      const yt = await getYouTubeVisual(`${data.destination} luxury travel cinematic 4k`);
      if (yt) {
        data.destinationVideo = {
          id: yt.id,
          url: yt.url,
          thumb: yt.thumb,
          title: yt.title
        };
      }
    };

    // EXECUTE PARALLEL
    const allLocations: { loc: any, type: string }[] = [];
    data.itinerary.forEach(day => {
      if (day.morning) allLocations.push({ loc: day.morning, type: 'activity' });
      if (day.afternoon) allLocations.push({ loc: day.afternoon, type: 'activity' });
      if (day.evening) allLocations.push({ loc: day.evening, type: 'activity' });
      if (day.accommodation) allLocations.push({ loc: day.accommodation, type: 'accommodation' });
    });

    const batchSize = 5;
    for (let i = 0; i < allLocations.length; i += batchSize) {
      const batch = allLocations.slice(i, i + batchSize);
      await Promise.all(batch.map(item => processLocation(item.loc, item.type as any)));
      if (i + batchSize < allLocations.length) {
        await new Promise(resolve => setTimeout(resolve, 200)); // Rate limiting
      }
    }

    await Promise.all([
      fetchDestinationImage(),
      fetchDestinationVideo()
    ]);

    return data;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.response) {
      console.error("Gemini API Error Details:", JSON.stringify(error.response, null, 2));
    }
    throw new Error(`Failed to generate itinerary: ${error.message || "Unknown error"}`);
  }
};
