'use client';

import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

import { BlogColumn, columns } from './columns';

interface BlogsClientProps {
  data: BlogColumn[];
}

export const BlogsClient: React.FC<BlogsClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Articles (${data.length})`}
          description="Manage articles for your website"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/blog/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="title" columns={columns} data={data} />
      <Heading title="API" description="API calls for Articles" />
      <Separator />
      <ApiList entityName="blog" entityIdName="blogSlug" />
    </>
  );
};
