import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

// Define a custom type for Prisma errors
type PrismaError = {
  code: string;
  meta?: {
    target: string[];
  };
};

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { title, blogSlug, imageUrl, content } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!title) {
      return new NextResponse('Title is required', { status: 400 });
    }

    if (!content) {
      return new NextResponse('Article text is required', { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse('Image URL is required', { status: 400 });
    }

    if (!blogSlug) {
      return new NextResponse('Article URL is required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // TRY CATCH to check if category slug is unique (add message name must be unique)
    try {
      const blog = await prismadb.blog.create({
        data: {
          title,
          content,
          blogSlug,
          imageUrl,
          storeId: params.storeId,
        },
      });

      return NextResponse.json(blog);
    } catch (error) {
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2002' && prismaError.meta?.target.includes('blogSlug')) {
        // Handle the error when the name is not unique
        return new NextResponse('Blog URL must be unique', { status: 400 });
      }
      
      throw error;
    }
  } catch (error) {
    console.log('[BLOG_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const blogs = await prismadb.blog.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(blogs);
  } catch (error) {
    console.log('[BLOGS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
