import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, brandSlug, isActive, isFeatured, imageUrl, categorySlug } =
      body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse('Image is required.', { status: 400 });
    }

    if (!brandSlug) {
      return new NextResponse('Brand URL is required', { status: 400 });
    }

    if (!categorySlug) {
      return new NextResponse('Category is required', { status: 400 });
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

    const brand = await prismadb.brand.create({
      data: {
        name,
        brandSlug,
        categorySlug,
        imageUrl,
        isActive,
        isFeatured,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.log('[BRAND_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('categorySlug') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const brands = await prismadb.brand.findMany({
      where: {
        storeId: params.storeId,
        categorySlug,
        isFeatured: isFeatured ? true : undefined,
        isActive: true,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(brands);
  } catch (error) {
    console.log('[BRANDS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
