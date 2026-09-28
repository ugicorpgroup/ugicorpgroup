export default () => async (ctx: any, next: () => Promise<void>) => {
  if (ctx.path === '/admin' || ctx.path.startsWith('/admin/')) {
    ctx.status = 404;
    ctx.body = { error: 'Use the UGI Content Hub at the website /admin route.' };
    return;
  }
  await next();
};
