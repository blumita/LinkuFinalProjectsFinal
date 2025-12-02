// composables/useSEO.ts
export const useSEO = () => {
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();
  
  const baseUrl = runtimeConfig.public.baseUrl || 'https://linkuapp.com';
  
  /**
   * Generate meta tags for social sharing
   */
  const generateSocialMeta = (data: {
    title: string;
    description: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'profile';
    author?: string;
  }) => {
    const fullUrl = data.url || `${baseUrl}${route.fullPath}`;
    const image = data.image || `${baseUrl}/images/default-og-image.jpg`;
    
    return {
      title: data.title,
      ogTitle: data.title,
      description: data.description,
      ogDescription: data.description,
      ogImage: image,
      ogUrl: fullUrl,
      ogType: (data.type || 'website') as 'website' | 'article' | 'profile',
      ogSiteName: 'لینکو - LinkuDash',
      twitterCard: 'summary_large_image' as const,
      twitterTitle: data.title,
      twitterDescription: data.description,
      twitterImage: image,
      twitterCreator: '@linkudash',
      twitterSite: '@linkudash',
      author: data.author || 'LinkuDash',
      robots: 'index, follow' as const,
    };
  };

  /**
   * Generate JSON-LD structured data for Person
   */
  const generatePersonSchema = (data: {
    name: string;
    description?: string;
    image?: string;
    url?: string;
    jobTitle?: string;
    worksFor?: string;
    location?: string;
    sameAs?: string[];
    contactPoints?: Array<{
      type: 'phone' | 'email' | 'website';
      value: string;
    }>;
  }) => {
    const fullUrl = data.url || `${baseUrl}${route.fullPath}`;
    
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': fullUrl,
      name: data.name,
      url: fullUrl,
      description: data.description,
      image: data.image,
      jobTitle: data.jobTitle,
      address: data.location ? {
        '@type': 'PostalAddress',
        addressLocality: data.location,
        addressCountry: 'IR'
      } : undefined,
      sameAs: data.sameAs || [],
      contactPoint: []
    };

    // Add work organization
    if (data.worksFor) {
      schema.worksFor = {
        '@type': 'Organization',
        name: data.worksFor
      };
    }

    // Add contact points
    if (data.contactPoints) {
      data.contactPoints.forEach(contact => {
        schema.contactPoint.push({
          '@type': 'ContactPoint',
          contactType: 'customer service',
          ...(contact.type === 'phone' && { telephone: contact.value }),
          ...(contact.type === 'email' && { email: contact.value }),
          ...(contact.type === 'website' && { url: contact.value })
        });
      });
    }

    return schema;
  };

  /**
   * Generate JSON-LD structured data for Organization
   */
  const generateOrganizationSchema = (data: {
    name: string;
    description?: string;
    logo?: string;
    url?: string;
    sameAs?: string[];
    location?: string;
  }) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: data.name,
      url: data.url || baseUrl,
      logo: data.logo || `${baseUrl}/logo/logo.png`,
      description: data.description,
      sameAs: data.sameAs || [],
      address: data.location ? {
        '@type': 'PostalAddress',
        addressLocality: data.location,
        addressCountry: 'IR'
      } : undefined,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['Persian', 'English']
      }
    };
  };

  /**
   * Generate JSON-LD structured data for Website
   */
  const generateWebsiteSchema = (data: {
    name: string;
    description?: string;
    url?: string;
    searchUrl?: string;
  }) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: data.name,
      url: data.url || baseUrl,
      description: data.description,
      inLanguage: 'fa-IR',
      potentialAction: data.searchUrl ? {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${data.searchUrl}?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      } : undefined
    };
  };

  /**
   * Generate breadcrumb schema
   */
  const generateBreadcrumbSchema = (items: Array<{
    name: string;
    url: string;
  }>) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    };
  };

  /**
   * Set comprehensive SEO meta tags
   */
  const setSEOData = (data: {
    title: string;
    description: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'profile';
    author?: string;
    keywords?: string[];
    jsonLd?: any[];
  }) => {
    const socialMeta = generateSocialMeta(data);
    
    useSeoMeta(socialMeta);
    
    useHead({
      title: data.title,
      meta: [
        { name: 'keywords', content: data.keywords?.join(', ') || '' },
        { name: 'author', content: data.author || 'LinkuDash' },
        { name: 'copyright', content: 'LinkuDash' },
        { name: 'language', content: 'Persian' },
        { name: 'revisit-after', content: '7 days' },
        { name: 'distribution', content: 'global' },
        { name: 'rating', content: 'general' },
      ],
      link: [
        { rel: 'canonical', href: data.url || `${baseUrl}${route.fullPath}` }
      ],
      script: data.jsonLd ? data.jsonLd.map(schema => ({
        type: 'application/ld+json',
        children: JSON.stringify(schema)
      })) : []
    });
  };

  return {
    generateSocialMeta,
    generatePersonSchema,
    generateOrganizationSchema,
    generateWebsiteSchema,
    generateBreadcrumbSchema,
    setSEOData,
    baseUrl
  };
};
