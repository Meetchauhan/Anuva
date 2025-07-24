import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DataTableProps<TData> {
  columns: {
    header: string;
    accessorKey?: string;
    id?: string;
    cell?: (props: { row: { original: TData } }) => React.ReactNode;
  }[];
  data: TData[];
  pageSize?: number;
}

export function DataTable<TData>({
  columns,
  data,
  pageSize = 10,
}: DataTableProps<TData>) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate total pages
  const totalPages = Math.ceil(data.length / pageSize);
  
  // Get current page data
  const currentData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    if (totalPages > 1) {
      pages.push(1);
    }
    
    // Calculate range around current page
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis if needed
    if (start > 2) {
      pages.push('...');
    }
    
    // Add pages around current page
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Add ellipsis if needed
    if (end < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page if there are more than 1 pages
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  return (
    <div>
      <div className="rounded-md border border-neutral-800">
        <Table>
          <TableHeader className="bg-neutral-800">
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id || column.accessorKey || column.header}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="border-neutral-800 hover:bg-neutral-800/50">
                {columns.map((column, colIndex) => (
                  <TableCell 
                    key={`${rowIndex}-${colIndex}`}
                    className="py-3"
                  >
                    {column.cell 
                      ? column.cell({ row: { original: row } })
                      : column.accessorKey 
                        ? String((row as any)[column.accessorKey] || '')
                        : ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            
            {currentData.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === '...' ? (
                    <span className="px-4 py-2">...</span>
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page as number);
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
