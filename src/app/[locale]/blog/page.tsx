import type { Metadata } from "next";
import { Blog } from "@/components/Blog";
import { getBlogPostsForLocale } from "@/lib/blog-posts";
import { getPostsForPage, getTotalPages } from "@/lib/pagination";
import { getTranslations, getLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog.metadata");
  const locale = await getLocale();
  const alternates = localeAlternates("/blog", locale);

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      ...alternates,
      types: {
        "application/rss+xml": "/blog/rss.xml",
      },
    },
    openGraph: {
      type: "website",
      title: t("title"),
      description: t("description"),
      url: "https://www.sqlnoir.com/blog",
      images: [
        {
          url: "/open-graph-image.png",
          width: 1200,
          height: 630,
          alt: t("ogAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/open-graph-image.png"],
    },
  };
}

export default async function BlogPage() {
  const tNav = await getTranslations("nav");
  const tBlog = await getTranslations("blog");
  const tMeta = await getTranslations("blog.metadata");
  const locale = await getLocale();

  const baseUrl = "https://www.sqlnoir.com";
  const localePosts = getBlogPostsForLocale(locale);
  const posts = getPostsForPage(1, locale);
  const totalPages = getTotalPages(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
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
        ],
      },
      {
        "@type": "Blog",
        name: tBlog("title"),
        description: tMeta("description"),
        url: "https://www.sqlnoir.com/blog",
        blogPost: localePosts.map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          dateModified: post.lastModified ?? post.date,
          author: {
            "@type": "Person",
            name: post.author,
          },
          mainEntityOfPage: `https://www.sqlnoir.com/blog/${post.slug}`,
          image: `${baseUrl}${post.heroImage.src}`,
        })),
      },
    ],
  };

  return (
    <>
      <Blog posts={posts} currentPage={1} totalPages={totalPages} />
      {/* JSON-LD script injected here */}
      <script
        id="blog-index-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
