import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

type DataTableSkeletonProps = {
  columnCount: number
  rowCount: number
  rowHeight?: number
  className?: string
}

const widths = ['72%', '58%', '46%', '64%', '40%', '52%', '68%', '44%']

export function DataTableSkeleton({
  columnCount,
  rowCount,
  rowHeight,
  className,
}: DataTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <TableRow
          key={rowIndex}
          className={cn('hover:bg-transparent', className)}
          style={rowHeight ? { height: rowHeight } : undefined}
        >
          {Array.from({ length: columnCount }).map((__, columnIndex) => (
            <TableCell key={columnIndex}>
              <Skeleton
                className="h-3.5"
                style={{
                  width:
                    widths[(rowIndex + columnIndex) % widths.length] ?? '55%',
                }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}
