// components/ui/Pagination.tsx

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    onPageChange(1);
  };

  const handleLast = () => {
    onPageChange(totalPages);
  };

  // 生成页码数组
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // 最多显示5个页码
    
    if (totalPages <= maxVisible) {
      // 如果总页数少于等于最大显示数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 复杂分页逻辑
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      
      // 确保总是显示5个页码（如果可能）
      if (end - start + 1 < maxVisible) {
        if (start === 1) {
          end = Math.min(totalPages, start + maxVisible - 1);
        } else if (end === totalPages) {
          start = Math.max(1, end - maxVisible + 1);
        }
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="flex items-center space-x-2">
        {/* 首页按钮 */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleFirst}
          disabled={currentPage === 1}
          className="backdrop-blur-sm bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        
        {/* 上一页按钮 */}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="backdrop-blur-sm bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          上一页
        </Button>

        {/* 页码按钮组 */}
        <div className="flex items-center space-x-1 mx-4">
          {pageNumbers.map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={`
                min-w-[2.5rem] h-10 rounded-xl font-semibold transition-all duration-300
                ${currentPage === page 
                  ? "bg-gradient-to-r from-[#003399] to-[#3366cc] hover:from-[#003399]/90 hover:to-[#3366cc]/90 text-white shadow-lg shadow-blue-500/25 border-0" 
                  : "backdrop-blur-sm bg-white/50 border-white/30 hover:bg-white/70 text-gray-700 hover:text-gray-900"
                }
              `}
            >
              {page}
            </Button>
          ))}
        </div>

        {/* 下一页按钮 */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="backdrop-blur-sm bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一页
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
        
        {/* 末页按钮 */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLast}
          disabled={currentPage === totalPages}
          className="backdrop-blur-sm bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* 页面信息 */}
      <div className="text-center">
        <span className="text-sm font-medium text-gray-600">
          第 <span className="font-bold text-gray-900">{currentPage}</span> 页 / 共 <span className="font-bold text-gray-900">{totalPages}</span> 页
        </span>
      </div>
    </div>
  );
}
