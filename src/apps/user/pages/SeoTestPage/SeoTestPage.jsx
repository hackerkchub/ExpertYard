import React, { useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSeo } from "../../../../shared/seo/useSeo";
import AppNotFound from "../../../../routes/AppNotFound";
import { locationData } from "./locationConfig";
import {
  Container,
  HeroSection,
  HeroWrapper,
  BreadcrumbNav,
  MainTitle,
  IntroText,
  ContentWrapper,
  Card,
  SectionTitle,
  ServiceGrid,
  ServiceCard,
  ServiceCardTitle,
  ServiceCardDesc,
  Paragraph,
  LocalHubList,
  LocalHubItem,
  MicroLocalityGroup,
  MicroLocalityTag,
  ExpertGrid,
  ExpertCard,
  ExpertHeader,
  ExpertAvatarInitials,
  ExpertAvatarImg,
  ExpertMeta,
  ExpertName,
  ExpertPosition,
  ExpertSpecialization,
  ExpertLocation,
  ExpertBadgeGroup,
  ExpertTag,
  ExpertBarCouncil,
  ExpertActionGroup,
  ExpertCardCta,
  EmptyStateContainer,
  EmptyStateTitle,
  EmptyStateText,
  CtaBanner,
  CtaTitle,
  CtaText,
  CtaButton,
  FaqList,
  FaqItem,
  FaqQuestion,
  FaqAnswer,
  LinksGrid,
  RelatedLink
} from "./SeoTestPage.styles";

