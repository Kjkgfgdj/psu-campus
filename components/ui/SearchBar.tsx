"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, forwardRef } from "react";

interface SearchBarProps extends ComponentPropsWithoutRef<"input"> {
  onSubmit?: () => void;
  buttonLabel?: string;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ onSubmit, buttonLabel = "Search", className, ...props }, ref) => {
    return (
      <div className={cn("relative w-full", className)}>
        <div className="relative flex items-center">
          <Search className="absolute left-5 h-5 w-5 text-slate-400 pointer-events-none" />
          <input
            ref={ref}
            type="text"
            className={cn(
              "w-full rounded-full bg-white pl-12 pr-4 py-4 text-base",
              "border border-slate-200 shadow-lg",
              "placeholder:text-slate-400",
              "focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600",
              "transition-all duration-200",
              "hover:shadow-xl"
            )}
            {...props}
          />
          {onSubmit && (
            <button
              type="button"
              onClick={onSubmit}
              className={cn(
                "absolute right-2 rounded-full bg-green-600 px-6 py-2.5",
                "text-sm font-semibold text-white",
                "hover:bg-green-700 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              )}
            >
              {buttonLabel}
            </button>
          )}
        </div>
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

