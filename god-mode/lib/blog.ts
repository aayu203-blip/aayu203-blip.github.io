import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type BlogPost = {
    slug: string
    title: string
    date: string
    excerpt: string
    readTime: number
    content: string
    tags?: string[]
}

const postsDirectory = path.join(process.cwd(), 'content/blog')

export async function getAllPosts(): Promise<BlogPost[]> {
    // Ensure directory exists
    if (!fs.existsSync(postsDirectory)) {
        return []
    }

    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
        .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
        .map(fileName => {
            const slug = fileName.replace(/\.mdx?$/, '')
            const fullPath = path.join(postsDirectory, fileName)
            const fileContents = fs.readFileSync(fullPath, 'utf8')
            const { data, content } = matter(fileContents)

            return {
                slug,
                title: data.title,
                date: data.date,
                excerpt: data.excerpt,
                readTime: data.readTime || 5,
                content,
                tags: data.tags || [],
            }
        })

    // Sort by date
    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    const posts = await getAllPosts()
    return posts.find(post => post.slug === slug) || null
}
