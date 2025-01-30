import { useState, useMemo } from 'react';
import { GridRow, SortConfig, FilterConfig } from '@/types/grid';
import { format, isWithinInterval } from 'date-fns';
import { ChevronUp, ChevronDown, Search, Calendar as CalendarIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DataGridProps {
  data: GridRow[];
}

const DataGrid = ({ data }: DataGridProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'prNumber', direction: null });
  const [filters, setFilters] = useState<FilterConfig>({});
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const handleSort = (key: keyof GridRow) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilter = (key: keyof GridRow, value: string) => {
    setFilters(current => ({
      ...current,
      [key]: value
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sortedAndFilteredData = useMemo(() => {
    let result = [...data];

    // Apply date range filter
    if (dateRange.from || dateRange.to) {
      result = result.filter(item => {
        const itemDate = new Date(item.mergeCommitTimestamp);
        if (dateRange.from && dateRange.to) {
          return isWithinInterval(itemDate, { start: dateRange.from, end: dateRange.to });
        } else if (dateRange.from) {
          return itemDate >= dateRange.from;
        } else if (dateRange.to) {
          return itemDate <= dateRange.to;
        }
        return true;
      });
    }

    // Apply other filters
    Object.keys(filters).forEach(key => {
      if (key !== 'mergeCommitTimestamp') { // Skip timestamp as we handle it separately
        const filterValue = filters[key].toLowerCase();
        if (filterValue) {
          result = result.filter(item => {
            const value = String(item[key as keyof GridRow]).toLowerCase();
            return value.includes(filterValue);
          });
        }
      }
    });

    // Apply sorting
    if (sortConfig.direction) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, sortConfig, filters, dateRange]);

  return (
    <div className="w-full overflow-hidden rounded-lg shadow-sm border fade-in">
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {Object.keys(data[0] || {}).map((key) => (
                <th key={key} className="px-6 py-3 border-b border-gray-200">
                  <div className="space-y-2">
                    <div 
                      className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer flex items-center gap-2"
                      onClick={() => handleSort(key as keyof GridRow)}
                    >
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                      {sortConfig.key === key && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                    {key === 'mergeCommitTimestamp' ? (
                      <div className="flex gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateRange.from ? (
                                dateRange.to ? (
                                  <>
                                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(dateRange.from, "LLL dd, y")
                                )
                              ) : (
                                "Select date range"
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              initialFocus
                              mode="range"
                              defaultMonth={dateRange.from}
                              selected={{ from: dateRange.from, to: dateRange.to }}
                              onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                              numberOfMonths={2}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    ) : (
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          type="text"
                          placeholder={`Filter ${key}`}
                          className="pl-8 text-sm"
                          onChange={(e) => handleFilter(key as keyof GridRow, e.target.value)}
                          value={filters[key] || ''}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedAndFilteredData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.prNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(row.mergeCommitTimestamp), 'PPpp')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.repoName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(row.deploymentStatus)}`}>
                    {row.deploymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortedAndFilteredData.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No data found matching your filters
          </div>
        )}
      </div>
    </div>
  );
};

export default DataGrid;