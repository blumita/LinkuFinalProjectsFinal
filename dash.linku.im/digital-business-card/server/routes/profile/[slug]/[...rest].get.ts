export default defineEventHandler((event) => {
    const { slug } = event.context.params!
    const redirectPath = `/${slug}`
    return sendRedirect(event, redirectPath, 301)
})
