import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DataTableProps {
  columns: { key: string; label: string; render?: (value: any, row: any) => React.ReactNode }[];
  data: any[];
  onRowClick?: (row: any) => void;
  emptyMessage?: string;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, onRowClick, emptyMessage = 'No data found' }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <motion.tr
                  key={row.id || i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'border-b border-border/50 transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-muted/30'
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm">
                      {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
