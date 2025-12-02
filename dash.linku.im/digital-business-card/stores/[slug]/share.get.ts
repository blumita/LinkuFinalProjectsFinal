export default defineEventHandler((event)=>{
    const slug=event.context.params?.slug
    if(!slug){
        return sendRedirect(event,`/preview`,302)
    }
    return sendRedirect(event,`/${slug}`,302)
})