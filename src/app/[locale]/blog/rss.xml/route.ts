import { getBlogPostsForLocale } from "@/lib/blog-posts";
import { getTranslations, getLocale } from "next-intl/server";

const siteUrl = "https://www.sqlnoir.com";

const localeToLanguageTag: Record<string, string> = {
  en: "en-US",
  "pt-br": "pt-BR",
};

const generateRssItem = (post: { title: string; excerpt: string; slug: string; date: string; author: string }) => {
  const pubDate = new Date(post.date).toUTCString();
  return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid>${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${post.author}</author>
    </item>
  `;
};

export async function GET() {
  const t = await getTranslations("blog.metadata");
  const locale = await getLocale();
  const posts = getBlogPostsForLocale(locale);
  const items = posts.map(generateRssItem).join("");
  const languageTag = localeToLanguageTag[locale] || "en-US";

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${t("rssTitle")}</title>
    <description>${t("rssDescription")}</description>
    <link>${siteUrl}/blog</link>
    <atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <language>${languageTag}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
