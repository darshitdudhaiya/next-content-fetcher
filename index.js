import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'content')

/**
 * Fetches all content from the /content directory
 * @returns {Array} List of content files with metadata
 */
export function queryContent() {
    if (!fs.existsSync(contentDir)) {
        console.warn(`[next-content-fetcher] No content directory found.`)
        return []
    }

    const files = fs.readdirSync(contentDir).filter((file) => file.endsWith('.md') || file.endsWith('.json'))

    return files.map((filename) => {
        const filePath = path.join(contentDir, filename)
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const { data, content } = matter(fileContent)

        return { ...data, content, slug: filename.replace('.md', '').replace('.json', '') }
    })
}

/**
 * Fetches a single content file by slug
 * @param {string} slug - The content slug (filename without extension)
 * @returns {Object|null} The content object or null if not found
 */
export function getContentBySlug(slug) {
    const filePathMd = path.join(contentDir, `${slug}.md`)
    const filePathJson = path.join(contentDir, `${slug}.json`)

    let filePath = fs.existsSync(filePathMd) ? filePathMd : fs.existsSync(filePathJson) ? filePathJson : null
    if (!filePath) return null

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    return { ...data, content, slug }
}
