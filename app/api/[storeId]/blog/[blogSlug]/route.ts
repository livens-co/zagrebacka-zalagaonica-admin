import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function GET(
  _req: Request,
  { params }: { params: { blogSlug: string } }
) {
  try {
    if (!params.blogSlug) {
      return new NextResponse('Article URL is required', { status: 400 });
    }

    const blog = await prismadb.blog.findUnique({
      where: {
        blogSlug: params.blogSlug,
      },
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.log('[ARTICLE_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; blogSlug: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { title, blogSlug, imageUrl, content, description, date } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!title) {
      return new NextResponse('Title is required', { status: 400 });
    }

    if (!content) {
      return new NextResponse('Article text is required', { status: 400 });
    }

    if (!date) {
      return new NextResponse('Date is required', { status: 400 });
    }

    if (!description) {
      return new NextResponse('Short description is required', { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse('Image URL is required', { status: 400 });
    }

    if (!blogSlug) {
      return new NextResponse('Article URL is required', { status: 400 });
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

    const blog = await prismadb.blog.updateMany({
      where: {
        blogSlug: params.blogSlug,
      },
      data: {
        title,
        content,
        blogSlug,
        imageUrl,
        description, 
        date
      },
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.log('[ARTICLE_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; blogSlug: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!params.blogSlug) {
      return new NextResponse('Article URL is required', { status: 400 });
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

    const blog = await prismadb.blog.deleteMany({
      where: {
        blogSlug: params.blogSlug,
      },
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.log('[ARTICLE_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
