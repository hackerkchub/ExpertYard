import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import { getFooterPage, getFooterPageAction } from "./footerPageData";
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

const ActionLink = ({ action, label, variant }) => (
  <CtaLink to={action.to} $variant={action.variant || variant}>
    {label}
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

const buildStructuredData = (page, copy, faqItems, homeLabel) => {
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
      name: copy.title,
      description: copy.description,
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
          name: homeLabel,
          item: toAbsoluteUrl("/user"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: copy.title,
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
  sections.flatMap((section) => (section.type === "faq" ? section.renderItems || [] : []));

const SectionRenderer = ({ section }) => {
  if (section.type === "cards") {
    return (
      <CardsGrid>
        {section.renderItems?.map((item) => (
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
        {section.renderItems?.map((item, index) => (
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
        {section.renderItems?.map((item) => (
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
        {section.renderItems?.map((item) => (
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
        {section.renderItems?.map((item) => (
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
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState("");

  const prefix = `footerPages.${page?.key || pageKey}`;
  const translate = (key, defaultValue = "") => t(`${prefix}.${key}`, { defaultValue });
  const translateAction = (action) => {
    const resolvedAction = getFooterPageAction(action);
    const label = resolvedAction.labelKey
      ? t(resolvedAction.labelKey)
      : translate(`actions.${resolvedAction.labelId}`);

    return { action: resolvedAction, label };
  };

  const copy = useMemo(() => {
    if (!page) return null;

    return {
      label: translate("label"),
      title: translate("title"),
      subtitle: translate("subtitle"),
      description: translate("description"),
      keywords: translate("keywords"),
      searchPlaceholder: page.search ? translate("searchPlaceholder") : "",
      linksTitle: translate("linksTitle", t("footerPages.common.relatedPages")),
      badges: page.badgeIds?.map((id) => translate(`badges.${id}`)) || [],
      stats:
        page.stats?.map((id) => ({
          value: translate(`stats.${id}.value`),
          label: translate(`stats.${id}.label`),
        })) || [],
      ctas: page.ctas?.map(translateAction) || [],
      links:
        page.links?.map((link) => ({
          ...link,
          label: translate(`links.${link.id}`),
        })) || [],
      cta: page.cta
        ? {
            title: translate(`cta.${page.cta.id}.title`),
            text: translate(`cta.${page.cta.id}.text`),
            ...translateAction(page.cta.action),
          }
        : null,
      sections:
        page.sections?.map((section) => ({
          ...section,
          title: translate(`sections.${section.id}.title`),
          text: translate(`sections.${section.id}.text`),
          renderItems:
            section.items?.map((item) => {
              const itemId = typeof item === "string" ? item : item.id;
              const icon = typeof item === "string" ? undefined : item.icon;
              const itemPrefix = `sections.${section.id}.items.${itemId}`;

              if (section.type === "faq") {
                return {
                  question: translate(`${itemPrefix}.question`),
                  answer: translate(`${itemPrefix}.answer`),
                };
              }

              if (section.type === "list") {
                return translate(itemPrefix);
              }

              return {
                icon,
                title: translate(`${itemPrefix}.title`),
                text: translate(`${itemPrefix}.text`),
              };
            }) || [],
        })) || [],
    };
  }, [i18n.language, page, prefix, t]);

  const faqItems = useMemo(() => getFaqItems(copy?.sections), [copy]);
  const structuredData = useMemo(
    () => (page && copy ? buildStructuredData(page, copy, faqItems, t("common.home")) : []),
    [page, copy, faqItems, t]
  );

  useSeo({
    title: copy ? `${copy.title} | ${SITE_CONFIG.siteName}` : SITE_CONFIG.siteName,
    description: copy?.description || "G9 Experts",
    canonicalPath: page?.path || "/user",
    keywords: copy?.keywords,
    og: {
      title: copy ? `${copy.title} | ${SITE_CONFIG.siteName}` : SITE_CONFIG.siteName,
      description: copy?.description,
    },
    twitter: {
      title: copy ? `${copy.title} | ${SITE_CONFIG.siteName}` : SITE_CONFIG.siteName,
      description: copy?.description,
    },
    structuredData,
  });

  const filteredSections = useMemo(() => {
    if (!copy?.sections) return [];
    const normalizedQuery = normalizeText(query).trim();
    if (!normalizedQuery) return copy.sections;

    return copy.sections
      .map((section) => ({
        ...section,
        renderItems: section.renderItems?.filter((item) => itemMatchesQuery(item, normalizedQuery)),
      }))
      .filter((section) => {
        const sectionMatches = normalizeText(`${section.title} ${section.text}`).includes(normalizedQuery);
        return sectionMatches || (section.renderItems && section.renderItems.length > 0);
      });
  }, [copy, query]);

  if (!page || !copy) return null;

  const body = (
    <Content>
      {filteredSections.map((section) => (
        <Section id={section.id} key={section.id}>
          <h2>{section.title}</h2>
          {section.text ? <p>{section.text}</p> : null}
          <SectionRenderer section={section} />
        </Section>
      ))}

      {copy.links?.length ? (
        <Section aria-labelledby={`${pageKey}-links`}>
          <h2 id={`${pageKey}-links`}>{copy.linksTitle}</h2>
          <LinkGrid>
            {copy.links.map((link) => (
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
          <Breadcrumb aria-label={t("footerPages.common.breadcrumb")}>
            <Link to="/user">{t("common.home")}</Link>
            <span>/</span>
            <span>{copy.title}</span>
          </Breadcrumb>

          <HeroContent>
            <Eyebrow>{copy.label}</Eyebrow>
            <Title>{copy.title}</Title>
            <Subtitle>{copy.subtitle}</Subtitle>

            {copy.searchPlaceholder ? (
              <SearchBox role="search">
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={copy.searchPlaceholder}
                  aria-label={t("footerPages.common.searchAria", { page: copy.title })}
                />
                <span aria-hidden="true">
                  <FiSearch />
                </span>
              </SearchBox>
            ) : null}

            {copy.ctas?.length ? (
              <HeroActions>
                {copy.ctas.map(({ action, label }, index) => (
                  <ActionLink
                    key={`${label}-${action.to}`}
                    action={action}
                    label={label}
                    variant={index === 0 ? "primary" : "secondary"}
                  />
                ))}
              </HeroActions>
            ) : null}
          </HeroContent>

          {copy.badges?.length ? (
            <HeroBadges aria-label={t("footerPages.common.trustBadges")}>
              {copy.badges.map((badge) => (
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
        {copy.stats?.length ? (
          <StatsGrid aria-label={t("footerPages.common.statsAria", { page: copy.title })}>
            {copy.stats.map((stat) => (
              <StatCard key={`${stat.value}-${stat.label}`}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </StatCard>
            ))}
          </StatsGrid>
        ) : null}

        {page.legal ? (
          <SplitLayout>
            <Toc aria-label={t("footerPages.common.tocAria", { page: copy.title })}>
              <h2>{t("footerPages.common.onThisPage")}</h2>
              {copy.sections.map((section) => (
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

        {copy.cta ? (
          <CtaSection>
            <div>
              <h2>{copy.cta.title}</h2>
              <p>{copy.cta.text}</p>
            </div>
            <ActionLink action={copy.cta.action} label={copy.cta.label} />
          </CtaSection>
        ) : null}
      </Container>
    </Page>
  );
};

export default FooterPage;
