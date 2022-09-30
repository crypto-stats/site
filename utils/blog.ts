import { serialize } from 'next-mdx-remote/serialize'
import yaml from 'js-yaml'
import matter from 'gray-matter'

// Hack necessary to fix APIs since we overwrite the js-yaml version
// @ts-ignore
import engines from 'gray-matter/lib/engines'
engines.yaml = {
  parse: yaml.load.bind(yaml),
  stringify: yaml.dump.bind(yaml),
}

export interface BlogPost {
  slug: string
  title: string
  date: string | null
  metadata: any
}

export type Serialized = Awaited<ReturnType<typeof serialize>>

export interface BlogPostWithSource extends BlogPost {
  contentSource: Serialized
}

export async function getBlogPostList(): Promise<BlogPost[]> {
  const req = await fetch('https://api.github.com/repos/crypto-stats/blog/contents/cryptostats')
  const blogList = await req.json()

  // @ts-ignore
  yaml.safeLoad = yaml.load

  const entries = await Promise.all(
    blogList.map(async (file): Promise<BlogPost> => {
      const res = await fetch(file.download_url)
      const fileSource = await res.text()
      const {
        data: { title, date, ...metadata },
      } = matter(fileSource)

      return {
        slug: file.name.replace('.md', ''),
        title: title || file.name.replace('.md', ''),
        date: date ? date.toString() : null,
        metadata,
      }
    })
  )

  return entries
}

export async function getBlogPost(slug: string): Promise<BlogPostWithSource | null> {
  const req = await fetch('https://api.github.com/repos/crypto-stats/blog/contents/cryptostats')
  const blogList = await req.json()

  // @ts-ignore
  yaml.safeLoad = yaml.load

  for (const file of blogList) {
    if (file.name === `${slug}.md`) {
      const res = await fetch(file.download_url)
      const fileSource = await res.text()
      const {
        content,
        data: { title, date, ...metadata },
      } = matter(fileSource)
      const contentSource = await serialize(content)

      return {
        contentSource,
        slug: file.name.replace('.md', ''),
        title: title || file.name.replace('.md', ''),
        date: date ? date.toString() : null,
        metadata,
      }
    }
  }

  return null
}