export default function SeoTestPage() {
  const params = useParams();
  const location = useLocation();

  // Strict city resolution: prevents soft-404 and duplicate content leakage
  const { currentCity, isNotFound } = useMemo(() => {
    const pathname = location.pathname.toLowerCase().replace(/\/$/, "");

    // 1. Direct hit on root "/lawyers" path without a parameter defaults to Indore
    if (pathname === "/lawyers" && !params.citySlug) {
      return { currentCity: locationData["indore"], isNotFound: false };
    }

    // 2. Dynamic parameterized route (/:citySlug/lawyers)
    if (params.citySlug) {
      const slug = params.citySlug.toLowerCase();
      if (locationData[slug]) {
        return { currentCity: locationData[slug], isNotFound: false };
      }
      return { currentCity: null, isNotFound: true };
    }

    // 3. Explicit static route check (e.g., /indore/lawyers, /bhopal/lawyers, /jabalpur/lawyers, /gwalior/lawyers)
    const segments = pathname.split("/").filter(Boolean);
    const potentialCitySlug = (segments[0] || "").toLowerCase();

    if (potentialCitySlug && locationData[potentialCitySlug]) {
      return { currentCity: locationData[potentialCitySlug], isNotFound: false };
    }

    // 4. Any unconfigured slug -> hard 404 signal
    return { currentCity: null, isNotFound: true };
  }, [params.citySlug, location.pathname]);

  // Dynamic breadcrumb hierarchy
  const breadcrumbs = useMemo(() => {
    if (!currentCity) return [];
    return [
      { name: "Home", url: "/" },
      { name: currentCity.cityName, url: `/${currentCity.slug}/lawyers` },
      { name: "Lawyers", url: `/${currentCity.slug}/lawyers` }
    ];
  }, [currentCity]);

  // Dynamic JSON-LD Structured Data: LegalService + ItemList
  const structuredData = useMemo(() => {
    if (!currentCity) return [];

    const legalServiceSchema = {
      "@context": "https://schema.org",
      "@type": "LegalService",
      "@id": `https://g9expert.com/${currentCity.slug}/lawyers#legal-service`,
      "name": `G9Expert - Legal Services & Advocates Network ${currentCity.cityName}`,
      "alternateName": currentCity.title,
      "url": `https://g9expert.com/${currentCity.slug}/lawyers`,
      "logo": "https://g9expert.com/logo.png",
      "description": currentCity.description,
      "telephone": currentCity.telephone,
      "priceRange": "₹₹",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": currentCity.streetAddress,
        "addressLocality": currentCity.cityName,
        "addressRegion": "Madhya Pradesh",
        "postalCode": currentCity.postalCode,
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": currentCity.latitude,
        "longitude": currentCity.longitude
      },
      "areaServed": [
        { "@type": "City", "name": currentCity.cityName },
        { "@type": "AdministrativeArea", "name": "Madhya Pradesh" },
        ...(currentCity.microLocalities || []).map((locality) => ({
          "@type": "Place",
          "name": locality
        }))
      ],
      "hasMap": `https://maps.google.com/?q=${currentCity.latitude},${currentCity.longitude}`,
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "09:00",
          "closes": "20:00"
        }
      ],
      "knowsAbout": [
        ...(currentCity.courts || []),
        "Property Disputes & Verification",
        "Civil & Criminal Litigation",
        "Matrimonial & Divorce Law",
        "Corporate & Commercial Legal Advisory"
      ]
    };

    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `Top Advocates & Legal Experts in ${currentCity.cityName}`,
      "description": `Directory of verified advocates and legal consultants available for legal consultation in ${currentCity.cityName}, MP`,
      "numberOfItems": currentCity.experts?.length || 0,
      "itemListElement": (currentCity.experts || []).map((exp, index) => {
        const cleanSlug = exp.slug ? exp.slug.replace(/^advocate-/, "") : "";
        const profilePath = `/experts/profile/${cleanSlug}`;
        const profileFullUrl = `https://g9expert.com${profilePath}`;

        return {
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Person",
            "@id": profileFullUrl,
            "name": exp.name,
            "jobTitle": exp.jobTitle || "Advocate",
            "url": profileFullUrl,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": currentCity.cityName,
              "addressRegion": "Madhya Pradesh",
              "addressCountry": "IN"
            },
            "knowsAbout": exp.specialization || "Legal Services",
            "hasCredential": {
              "@type": "EducationalOccupationalCredential",
              "credentialCategory": "State Bar Council Enrollment",
              "recognizedBy": {
                "@type": "Organization",
                "name": "State Bar Council of Madhya Pradesh"
              },
              "validIn": {
                "@type": "AdministrativeArea",
                "name": "Madhya Pradesh"
              },
              "identifier": exp.stateBarCouncilId
            }
          }
        };
      })
    };

    return [legalServiceSchema, itemListSchema];
  }, [currentCity]);

  // Hook handles Title, Meta Description, Canonical URL, and script JSON-LD head injection
  useSeo(
    currentCity
      ? {
          title: currentCity.title,
          description: currentCity.description,
          canonicalPath: `/${currentCity.slug}/lawyers`,
          robots: "index, follow",
          breadcrumbs,
          structuredData
        }
      : {
          title: "404 - Legal Directory Not Found | G9Expert",
          description: "The requested legal directory could not be found.",
          canonicalPath: location.pathname,
          robots: "noindex, nofollow"
        }
  );

  // Short-circuit: hard 404 signal on unconfigured city slugs
  if (isNotFound || !currentCity) {
    return (
      <AppNotFound
        title="City Legal Directory Not Found"
        description={`We currently do not have a verified legal directory for "${params.citySlug || location.pathname}". Explore our verified advocates in active jurisdictions.`}
        homePath="/indore/lawyers"
        actionLabel="Browse Indore Legal Directory"
      />
    );
  }

  return (
    <Container>
      {/* Hero Section */}
      <HeroSection>
        <HeroWrapper>
          <BreadcrumbNav aria-label="Breadcrumb">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="separator">/</span>}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="current">{b.name}</span>
                ) : (
                  <Link to={b.url}>{b.name}</Link>
                )}
              </React.Fragment>
            ))}
          </BreadcrumbNav>

          <MainTitle>{currentCity.h1}</MainTitle>
          <IntroText>{currentCity.intro}</IntroText>
        </HeroWrapper>
      </HeroSection>

      <ContentWrapper>
        {/* City-Specific Informational Context & Judicial Hubs */}
        <Card>
          <SectionTitle>Legal Overview & Court Jurisdiction in {currentCity.cityName}</SectionTitle>
          <Paragraph>{currentCity.cityOverview}</Paragraph>

          <SectionTitle as="h3" style={{ fontSize: "1.05rem", marginTop: "24px", marginBottom: "8px" }}>
            Key Judicial Hubs & Local Courts in {currentCity.cityName}
          </SectionTitle>
          <LocalHubList>
            {currentCity.courts.map((court, idx) => (
              <LocalHubItem key={idx}>
                <span className="icon">🏛️</span>
                <span>{court}</span>
              </LocalHubItem>
            ))}
          </LocalHubList>

          <SectionTitle as="h3" style={{ fontSize: "1.05rem", marginTop: "24px", marginBottom: "8px" }}>
            Prime Neighborhoods & Micro-Localities Served
          </SectionTitle>
          <Paragraph style={{ fontSize: "0.925rem", marginBottom: "4px" }}>
            Our verified advocate network provides counsel and representation across key localities:
          </Paragraph>
          <MicroLocalityGroup>
            {currentCity.microLocalities.map((locality, idx) => (
              <MicroLocalityTag key={idx}>
                📍 {locality}
              </MicroLocalityTag>
            ))}
          </MicroLocalityGroup>
        </Card>

        {/* Available Legal Services in City */}
        <Card>
          <SectionTitle>Available Legal Services in {currentCity.cityName}</SectionTitle>
          <ServiceGrid>
            {currentCity.services.map((service, idx) => (
              <ServiceCard key={idx}>
                <ServiceCardTitle>{service.title}</ServiceCardTitle>
                <ServiceCardDesc>{service.desc}</ServiceCardDesc>
              </ServiceCard>
            ))}
          </ServiceGrid>
        </Card>

        {/* Dynamic Expert Listing Grid */}
        <Card>
          <SectionTitle>{currentCity.expertsSectionTitle}</SectionTitle>
          {currentCity.experts && currentCity.experts.length > 0 ? (
            <ExpertGrid>
              {currentCity.experts.map((exp) => {
                const cleanSlug = exp.slug ? exp.slug.replace(/^advocate-/, "") : "";
                return (
                  <ExpertCard key={exp.profileId}>
                    <div>
                      <ExpertHeader>
                        {exp.profilePhoto ? (
                          <ExpertAvatarImg src={`/uploads/${exp.profilePhoto}`} alt={exp.name} />
                        ) : (
                          <ExpertAvatarInitials>
                            {exp.name ? exp.name.charAt(0) : "A"}
                          </ExpertAvatarInitials>
                        )}
                        <ExpertMeta>
                          <ExpertName>{exp.name}</ExpertName>
                          <ExpertPosition>{exp.jobTitle || "Advocate"}</ExpertPosition>
                        </ExpertMeta>
                      </ExpertHeader>

                      {exp.specialization && (
                        <ExpertSpecialization>{exp.specialization}</ExpertSpecialization>
                      )}

                      <ExpertLocation>
                        📍 {currentCity.cityName}, MP
                      </ExpertLocation>

                      <ExpertBadgeGroup>
                        {exp.education && <ExpertTag>🎓 {exp.education}</ExpertTag>}
                        {exp.experience && <ExpertTag>⭐ {exp.experience} exp</ExpertTag>}
                      </ExpertBadgeGroup>

                      {exp.stateBarCouncilId && (
                        <ExpertBarCouncil>
                          ⚖️ Bar Reg: {exp.stateBarCouncilId}
                        </ExpertBarCouncil>
                      )}
                    </div>

                    <ExpertActionGroup>
                      <ExpertCardCta to={`/experts/profile/${cleanSlug}`}>
                        View Profile →
                      </ExpertCardCta>
                    </ExpertActionGroup>
                  </ExpertCard>
                );
              })}
            </ExpertGrid>
          ) : (
            <EmptyStateContainer>
              <EmptyStateTitle>No Registered Advocates Currently in {currentCity.cityName}</EmptyStateTitle>
              <EmptyStateText>
                We are actively onboarding verified advocates in {currentCity.cityName}. Meanwhile, consult verified legal professionals across Madhya Pradesh on G9Expert.
              </EmptyStateText>
              <CtaButton href="/experts/lawyer-and-legal">
                Explore MP Legal Experts
              </CtaButton>
            </EmptyStateContainer>
          )}
        </Card>

        {/* Informational Call to Action */}
        <CtaBanner>
          <CtaTitle>{currentCity.ctaTitle}</CtaTitle>
          <CtaText>{currentCity.ctaDescription}</CtaText>
          <CtaButton href={currentCity.ctaButtonLink}>
            {currentCity.ctaButtonText}
          </CtaButton>
        </CtaBanner>

        {/* City FAQs */}
        <Card>
          <SectionTitle>Frequently Asked Questions - Legal Services in {currentCity.cityName}</SectionTitle>
          <FaqList>
            {currentCity.faqs.map((faq, idx) => (
              <FaqItem key={idx}>
                <FaqQuestion>{faq.q}</FaqQuestion>
                <FaqAnswer>{faq.a}</FaqAnswer>
              </FaqItem>
            ))}
          </FaqList>
        </Card>

        {/* Related Locations & Jurisdictions */}
        <Card>
          <SectionTitle>Other Judicial Jurisdictions & Legal Services</SectionTitle>
          <LinksGrid>
            {currentCity.relatedLinks.map((link, idx) => (
              <RelatedLink key={idx} href={link.url}>
                {link.title} →
              </RelatedLink>
            ))}
          </LinksGrid>
        </Card>
      </ContentWrapper>
    </Container>
  );
}
