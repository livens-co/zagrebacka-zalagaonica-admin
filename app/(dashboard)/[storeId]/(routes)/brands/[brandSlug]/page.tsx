import prismadb from '@/lib/prismadb';
import { BrandForm } from './components/brand-form';

const BrandPage = async ({ params }: { params: { brandSlug: string } }) => {
  const brand = await prismadb.brand.findUnique({
    where: {
      brandSlug: params.brandSlug,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BrandForm initialData={brand} />
      </div>
    </div>
  );
};

export default BrandPage;
