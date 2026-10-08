import crypto from 'node:crypto';
import type { Core } from '@strapi/strapi';

const models: Record<string, { uid: string; single: boolean }> = {
  global: { uid: 'api::global-setting.global-setting', single: true }, home: { uid: 'api::home-page.home-page', single: true },
  pages: { uid: 'api::page.page', single: false }, services: { uid: 'api::service.service', single: false },
    projects: { uid: 'api::project.project', single: false }, articles: { uid: 'api::article.article', single: false }, offices: { uid: 'api::office.office', single: false },
    trends: { uid: 'api::emerging-trend.emerging-trend', single: false }
};
function equal(value: unknown, expected: string) { const left = Buffer.from(String(value || '')); const right = Buffer.from(expected); return left.length === right.length && crypto.timingSafeEqual(left, right); }
async function authorize(ctx: any, strapi: Core.Strapi) {
  const token = String(ctx.request.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return false;
  try { const payload = await strapi.plugin('users-permissions').service('jwt').verify(token); return payload?.scope === 'ugi-cms-admin'; } catch { return false; }
}
function cleanData(body: any) { const data = { ...(body?.data || body || {}) }; ['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'locale'].forEach((key) => delete data[key]); return data; }

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async login(ctx: any) {
    const expectedEmail = process.env.CMS_ADMIN_EMAIL || 'admin@ugicorpgroup.com'; const expectedPassword = process.env.CMS_ADMIN_PASSWORD;
    if (!expectedPassword) return ctx.internalServerError('CMS admin credentials are not configured.');
    if (!equal(ctx.request.body?.email?.toLowerCase(), expectedEmail.toLowerCase()) || !equal(ctx.request.body?.password, expectedPassword)) return ctx.unauthorized('Invalid email or password.');
    const token = strapi.plugin('users-permissions').service('jwt').issue({ id: 'ugi-cms-admin', scope: 'ugi-cms-admin', email: expectedEmail }, { expiresIn: '8h' });
    ctx.body = { token, user: { email: expectedEmail, name: 'US GLOBAL IMPEX Administrator' } };
  },
  async find(ctx: any) {
    if (!(await authorize(ctx, strapi))) return ctx.unauthorized(); const model = models[ctx.params.model]; if (!model) return ctx.badRequest('Unknown content model.');
    const documents = strapi.documents(model.uid as any);
    ctx.body = model.single ? await documents.findFirst({ status: 'draft', populate: '*' } as any) : await documents.findMany({ status: 'draft', populate: '*', pageSize: 100, sort: ['updatedAt:desc'] } as any);
  },
  async save(ctx: any) {
    if (!(await authorize(ctx, strapi))) return ctx.unauthorized(); const model = models[ctx.params.model]; if (!model) return ctx.badRequest('Unknown content model.');
    const documents = strapi.documents(model.uid as any); const data = cleanData(ctx.request.body); let documentId = ctx.params.documentId;
    if (model.single && !documentId) documentId = (await documents.findFirst({ status: 'draft' } as any))?.documentId;
    const saved = documentId ? await documents.update({ documentId, data, status: 'draft' } as any) : await documents.create({ data, status: 'draft' } as any);
    await documents.publish({ documentId: saved.documentId } as any);
    ctx.body = await documents.findOne({ documentId: saved.documentId, status: 'published', populate: '*' } as any);
  },
  async remove(ctx: any) {
    if (!(await authorize(ctx, strapi))) return ctx.unauthorized(); const model = models[ctx.params.model]; if (!model || model.single) return ctx.badRequest('This content cannot be deleted.');
    await strapi.documents(model.uid as any).delete({ documentId: ctx.params.documentId } as any); ctx.body = { ok: true };
  },
  async upload(ctx: any) {
    if (!(await authorize(ctx, strapi))) return ctx.unauthorized(); const files = ctx.request.files?.files || ctx.request.files?.file; if (!files) return ctx.badRequest('Select an image to upload.');
    const uploaded = await strapi.plugin('upload').service('upload').upload({ data: {}, files }); ctx.body = Array.isArray(uploaded) ? uploaded[0] : uploaded;
  }
});
