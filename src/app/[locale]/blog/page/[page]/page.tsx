import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { Blog } from "@/components/Blog";
import { getPostsForPage, getTotalPages, isValidPage } from "@/lib/pagination";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

interface PageProps {
  params: Promise<{ page: string }>;
}

export async function generateStaticParams() {
  const totalPages = getTotalPages();
  return routing.locales.flatMap((locale) =>
    Array.from({ length: totalPages - 1 }, (_, i) => ({
      locale,
      page: String(i + 2),
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { page } = await params;
  const pageNum = parseInt(page, 10);

  const tBlog = await getTranslations("blog");
  const tMeta = await getTranslations("blog.metadata");

  const title = `${tBlog("pageTitle", { pageNum })} | ${tBlog("subtitle")}`;
  const description = tMeta("description");

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/page/${pageNum}`,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: `https://www.sqlnoir.com/blog/page/${pageNum}`,
      images: [
        {
          url: "/open-graph-image.png",
          width: 1200,
          height: 630,
          alt: tMeta("ogAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/open-graph-image.png"],
    },
  };
}

export default async function BlogPaginatedPage({ params }: PageProps) {
  const { page } = await params;
  const pageNum = parseInt(page, 10);

  // Redirect page 1 to /blog
  if (pageNum === 1) {
    redirect("/blog");
  }

  // 404 for invalid pages
  if (isNaN(pageNum) || !isValidPage(pageNum)) {
    notFound();
  }

  const tNav = await getTranslations("nav");

  const posts = getPostsForPage(pageNum);
  const totalPages = getTotalPages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tNav("home"),
        item: "https://www.sqlnoir.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tNav("blog"),
        item: "https://www.sqlnoir.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Page ${pageNum}`,
        item: `https://www.sqlnoir.com/blog/page/${pageNum}`,
      },
    ],
  };

  return (
    <>
      <Blog posts={posts} currentPage={pageNum} totalPages={totalPages} />
      <script
        id="blog-page-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
