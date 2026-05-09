import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBarChart2,
  FiBriefcase,
  FiCheckCircle,
  FiChevronDown,
  FiCreditCard,
  FiGrid,
  FiHeart,
  FiLock,
  FiMessageSquare,
  FiPhone,
  FiSearch,
  FiSettings,
  FiShield,
  FiStar,
  FiTrendingUp,
  FiUsers,
  FiZap,
  FiGlobe,
} from "react-icons/fi";

import { useSeo } from "../../../../shared/seo/useSeo";
import { SITE_CONFIG, toAbsoluteUrl } from "../../../../shared/seo/siteConfig";
import { getFooterPage } from "./footerPageData";
import {
  Badge,
  Breadcrumb,
  CardsGrid,
  CheckItem,
  Checklist,
  Container,
  Content,
  CtaLink,
  CtaSection,
  Eyebrow,
  FaqItem,
  FaqList,
  Hero,
  HeroActions,
  HeroBadges,
  HeroContent,
  HeroInner,
  IconWrap,
  InfoCard,
  LegalText,
  LinkGrid,
  Page,
  PillLink,
  SearchBox,
  Section,
  SplitLayout,
  StatCard,
  StatsGrid,
  StepCard,
  Subtitle,
  Timeline,
  Title,
  Toc,
} from "./FooterPage.styles";

const iconMap = {
  briefcase: FiBriefcase,
  globe: FiGlobe,
  grid: FiGrid,
  heart: FiHeart,
  lock: FiLock,
  message: FiMessageSquare,
  phone: FiPhone,
  settings: FiSettings,
  shield: FiShield,
  star: FiStar,
  trending: FiTrendingUp,
  users: FiUsers,
  wallet: FiCreditCard,
  zap: FiZap,
  chart: FiBarChart2,
};

const Icon = ({ name = "shield" }) => {
  const IconComponent = iconMap[name] || FiShield;
  return (
    <IconWrap aria-hidden="true">
      <IconComponent />
    </IconWrap>
  );
};

const ActionLink = ({ action, variant }) => (
  <CtaLink to={action.to} $variant={action.variant || variant}>
    {action.label}
    <FiArrowRight aria-hidden="true" />
  </CtaLink>
);

const normalizeText = (value) => String(value || "").toLowerCase();

const itemMatchesQuery = (item, query) => {
  if (!query) return true;
  return [
    item.title,
    item.text,
    item.question,
    item.answer,
    ...(Array.isArray(item.items) ? item.items : []),
  ]
    .map(normalizeText)
    .join(" ")
    .includes(query);
};

const buildStructuredData = (page, faqItems) => {
  const canonicalUrl = toAbsoluteUrl(page.path);
  const base = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_CONFIG.organizationName,
      url: SITE_CONFIG.baseUrl,
      logo: toAbsoluteUrl(SITE_CONFIG.defaultOgImage),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
      description: page.description,
      url: canonicalUrl,
      isPartOf: {
        "@type": "WebSite",
        name: SITE_CONFIG.siteName,
        url: SITE_CONFIG.baseUrl,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: toAbsoluteUrl("/user"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: page.title,
          item: canonicalUrl,
        },
      ],
    },
  ];

  if (faqItems.length) {
    base.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return base;
};

const getFaqItems = (sections = []) =>
  sections.flatMap((section) => (section.type === "faq" ? section.items || [] : []));

