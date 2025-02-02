import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./DataTableViewOptions"
import { DataTableFacetedFilter } from "./DataTableFacetedFilter"
import { FacetFilter } from "@/types"


interface DataTableToolbarProps<TData> {
  table: Table<TData>
  facets?: FacetFilter[]
  searchColumn?: string
  searchPlaceholder?: string
}

export function DataTableToolbar<TData>({
  table,
  facets = [],
  searchColumn,
  searchPlaceholder,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const searchColumnDef = table.getColumn(searchColumn ?? "name")

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchColumnDef && (
          <Input
            placeholder={searchPlaceholder}
            value={(searchColumnDef.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              searchColumnDef.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}

        {facets.map((facet) => {
          const column = table.getColumn(facet.column)
          return column ? (
            <DataTableFacetedFilter
              key={facet.column}
              column={column}
              title={facet.title}
              options={facet.options}
            />
          ) : null
        })}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}