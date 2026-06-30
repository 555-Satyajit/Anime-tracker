"use client";

import React, { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PaginationControls({ 
  currentPage, 
  hasNextPage, 
  lastPage 
}: { 
  currentPage: number; 
  hasNextPage: boolean; 
  lastPage: number; 
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handlePageChange = (newPage: number) => {
    router.push(pathname + "?" + createQueryString("page", newPage.toString()));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-12 mb-8">
      <Button 
        variant="ghost" 
        size="icon" 
        className="w-8 h-8 text-muted-foreground hover:bg-white/5 disabled:opacity-50" 
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        &lt;
      </Button>
      
      {currentPage > 1 && (
        <Button variant="ghost" size="sm" className="w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-white/5 disabled:opacity-50" onClick={() => handlePageChange(1)}>
          1
        </Button>
      )}
      
      {currentPage > 3 && <span className="px-1 text-muted-foreground">...</span>}
      
      {currentPage > 2 && (
        <Button variant="ghost" size="sm" className="w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-white/5 disabled:opacity-50" onClick={() => handlePageChange(currentPage - 1)}>
          {currentPage - 1}
        </Button>
      )}
      
      <Button variant="ghost" size="sm" className="w-8 h-8 bg-[#e71014] text-white hover:bg-[#e71014]/90 disabled:opacity-50">
        {currentPage}
      </Button>
      
      {hasNextPage && (
        <Button variant="ghost" size="sm" className="w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-white/5 disabled:opacity-50" onClick={() => handlePageChange(currentPage + 1)}>
          {currentPage + 1}
        </Button>
      )}
      
      {hasNextPage && lastPage && currentPage + 2 <= lastPage && (
        <Button variant="ghost" size="sm" className="w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-white/5 hidden sm:inline-flex disabled:opacity-50" onClick={() => handlePageChange(currentPage + 2)}>
          {currentPage + 2}
        </Button>
      )}
      
      {lastPage && currentPage + 2 < lastPage && (
        <span className="px-1 text-muted-foreground">...</span>
      )}
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-white/5 disabled:opacity-50" 
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!hasNextPage}
      >
        &gt;
      </Button>
    </div>
  );
}
