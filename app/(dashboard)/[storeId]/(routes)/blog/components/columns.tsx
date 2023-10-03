'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type BlogColumn = {
  id: string;
  title: string;
  blogSlug: string;
  createdAt: string;
};

export const columns: ColumnDef<BlogColumn>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'blogSlug',
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
