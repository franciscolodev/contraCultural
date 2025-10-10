import { siteConfig } from '@/site.config';

interface MenuItem {
  label: string;
  href: string;
  isActive: (path: string) => boolean;
  hasAnimate: boolean;
}

export const getMenus = (textMap: Record<string, string>, locale: string): MenuItem[] => {
  const target = locale === 'es' ? '' : `/${locale}`;
  const hasAnimate = locale === 'en';

  const getHref = (str: string): string => `${target}${str}`;
  const checkActive = (restr: string) => (path: string): boolean =>
    new RegExp(`^${target}${restr}`).test(path);

  return [
    {
      label: textMap['all'],
      href: getHref('/'),
      isActive: (path: string) => ['/', ''].map(getHref).includes(path),
      hasAnimate,
    },
    {
      label: textMap['works'],
      href: getHref('/works/'),
      isActive: checkActive('\\/works\\/?$'),
      hasAnimate,
    },
    {
      label: textMap['about'],
      href: getHref('/about/'),
      isActive: checkActive('\\/about\\/?$'),
      hasAnimate,
    },
    {
      label: textMap['contact'],
      href: `mailto:${siteConfig.email}`,
      isActive: (_path: string) => false,
      hasAnimate,
    },
  ];
};
