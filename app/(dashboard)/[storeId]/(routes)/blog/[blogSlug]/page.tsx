import prismadb from "@/lib/prismadb";
import { ArticleForm } from "./components/article-form";

const ArticlePage = async ({
  params,
}: {
  params: { blogSlug: string; storeId: string };
}) => {
  const article = await prismadb.blog.findUnique({
    where: {
      blogSlug: params.blogSlug,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ArticleForm initialData={article} />
      </div>
      <div className="flex-col">
        <h3>Upute za blog</h3>
        <ul>
          <li>
            <span className="font-bold">h1</span> #
          </li>
          <li>
            <span className="font-bold">h2</span> ##
          </li>
          <li>
            <span className="font-bold">h3</span> ###
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ArticlePage;
