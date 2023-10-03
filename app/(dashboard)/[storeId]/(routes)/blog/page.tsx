import { format } from 'date-fns';
import prismadb from "@/lib/prismadb"

import { BlogsClient } from './components/client';
import { BlogColumn } from "./components/columns"


const BlogsPage = async({params}: {
  params: {storeId: string}
}) => {
  const blogs = await prismadb.blog.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedBlogs: BlogColumn[] = blogs.map(item=>({

    id: item.id,
    blogSlug: item.blogSlug,
    title: item.title,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BlogsClient data={formattedBlogs} />
      </div>
    </div>
  )
}

export default BlogsPage