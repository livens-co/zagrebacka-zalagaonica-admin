import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function GET(
  _req: Request,
  { params }: { params: { productSlug: string } }
) {
  try {
    if (!params.productSlug) {
      return new NextResponse('Product URL is required', { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        productSlug: params.productSlug,
      },
      include: {
        images: true,
        category: true,
        brand: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productSlug: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      price,
      categorySlug,
      brandSlug,
      description,
      paymentMethod,
      images,
      isFeatured,
      isArchived,
      productSlug,
    } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse('Images are required.', { status: 400 });
    }

    if (!price) {
      return new NextResponse('Price is required', { status: 400 });
    }

    if (!categorySlug) {
      return new NextResponse('Category is required', { status: 400 });
    }

    if (!productSlug) {
      return new NextResponse('Product URL is required', { status: 400 });
    }

    if (!brandSlug) {
      return new NextResponse('Brand is required', { status: 400 });
    }

    if (!description) {
      return new NextResponse('Product description is required', {
        status: 400,
      });
    }

    if (!paymentMethod) {
      return new NextResponse('Payment method is required', { status: 400 });
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

    await prismadb.product.update({
      where: {
        productSlug: params.productSlug,
      },
      data: {
        name,
        price,
        categorySlug,
        brandSlug,
        description,
        paymentMethod,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
        productSlug,
      },
    });

    const product = await prismadb.product.update({
      where: {
        productSlug: params.productSlug,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; productSlug: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!params.productSlug) {
      return new NextResponse('Product URL is required', { status: 400 });
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

    const product = await prismadb.product.deleteMany({
      where: {
        productSlug: params.productSlug,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
