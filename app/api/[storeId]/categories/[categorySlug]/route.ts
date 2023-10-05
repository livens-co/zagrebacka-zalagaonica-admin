import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function GET(
  _req: Request,
  { params }: { params: { categorySlug: string } }
) {
  try {
    if (!params.categorySlug) {
      return new NextResponse('Category URL is required', { status: 400 });
    }

    const category = await prismadb.category.findUnique({
      where: {
        categorySlug: params.categorySlug,
      },
      include: {
        // billboard: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORY_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categorySlug: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, description, imageUrl, categorySlug, isActive } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse('Image is required', { status: 400 });
    }

    if (!categorySlug) {
      return new NextResponse('Category URL is required', { status: 400 });
    }

    if (!description) {
      return new NextResponse('Description is required', { status: 400 });
    }

    if (!params.categorySlug) {
      return new NextResponse('Category URL is required', { status: 400 });
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

    const category = await prismadb.category.updateMany({
      where: {
        categorySlug: params.categorySlug,
      },
      data: {
        name,
        categorySlug,
        imageUrl,
        description,
        isActive
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORY_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; categorySlug: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!params.categorySlug) {
      return new NextResponse('Category URL is required', { status: 400 });
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

    const category = await prismadb.category.deleteMany({
      where: {
        categorySlug: params.categorySlug,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORY_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
