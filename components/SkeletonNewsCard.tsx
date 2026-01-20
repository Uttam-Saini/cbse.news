import React from "react";

export default function SkeletonNewsCard() {
  return (
    <article className="bg-white dark:bg-[#1f1f1f] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden animate-pulse">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Image skeleton */}
        <div className="flex-shrink-0 sm:w-56">
          <div className="relative w-full h-36 sm:h-36 bg-gray-200 dark:bg-[#2d2d2d] rounded-xl"></div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Category skeleton */}
          <div className="mb-2">
            <div className="h-6 bg-gray-200 dark:bg-[#2d2d2d] rounded-full w-20"></div>
          </div>

          {/* Title skeleton */}
          <div className="mb-2 space-y-2">
            <div className="h-5 bg-gray-200 dark:bg-[#2d2d2d] rounded w-3/4"></div>
            <div className="h-5 bg-gray-200 dark:bg-[#2d2d2d] rounded w-5/6"></div>
          </div>

          {/* Description skeleton */}
          <div className="mb-3 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-[#2d2d2d] rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-[#2d2d2d] rounded w-5/6"></div>
          </div>

          {/* Date skeleton */}
          <div className="flex items-center gap-3">
            <div className="h-3 bg-gray-200 dark:bg-[#2d2d2d] rounded w-32"></div>
          </div>
        </div>
      </div>
    </article>
  );
}
