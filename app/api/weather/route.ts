import { NextRequest, NextResponse } from 'next/server';

/** Cache GET responses for 10 minutes */
export const revalidate = 600;

// Simple in-memory cache with timestamp
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const city = searchParams.get('city') || 'Delhi';

  // Create cache key
  const cacheKey = lat && lon ? `${lat},${lon}` : city;

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data);
  }

  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Weather API key not configured' },
      { status: 500 }
    );
  }

  try {
    let url: string;
    
    if (lat && lon) {
      // Use coordinates if provided
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else {
      // Use city name as fallback
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    }

    const response = await fetch(url, {
      next: { revalidate: 600 }, // Next.js cache for 10 minutes
    });

    if (!response.ok) {
      // If API fails, try fallback to Delhi
      if (city !== 'Delhi') {
        const fallbackUrl = `https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=${apiKey}&units=metric`;
        const fallbackResponse = await fetch(fallbackUrl);
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const weatherData = {
            name: fallbackData.name,
            temp: Math.round(fallbackData.main.temp),
            condition: fallbackData.weather[0].main,
            description: fallbackData.weather[0].description,
            icon: fallbackData.weather[0].icon,
          };
          
          // Cache the fallback result
          cache.set('Delhi', { data: weatherData, timestamp: Date.now() });
          return NextResponse.json(weatherData);
        }
      }
      
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    const weatherData = {
      name: data.name,
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };

    // Cache the result
    cache.set(cacheKey, { data: weatherData, timestamp: Date.now() });

    return NextResponse.json(weatherData);
  } catch (error: any) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
