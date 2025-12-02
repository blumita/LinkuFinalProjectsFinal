export default defineEventHandler(async (event) => {
  // Only apply to preview routes
  if (event.node.req.url?.startsWith('/preview')) {
    setHeader(event, 'X-Frame-Options', 'SAMEORIGIN')
    setHeader(event, 'Content-Security-Policy', "frame-ancestors 'self'")
  }
})
