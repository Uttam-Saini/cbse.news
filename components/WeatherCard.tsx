'use client';

import { useState, useEffect } from 'react';
import WeatherIcon from '@/components/WeatherIcon';
import SkeletonWeatherCard from '@/components/SkeletonWeatherCard';

interface WeatherData {
  name: string;
  temp: number;
  condition: string;
  description: string;
  icon: string;
}

interface WeatherCardProps {
  compact?: boolean;
}

export default function WeatherCard({ compact = false }: WeatherCardProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get user's location
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              
              try {
                const response = await fetch(
                  `/api/weather?lat=${latitude}&lon=${longitude}`
                );
                
                if (!response.ok) {
                  throw new Error('Failed to fetch weather');
                }
                
                const data = await response.json();
                setWeather(data);
              } catch (err) {
                // Fallback to Delhi if geolocation fetch fails
                await fetchWeatherByCity('Delhi');
              } finally {
                setLoading(false);
              }
            },
            async () => {
              // Geolocation denied or failed, use fallback city
              await fetchWeatherByCity('Delhi');
            },
            {
              timeout: 5000,
              enableHighAccuracy: false,
            }
          );
        } else {
          // Geolocation not supported, use fallback city
          await fetchWeatherByCity('Delhi');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load weather');
        setLoading(false);
      }
    };

    const fetchWeatherByCity = async (city: string) => {
      try {
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather');
        }
        
        const data = await response.json();
        setWeather(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load weather');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return <SkeletonWeatherCard compact={compact} />;
  }

  if (error || !weather) {
    return null; // Silently fail - don't show error to user
  }

  if (compact) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-3 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-slate-800 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2.5">
          {/* Weather Info */}
          <div className="flex flex-col justify-center min-w-0">
            <h3 className="text-xs font-medium text-gray-900 dark:text-white truncate">
              {weather.name}
            </h3>
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white leading-none">
                {weather.temp}
              </span>
              <span className="text-xs font-medium text-gray-600 dark:text-slate-400 leading-none">
                °C
              </span>
            </div>
          </div>
          {/* Weather Icon */}
          <div className="flex-shrink-0 flex items-center">
            <WeatherIcon condition={weather.description} size={24} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-5 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-slate-800 shadow-sm dark:shadow-none w-full sm:w-auto">
      <div className="flex items-center gap-4">
        {/* Weather Info - Left Side */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* City Name */}
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate mb-1.5">
            {weather.name}
          </h3>
          
          {/* Big Temperature */}
          <div className="flex items-baseline gap-1 mb-1.5">
            <span className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
              {weather.temp}
            </span>
            <span className="text-xl sm:text-2xl font-semibold text-gray-600 dark:text-slate-400 leading-none">
              °C
            </span>
          </div>
          
          {/* Weather Condition */}
          <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-300 capitalize">
            {weather.description}
          </p>
        </div>

        {/* Weather Icon - Right Side */}
        <div className="flex-shrink-0 flex items-center">
          <WeatherIcon condition={weather.description} size={42} />
        </div>
      </div>
    </div>
  );
}
