export default {
  async fetch(request) {
    const destination = new URL(request.url);
    destination.hostname = 'apete-serra.betaniaaa.workers.dev';
    destination.protocol = 'https:';
    return Response.redirect(destination.toString(), 308);
  }
};
