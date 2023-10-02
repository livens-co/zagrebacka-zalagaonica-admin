'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type BrandColumn = {
  id: string;
  name: string;
  brandSlug: string;
  createdAt: string;
};

export const columns: ColumnDef<BrandColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'brandSlug',
    header: 'URL',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
  },
  {
    id: 'actions',
    cell: ({row})=> <CellAction data={row.original}/>
  }
];
