import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function GET(
  _req: Request,
  { params }: { params: { brandSlug: string } }
) {
  try {
    if (!params.brandSlug) {
      return new NextResponse('Brand URL is required', { status: 400 });
    }

    const brand = await prismadb.brand.findUnique({
      where: {
        brandSlug: params.brandSlug,
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.log('[BRAND_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; brandSlug: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, brandSlug } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!brandSlug) {
      return new NextResponse('Brand URL is required', { status: 400 });
    }

    if (!params.brandSlug) {
      return new NextResponse('Brand URL is required', { status: 400 });
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

    const brand = await prismadb.brand.updateMany({
      where: {
        brandSlug: params.brandSlug,
      },
      data: {
        name,
        brandSlug,
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.log('[BRAND_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; brandSlug: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!params.brandSlug) {
      return new NextResponse('Brand URL is required', { status: 400 });
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

    const brand = await prismadb.brand.deleteMany({
      where: {
        brandSlug: params.brandSlug,
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.log('[BRAND_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
