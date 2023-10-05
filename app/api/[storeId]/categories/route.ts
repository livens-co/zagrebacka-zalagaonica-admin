import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

// type PrismaError = {
//   code: string;
//   meta?: {
//     target: string[];
//   };
// };

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, categorySlug, description, imageUrl, isActive } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse('Image URL is required', { status: 400 });
    }

    if (!description) {
      return new NextResponse('category description is required', { status: 400 });
    }

    if (!categorySlug) {
      return new NextResponse('Category URL is required', { status: 400 });
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
    // try {
      const category = await prismadb.category.create({
        data: {
          name,
          description,
          imageUrl,
          isActive,
          categorySlug,
          storeId: params.storeId,
        },
      });

      return NextResponse.json(category);
    // } catch (error) {
    //   const prismaError = error as PrismaError;
    //   if (prismaError.code === 'P2002' && prismaError.meta?.target.includes('categorySlug')) {
    //     // Handle the error when the name is not unique
    //     return new NextResponse('Category URL must be unique', { status: 400 });
    //   }
      
    //   throw error;
    // }
  } catch (error) {
    console.log('[CATEGORIES_POST]', error);
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

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log('[CATEGORIES_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
