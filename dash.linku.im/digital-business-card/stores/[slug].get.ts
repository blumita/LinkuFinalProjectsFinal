export default defineEventHandler((event)=>{
    const slug=event.context.params?.slug
    return sendRedirect(event,`/preview/${slug}`,302)
})