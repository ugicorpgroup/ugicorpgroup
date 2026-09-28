import type { Schema, Struct } from '@strapi/strapi';

export interface SharedContentSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_content_sections';
  info: {
    displayName: 'Content section';
    icon: 'layout';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    buttonHref: Schema.Attribute.String;
    buttonLabel: Schema.Attribute.String;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    imagePosition: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'right'>;
  };
}

export interface SharedFeature extends Struct.ComponentSchema {
  collectionName: 'components_shared_features';
  info: {
    displayName: 'Feature';
    icon: 'check';
  };
  attributes: {
    icon: Schema.Attribute.Enumeration<
      [
        'engineering',
        'safety',
        'people',
        'sustainability',
        'oil',
        'power',
        'renewable',
        'infrastructure',
        'construction',
      ]
    >;
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFooterColumn extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_columns';
  info: {
    displayName: 'Footer column';
    icon: 'bulletList';
  };
  attributes: {
    links: Schema.Attribute.Component<'shared.navigation-link', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedNavigationLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_navigation_links';
  info: {
    displayName: 'Navigation link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    isButton: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedStat extends Struct.ComponentSchema {
  collectionName: 'components_shared_stats';
  info: {
    displayName: 'Statistic';
    icon: 'chartBubble';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'shared.content-section': SharedContentSection;
      'shared.feature': SharedFeature;
      'shared.footer-column': SharedFooterColumn;
      'shared.navigation-link': SharedNavigationLink;
      'shared.stat': SharedStat;
    }
  }
}
