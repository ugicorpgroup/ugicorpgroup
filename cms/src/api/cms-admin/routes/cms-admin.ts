export default {
  routes: [
    { method: 'POST', path: '/cms-admin/login', handler: 'cms-admin.login', config: { auth: false } },
    { method: 'GET', path: '/cms-admin/content/:model', handler: 'cms-admin.find', config: { auth: false } },
    { method: 'PUT', path: '/cms-admin/content/:model/:documentId', handler: 'cms-admin.save', config: { auth: false } },
    { method: 'POST', path: '/cms-admin/content/:model', handler: 'cms-admin.save', config: { auth: false } },
    { method: 'DELETE', path: '/cms-admin/content/:model/:documentId', handler: 'cms-admin.remove', config: { auth: false } },
    { method: 'POST', path: '/cms-admin/upload', handler: 'cms-admin.upload', config: { auth: false } }
  ]
};
