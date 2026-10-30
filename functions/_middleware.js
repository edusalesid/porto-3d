// Cloudflare Pages middleware: canonical host redirect.
// Apex (riizalhp.web.id) and all HTTP requests are 301'd to https://www.riizalhp.web.id
// preserving path and query string.
const CANONICAL_HOST = 'www.riizalhp.web.id';
const APEX_HOST = 'riizalhp.web.id';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const needsHttps = url.protocol !== 'https:';
  const needsWww = url.hostname === APEX_HOST;

  if (needsHttps || needsWww) {
    const target = new URL(context.request.url);
    target.protocol = 'https:';
    target.hostname = CANONICAL_HOST;
    return Response.redirect(target.toString(), 301);
  }

  return context.next();
}
