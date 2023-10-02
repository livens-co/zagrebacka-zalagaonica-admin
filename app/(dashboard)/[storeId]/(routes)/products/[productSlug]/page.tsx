import prismadb from '@/lib/prismadb';
import { ProductForm } from './components/product-form';

const ProductPage = async ({
  params,
}: {
  params: { productSlug: string; storeId: string };
}) => {
  const product = await prismadb.product.findUnique({
    where: {
      productSlug: params.productSlug,
    },
    include: {
      images: true,
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const brands = await prismadb.brand.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          categories={categories}
          brands={brands}
        />
      </div>
    </div>
  );
};

export default ProductPage;
