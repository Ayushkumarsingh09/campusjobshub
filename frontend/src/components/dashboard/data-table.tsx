import { cn } from '@/lib/utils';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available',
  className,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div
        className={cn(
          'rounded-lg border bg-card px-6 py-12 text-center text-sm text-muted-foreground',
          className
        )}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden rounded-lg border bg-card', className)}>
      <div className="overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    'h-11 px-4 text-left align-middle font-medium text-muted-foreground',
                    col.headerClassName
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="border-b transition-colors last:border-0 hover:bg-muted/30"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn('px-4 py-3 align-middle', col.className)}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