const SectionRenderer = ({ section }) => {
  if (section.type === "cards") {
    return (
      <CardsGrid>
        {section.items?.map((item) => (
          <InfoCard key={`${section.id}-${item.title}`}>
            <Icon name={item.icon} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </InfoCard>
        ))}
      </CardsGrid>
    );
  }

  if (section.type === "steps") {
    return (
      <Timeline>
        {section.items?.map((item, index) => (
          <StepCard key={`${section.id}-${item.title}`}>
            <strong>{String(index + 1).padStart(2, "0")}</strong>
            <Icon name={item.icon || "zap"} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </StepCard>
        ))}
      </Timeline>
    );
  }

  if (section.type === "list") {
    return (
      <Checklist>
        {section.items?.map((item) => (
          <CheckItem key={`${section.id}-${item}`}>
            <FiCheckCircle aria-hidden="true" />
            <span>{item}</span>
          </CheckItem>
        ))}
      </Checklist>
    );
  }

  if (section.type === "faq") {
    return (
      <FaqList>
        {section.items?.map((item) => (
          <FaqItem key={`${section.id}-${item.question}`}>
            <summary>
              {item.question}
              <FiChevronDown aria-hidden="true" />
            </summary>
            <p>{item.answer}</p>
          </FaqItem>
        ))}
      </FaqList>
    );
  }

  if (section.type === "legal") {
    return (
      <LegalText>
        {section.items?.map((item) => (
          <article key={`${section.id}-${item.title}`}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </LegalText>
    );
  }

  return null;
};

const FooterPage = ({ pageKey }) => {
  const page = getFooterPage(pageKey);
  const [query, setQuery] = useState("");

  const faqItems = useMemo(() => getFaqItems(page?.sections), [page]);
  const structuredData = useMemo(
    () => (page ? buildStructuredData(page, faqItems) : []),
    [page, faqItems]
  );

  useSeo({
    title: page ? `${page.title} | ${SITE_CONFIG.siteName}` : SITE_CONFIG.siteName,
    description: page?.description || "G9 Experts",
    canonicalPath: page?.path || "/user",
    keywords: page?.keywords,
    og: {
      title: page ? `${page.title} | ${SITE_CONFIG.siteName}` : SITE_CONFIG.siteName,
      description: page?.description,
    },
    twitter: {
      title: page ? `${page.title} | ${SITE_CONFIG.siteName}` : SITE_CONFIG.siteName,
      description: page?.description,
    },
    structuredData,
  });

  const filteredSections = useMemo(() => {
    if (!page?.sections) return [];
    const normalizedQuery = normalizeText(query).trim();
    if (!normalizedQuery) return page.sections;

    return page.sections
      .map((section) => ({
        ...section,
        items: section.items?.filter((item) => itemMatchesQuery(item, normalizedQuery)),
      }))
      .filter((section) => {
        const sectionMatches = normalizeText(`${section.title} ${section.text}`).includes(normalizedQuery);
        return sectionMatches || (section.items && section.items.length > 0);
      });
  }, [page, query]);

  if (!page) return null;

  const body = (
    <Content>
      {filteredSections.map((section) => (
        <Section id={section.id} key={section.id}>
          <h2>{section.title}</h2>
          {section.text ? <p>{section.text}</p> : null}
          <SectionRenderer section={section} />
        </Section>
      ))}

      {page.links?.length ? (
        <Section aria-labelledby={`${pageKey}-links`}>
          <h2 id={`${pageKey}-links`}>{page.linksTitle || "Related Pages"}</h2>
          <LinkGrid>
            {page.links.map((link) => (
              <PillLink key={link.to} to={link.to}>
                {link.label}
                <FiArrowRight aria-hidden="true" />
              </PillLink>
            ))}
          </LinkGrid>
        </Section>
      ) : null}
    </Content>
  );

  return (
    <Page>
      <Hero>
        <HeroInner>
          <Breadcrumb aria-label="Breadcrumb">
            <Link to="/user">Home</Link>
            <span>/</span>
            <span>{page.title}</span>
          </Breadcrumb>

          <HeroContent>
            <Eyebrow>{page.label}</Eyebrow>
            <Title>{page.title}</Title>
            <Subtitle>{page.subtitle}</Subtitle>

            {page.searchPlaceholder ? (
              <SearchBox role="search">
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={page.searchPlaceholder}
                  aria-label={`Search ${page.title}`}
                />
                <span aria-hidden="true">
                  <FiSearch />
                </span>
              </SearchBox>
            ) : null}

            {page.ctas?.length ? (
              <HeroActions>
                {page.ctas.map((action, index) => (
                  <ActionLink
                    key={`${action.label}-${action.to}`}
                    action={action}
                    variant={index === 0 ? "primary" : "secondary"}
                  />
                ))}
              </HeroActions>
            ) : null}
          </HeroContent>

          {page.badges?.length ? (
            <HeroBadges aria-label="Trust badges">
              {page.badges.map((badge) => (
                <Badge key={badge} $light>
                  <FiCheckCircle aria-hidden="true" />
                  {badge}
                </Badge>
              ))}
            </HeroBadges>
          ) : null}
        </HeroInner>
      </Hero>

      <Container>
        {page.stats?.length ? (
          <StatsGrid aria-label={`${page.title} statistics`}>
            {page.stats.map((stat) => (
              <StatCard key={`${stat.value}-${stat.label}`}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </StatCard>
            ))}
          </StatsGrid>
        ) : null}

        {page.legal ? (
          <SplitLayout>
            <Toc aria-label={`${page.title} table of contents`}>
              <h2>On this page</h2>
              {page.sections.map((section) => (
                <a href={`#${section.id}`} key={section.id}>
                  {section.title}
                </a>
              ))}
            </Toc>
            {body}
          </SplitLayout>
        ) : (
          body
        )}

        {page.cta ? (
          <CtaSection>
            <div>
              <h2>{page.cta.title}</h2>
              <p>{page.cta.text}</p>
            </div>
            <ActionLink action={page.cta.action} />
          </CtaSection>
        ) : null}
      </Container>
    </Page>
  );
};

export default FooterPage;
