import type { StrapiApp } from '@strapi/strapi/admin';
import UgiMark from './ugi-mark.svg';

export default {
  config: {
    auth: { logo: UgiMark },
    menu: { logo: UgiMark },
    head: { favicon: UgiMark },
    theme: {
      light: {
        colors: {
          primary100: '#fff7df',
          primary200: '#fbe9b3',
          primary500: '#edae27',
          primary600: '#c98d0c',
          primary700: '#9d6b05',
          buttonPrimary500: '#edae27',
          buttonPrimary600: '#d49611',
          neutral800: '#0a2634',
          neutral900: '#061b25'
        }
      }
    },
    translations: {
      en: {
        'Auth.form.welcome.title': 'Welcome to US GLOBAL IMPEX Content Hub',
        'Auth.form.welcome.subtitle': 'Sign in to manage website content and media',
        'app.components.LeftMenu.navbrand.title': 'US GLOBAL IMPEX Content Hub',
        'app.components.LeftMenu.navbrand.workplace': 'Website administration'
      }
    },
    tutorials: false,
    notifications: { releases: false }
  },
  bootstrap(_app: StrapiApp) {}
};
