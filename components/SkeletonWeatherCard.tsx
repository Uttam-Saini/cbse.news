interface SkeletonWeatherCardProps {
  compact?: boolean;
}

export default function SkeletonWeatherCard({ compact = false }: SkeletonWeatherCardProps) {
  if (compact) {
    return (
      <div className="bg-white dark:bg-[#1f1f1f] rounded-lg border border-gray-200 dark:border-white/10 p-3 transition-all duration-300 animate-pulse">
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col justify-center space-y-1.5">
            <div className="h-3 bg-gray-200 dark:bg-[#2d2d2d] rounded w-16"></div>
            <div className="h-5 bg-gray-200 dark:bg-[#2d2d2d] rounded w-12"></div>
          </div>
          <div className="w-6 h-6 bg-gray-200 dark:bg-[#2d2d2d] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1f1f1f] rounded-lg border border-gray-200 dark:border-white/10 p-5 transition-all duration-300 w-full sm:w-auto animate-pulse">
      <div className="flex items-center gap-4">
        {/* Weather Info - Left Side */}
        <div className="flex-1 min-w-0 flex flex-col justify-center space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-[#2d2d2d] rounded w-24"></div>
          <div className="h-8 bg-gray-200 dark:bg-[#2d2d2d] rounded w-20"></div>
          <div className="h-4 bg-gray-200 dark:bg-[#2d2d2d] rounded w-32"></div>
        </div>

        {/* Weather Icon - Right Side */}
        <div className="flex-shrink-0">
          <div className="w-[42px] h-[42px] bg-gray-200 dark:bg-[#2d2d2d] rounded"></div>
        </div>
      </div>
    </div>
  );
}
