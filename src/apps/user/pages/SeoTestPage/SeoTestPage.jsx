import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSeo } from "../../../../shared/seo/useSeo";
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
  ExpertDesc,
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

const SEO_TEST_PAGES_CONFIG = {
  "/indore/lawyers": {
    canonicalPath: "/indore/lawyers",
    title: "Lawyers in Indore | Find Legal Experts | G9Expert",
    description: "Find top-rated lawyers in Indore for legal consultation, property disputes, civil matters, and corporate legal support on G9Expert.",
    h1: "Lawyers in Indore",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Indore", url: "/indore/lawyers" },
      { name: "Lawyers", url: "/indore/lawyers" }
    ],
    intro: "Find verified legal professionals and experienced advocates in Indore for legal consultation, documentation, dispute resolution, and corporate legal guidance. Indore’s rapid commercial development and expanding residential sectors require prompt and dependable legal advice tailored to local courts and statutory requirements.",
    cityContent: "As the commercial hub of Madhya Pradesh, Indore experiences high demand for legal consultation spanning commercial agreements, real estate title verifications in areas like Vijay Nagar, Palasia, and Super Corridor, as well as litigation before the District Court and the High Court Bench in Indore.",
    services: [
      { title: "Legal Consultation", desc: "Comprehensive guidance on civil, property, personal, and business legal matters." },
      { title: "Civil & Criminal Litigation", desc: "Professional court representation, bail applications, and legal filing services." },
      { title: "Property Disputes & Verification", desc: "Title searches, land revenue matters, and property agreement drafting." },
      { title: "Family Law & Matrimonial Advisory", desc: "Guidance on family settlements, domestic disputes, and mutual agreements." },
      { title: "Consumer Rights & Claims", desc: "Filing consumer court complaints and representing consumer rights." },
      { title: "Corporate & Business Legal Support", desc: "Business registrations, contract drafting, and regulatory compliance." }
    ],
    expertsSectionTitle: "Legal Experts in Indore",
    realExperts: [
      {
        id: 288,
        name: "Chandan Kumar",
        position: "Advocate",
        education: "LLB, BA",
        experience: "16 years",
        specialization: "Property Disputes",
        city: "Indore",
        profileUrl: "/user/experts/chandan-kumar"
      },
      {
        id: 209,
        name: "Sonu Verma",
        position: "Advocate",
        education: "BA, LLB",
        specialization: "Divorce Consultation",
        city: "Indore",
        profileUrl: "/user/experts/sonu-verma"
      },
      {
        id: 218,
        name: "Mohit Upadhyay",
        position: "Advocate",
        education: "BA, LLB",
        experience: "5 years",
        specialization: "Divorce Consultation",
        city: "Indore",
        profileUrl: "/user/experts/mohit-upadhyay"
      },
      {
        id: 254,
        name: "Anil Vyas",
        position: "Advocate",
        education: "LLB",
        experience: "4 years",
        specialization: "Property Disputes",
        city: "Indore",
        profileUrl: "/user/experts/anil-vyas"
      },
      {
        id: 214,
        name: "Archana Kushwah",
        position: "Lawyer",
        education: "BBA, LLB",
        experience: "2.5 years",
        specialization: "Criminal Law",
        city: "Indore",
        profileUrl: "/user/experts/archana-kushwah"
      },
      {
        id: 217,
        name: "Alok Saxena",
        position: "Advocate",
        education: "BA, LLB",
        experience: "5 years",
        specialization: "Consumer Complaints",
        city: "Indore",
        profileUrl: "/user/experts/alok-saxena"
      }
    ],
    ctaTitle: "Looking for a Lawyer in Indore?",
    ctaDescription: "G9Expert helps users discover and connect with verified legal professionals for consultation and guidance.",
    ctaButtonText: "Explore All Experts",
    ctaButtonLink: "/experts/lawyer-and-legal/indore",
    faqs: [
      {
        q: "How can I find a lawyer in Indore?",
        a: "You can browse verified legal professionals on G9Expert to connect with experienced legal consultants in Indore based on your specific legal requirements."
      },
      {
        q: "What types of legal services are most requested in Indore?",
        a: "Property dispute resolution, real estate title verification, corporate contract drafting, family settlements, and civil court representation are widely requested."
      },
      {
        q: "Can I consult a lawyer in Indore online?",
        a: "Yes, G9Expert enables remote legal consultation via chat, phone, and video calls for initial advice and document review."
      },
      {
        q: "What documents should I bring for a legal consultation?",
        a: "Bring all relevant notices, agreements, ownership documents, identity proofs, and a detailed summary of events related to your case."
      },
      {
        q: "How are legal fees structured for lawyer consultation in Indore?",
        a: "Legal fees vary based on the complexity of the matter, type of consultation (online vs court representation), and the experience level of the advocate."
      }
    ],
    relatedLinks: [
      { title: "Divorce Lawyers in Indore", url: "/indore/divorce-lawyers" },
      { title: "Lawyers in Bhopal", url: "/bhopal/lawyers" },
      { title: "Lawyers in Jabalpur", url: "/jabalpur/lawyers" },
      { title: "Lawyers in Gwalior", url: "/gwalior/lawyers" },
      { title: "Lawyer & Legal Experts in Indore", url: "/experts/lawyer-and-legal/indore" }
    ]
  },

  "/bhopal/lawyers": {
    canonicalPath: "/bhopal/lawyers",
    title: "Lawyers in Bhopal | Find Legal Experts | G9Expert",
    description: "Connect with trusted lawyers in Bhopal for expert legal consultation, revenue court matters, property verification, and civil advocacy on G9Expert.",
    h1: "Lawyers in Bhopal",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Bhopal", url: "/bhopal/lawyers" },
      { name: "Lawyers", url: "/bhopal/lawyers" }
    ],
    intro: "Access professional legal services in Bhopal for court representation, documentation, real estate verifications, and general legal advice. As Madhya Pradesh’s administrative capital, Bhopal handles significant government, administrative, civil, and commercial legal matters across various courts and tribunals.",
    cityContent: "Legal advisory in Bhopal frequently covers state tribunal representation, revenue court litigation, land registry verifications in MP Nagar, Arera Colony, and Kolar, as well as writ petitions before the High Court Bench and District Courts.",
    services: [
      { title: "Administrative & Revenue Court Litigation", desc: "Representation in land revenue, government notices, and state tribunal matters." },
      { title: "Property Title & Registry Search", desc: "Title clearance, registry verifications, and property dispute management." },
      { title: "Civil & Commercial Dispute Resolution", desc: "Contract enforcement, recovery suits, and arbitration support." },
      { title: "Matrimonial & Domestic Matters", desc: "Divorce consultation, maintenance claims, and family dispute resolution." },
      { title: "Criminal Defense & Bail Matters", desc: "Representation before magistrate and sessions courts in criminal cases." },
      { title: "Documentation & Affidavits", desc: "Legal notices, power of attorney, lease deeds, and contract drafting." }
    ],
    expertsSectionTitle: "Legal Experts in Bhopal",
    realExperts: [
      {
        id: 229,
        name: "Debasis Mitra",
        position: "Advocates & Legal Consultants",
        education: "BA, LLB",
        experience: "15+ years",
        specialization: "Criminal Law & Dispute Resolution",
        city: "Bhopal",
        profilePhoto: "1784281359397-qvb2lo.webp",
        profileUrl: "/user/experts/debasis-mitra"
      },
      {
        id: 230,
        name: "Adv K. Prasoon Ranjan",
        position: "Advocates & Legal Consultants",
        education: "B.A. LL.B.",
        experience: "15+ years",
        specialization: "Criminal & Matrimonial Law",
        city: "Bhopal",
        profilePhoto: "1784280713172-450hvo.webp",
        profileUrl: "/user/experts/adv-k-prasoon-ranjan"
      },
      {
        id: 206,
        name: "Satyendra Singh Batham",
        position: "Advocates & Legal Consultants",
        specialization: "Divorce Consultation",
        city: "Bhopal",
        profileUrl: "/user/experts/satyendra-singh-batham"
      }
    ],
    ctaTitle: "Need Legal Advice in Bhopal?",
    ctaDescription: "Connect with verified Advocates and Legal Consultants in Bhopal for personalized guidance.",
    ctaButtonText: "Explore All Experts",
    ctaButtonLink: "/experts/lawyer-and-legal/bhopal",
    faqs: [
      {
        q: "How can I hire a lawyer in Bhopal?",
        a: "Browse verified legal consultants on G9Expert, compare specializations, and schedule a private consultation online or in person."
      },
      {
        q: "What legal areas are prominent in Bhopal?",
        a: "Land revenue disputes, administrative tribunal matters, civil property suits, and family legal advice are key service areas."
      },
      {
        q: "Can I get assistance with property verification in Bhopal?",
        a: "Yes, experienced property advocates provide title search, registry check, and documentation services across Bhopal."
      },
      {
        q: "Are online legal consultations legally valid?",
        a: "Yes, initial consultations, legal document reviews, and legal advice provided online are valid and help prepare formal court filings."
      },
      {
        q: "What should I check before engaging an advocate in Bhopal?",
        a: "Verify bar council affiliation, relevant case handling experience in local courts, and fee clarity before proceeding."
      }
    ],
    relatedLinks: [
      { title: "Lawyers in Indore", url: "/indore/lawyers" },
      { title: "Divorce Lawyers in Indore", url: "/indore/divorce-lawyers" },
      { title: "Lawyers in Jabalpur", url: "/jabalpur/lawyers" },
      { title: "Lawyers in Gwalior", url: "/gwalior/lawyers" },
      { title: "Lawyer & Legal Experts in Bhopal", url: "/experts/lawyer-and-legal/bhopal" }
    ]
  },

  "/jabalpur/lawyers": {
    canonicalPath: "/jabalpur/lawyers",
    title: "Lawyers in Jabalpur | Find Legal Experts | G9Expert",
    description: "Find qualified lawyers in Jabalpur for High Court writ petitions, civil litigation, property disputes, and criminal defense on G9Expert.",
    h1: "Lawyers in Jabalpur",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Jabalpur", url: "/jabalpur/lawyers" },
      { name: "Lawyers", url: "/jabalpur/lawyers" }
    ],
    intro: "Connect with seasoned advocates in Jabalpur for High Court litigation, district court representation, and specialised legal guidance. As the seat of the High Court of Madhya Pradesh, Jabalpur is a central judicial hub for complex constitutional, civil, and criminal matters.",
    cityContent: "Litigation in Jabalpur encompasses High Court writ petitions, service matters, criminal appeals, and land disputes across Wright Town, Civil Lines, and Napier Town.",
    services: [
      { title: "MP High Court Litigation", desc: "Writ petitions, constitutional matters, and appeals before the Principal Seat." },
      { title: "Civil Litigation & Recovery Suits", desc: "Injunctions, title disputes, and civil court representation." },
      { title: "Criminal Defense & Appeals", desc: "Bail matters, trial court defense, and High Court criminal appeals." },
      { title: "Service & Employment Law", desc: "Government service disputes, departmental inquiries, and pension claims." },
      { title: "Property & Land Verification", desc: "Revenue court filings, land title searches, and property deed drafting." },
      { title: "Legal Documentation", desc: "Notary, legal notices, agreement reviews, and affidavit preparation." }
    ],
    expertsSectionTitle: "Legal Experts in Jabalpur",
    realExperts: [],
    emptyStateTitle: "No Registered Experts Currently Found in Jabalpur",
    emptyStateMessage: "We are currently onboarding verified advocates in Jabalpur. Meanwhile, you can consult qualified legal experts across Madhya Pradesh available on G9Expert.",
    emptyStateCtaText: "Explore Legal Experts in MP",
    emptyStateCtaLink: "/experts/lawyer-and-legal",
    ctaTitle: "Need High Court Representation in Jabalpur?",
    ctaDescription: "Find verified advocates and legal consultants for High Court and District Court matters on G9Expert.",
    ctaButtonText: "Explore All Experts",
    ctaButtonLink: "/experts/lawyer-and-legal",
    faqs: [
      {
        q: "Why is Jabalpur significant for legal matters in MP?",
        a: "Jabalpur houses the Principal Seat of the High Court of Madhya Pradesh, making it the primary hub for High Court appeals and writ litigation."
      },
      {
        q: "How can I file a writ petition in the MP High Court at Jabalpur?",
        a: "Consult an advocate experienced in High Court practice who can draft and file the petition with the required documentation."
      },
      {
        q: "Can I consult a High Court advocate online?",
        a: "Yes, G9Expert facilitates remote document review and initial strategy discussion with experienced legal professionals."
      },
      {
        q: "What services do property lawyers in Jabalpur provide?",
        a: "They assist with title verification, registry checks, land revenue litigation, and property partition suits."
      },
      {
        q: "What is the fee structure for High Court advocates in Jabalpur?",
        a: "Fees depend on case type, stage of litigation, filing complexity, and counsel experience."
      }
    ],
    relatedLinks: [
      { title: "Lawyers in Indore", url: "/indore/lawyers" },
      { title: "Lawyers in Bhopal", url: "/bhopal/lawyers" },
      { title: "Lawyers in Gwalior", url: "/gwalior/lawyers" },
      { title: "Divorce Lawyers in Indore", url: "/indore/divorce-lawyers" },
      { title: "Lawyer & Legal Experts", url: "/experts/lawyer-and-legal" }
    ]
  },

  "/gwalior/lawyers": {
    canonicalPath: "/gwalior/lawyers",
    title: "Lawyers in Gwalior | Find Legal Experts | G9Expert",
    description: "Consult experienced lawyers in Gwalior for High Court Bench litigation, civil disputes, criminal defense, and property advisory on G9Expert.",
    h1: "Lawyers in Gwalior",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Gwalior", url: "/gwalior/lawyers" },
      { name: "Lawyers", url: "/gwalior/lawyers" }
    ],
    intro: "Find dependable legal consultants and advocates in Gwalior for court representation, legal agreements, dispute resolution, and regulatory guidance. Gwalior hosts a Bench of the High Court of Madhya Pradesh, serving Northern MP for key judicial matters.",
    cityContent: "Legal advisory in Gwalior covers High Court Bench filings, District Court litigation, property partition disputes in City Centre, Lashkar, and Morar, as well as commercial agreement drafting.",
    services: [
      { title: "High Court Bench Litigation", desc: "Representation in High Court Bench Gwalior for writs and appeals." },
      { title: "Civil Litigation & Dispute Resolution", desc: "Property disputes, injunctions, and civil court advocacy." },
      { title: "Criminal Law & Bail Applications", desc: "Trial defense, bail filings, and criminal appeal proceedings." },
      { title: "Property & Real Estate Advisory", desc: "Title search, land revenue matters, and sale deed drafting." },
      { title: "Family & Matrimonial Guidance", desc: "Mutual consent agreements, family legal support, and advice." },
      { title: "Commercial Contracts & Compliance", desc: "Business contract drafting, partnership deeds, and legal notices." }
    ],
    expertsSectionTitle: "Legal Experts in Gwalior",
    realExperts: [
      {
        id: 202,
        name: "Anurudh Singh Kaurav",
        position: "Advocates & Legal Consultants",
        specialization: "Criminal Law & Court Practice",
        city: "Gwalior",
        profileUrl: "/user/experts/anurudh-singh-kaurav"
      }
    ],
    ctaTitle: "Looking for Legal Counsel in Gwalior?",
    ctaDescription: "G9Expert connects you with experienced legal professionals for High Court Bench and District Court matters.",
    ctaButtonText: "Explore All Experts",
    ctaButtonLink: "/experts/lawyer-and-legal/gwalior",
    faqs: [
      {
        q: "How do I choose the right lawyer in Gwalior?",
        a: "Evaluate the advocate's practice history, court experience (High Court Bench vs District Court), and area of legal specialization."
      },
      {
        q: "What legal matters are handled by the Gwalior High Court Bench?",
        a: "The Gwalior Bench handles writ petitions, criminal appeals, civil revisions, and service matters for Northern MP districts."
      },
      {
        q: "Can I get legal documentation drafted online in Gwalior?",
        a: "Yes, advocates on G9Expert assist with drafting legal notices, lease deeds, and contracts remotely."
      },
      {
        q: "What is required for a property title check in Gwalior?",
        a: "Provide past sale deeds, khasra/khatauni records, tax receipts, and encumbrance certificate requests."
      },
      {
        q: "How can I consult a lawyer in Gwalior through G9Expert?",
        a: "Select a profile, choose your preferred consultation mode (chat, phone, or video), and schedule your session."
      }
    ],
    relatedLinks: [
      { title: "Lawyers in Indore", url: "/indore/lawyers" },
      { title: "Lawyers in Bhopal", url: "/bhopal/lawyers" },
      { title: "Lawyers in Jabalpur", url: "/jabalpur/lawyers" },
      { title: "Divorce Lawyers in Indore", url: "/indore/divorce-lawyers" },
      { title: "Lawyer & Legal Experts in Gwalior", url: "/experts/lawyer-and-legal/gwalior" }
    ]
  },

  "/indore/divorce-lawyers": {
    canonicalPath: "/indore/divorce-lawyers",
    title: "Divorce Lawyers in Indore | Family Law Experts | G9Expert",
    description: "Consult top divorce and family law advocates in Indore for mutual consent divorce, custody disputes, maintenance, and family settlements on G9Expert.",
    h1: "Divorce Lawyers in Indore",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Indore", url: "/indore/lawyers" },
      { name: "Divorce Lawyers", url: "/indore/divorce-lawyers" }
    ],
    intro: "Connect with empathetic and experienced family law advocates in Indore for confidential legal guidance on matrimonial disputes, mutual consent divorce, child custody, alimony, and domestic settlements. Navigating family law matters requires balanced legal insight and strict privacy.",
    cityContent: "Family court proceedings in Indore take place at the District Family Court. Legal support includes pre-litigation counseling, mutual consent petitions under the Hindu Marriage Act / Special Marriage Act, contested divorce filings, and interim maintenance applications.",
    services: [
      { title: "Mutual Consent Divorce", desc: "Fast-track joint petition drafting, agreement finalizing, and court representation." },
      { title: "Contested Divorce Proceedings", desc: "Legal representation on grounds of cruelty, desertion, or breakdown of marriage." },
      { title: "Child Custody & Guardianship", desc: "Child custody agreements, visitation rights petitions, and guardianship claims." },
      { title: "Alimony & Maintenance Claims", desc: "Filing and defending interim maintenance and permanent alimony applications." },
      { title: "Family Mediation & Counseling", desc: "Out-of-court settlement negotiation, reconciliation counseling, and deed execution." },
      { title: "Domestic Violence & Protection Orders", desc: "Filing and defending applications under the Domestic Violence Act." }
    ],
    expertsSectionTitle: "Divorce & Family Law Experts in Indore",
    realExperts: [
      {
        id: 209,
        name: "Sonu Verma",
        position: "Advocate",
        education: "BA, LLB",
        specialization: "Divorce & Matrimonial Consultation",
        city: "Indore",
        profileUrl: "/user/experts/sonu-verma"
      },
      {
        id: 218,
        name: "Mohit Upadhyay",
        position: "Advocate",
        education: "BA, LLB",
        experience: "5 years",
        specialization: "Divorce & Family Law",
        city: "Indore",
        profileUrl: "/user/experts/mohit-upadhyay"
      }
    ],
    ctaTitle: "Need Confidential Family Legal Consultation in Indore?",
    ctaDescription: "Get clear advice from experienced family law advocates on G9Expert.",
    ctaButtonText: "Explore All Experts",
    ctaButtonLink: "/experts/lawyer-and-legal/indore",
    faqs: [
      {
        q: "What is the procedure for mutual consent divorce in Indore?",
        a: "Both spouses file a joint petition in the Family Court, complete First Motion recording, observe the cooling-off period (if applicable), and record Second Motion for final decree."
      },
      {
        q: "How long does mutual consent divorce take in Indore?",
        a: "Mutual consent divorce typically takes 6 months, though courts may waive the 6-month waiting period under specific circumstances."
      },
      {
        q: "Can I consult a divorce advocate in Indore confidentially?",
        a: "Yes, all consultations on G9Expert are strictly private and protected by legal attorney-client confidentiality standards."
      },
      {
        q: "How are child custody decisions made by the Family Court in Indore?",
        a: "The court prioritizes the best interests and welfare of the child, considering age, emotional stability, financial capability, and parental bond."
      },
      {
        q: "What documents are required to file for divorce in Indore?",
        a: "Marriage certificate, joint photograph, address proofs, income documentation, and evidence supporting grounds for petition."
      }
    ],
    relatedLinks: [
      { title: "Lawyers in Indore", url: "/indore/lawyers" },
      { title: "Lawyers in Bhopal", url: "/bhopal/lawyers" },
      { title: "Lawyers in Jabalpur", url: "/jabalpur/lawyers" },
      { title: "Lawyers in Gwalior", url: "/gwalior/lawyers" },
      { title: "Lawyer & Legal Experts in Indore", url: "/experts/lawyer-and-legal/indore" }
    ]
  }
};

export default function SeoTestPage() {
  const location = useLocation();
  const path = location.pathname.toLowerCase().replace(/\/$/, "");

  const config = SEO_TEST_PAGES_CONFIG[path] || SEO_TEST_PAGES_CONFIG["/indore/lawyers"];

  useSeo({
    title: config.title,
    description: config.description,
    canonicalPath: config.canonicalPath,
    robots: "index, follow",
    breadcrumbs: config.breadcrumbs
  });

  return (
    <Container>
      {/* Hero Section */}
      <HeroSection>
        <HeroWrapper>
          <BreadcrumbNav aria-label="Breadcrumb">
            {config.breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="separator">/</span>}
                {idx === config.breadcrumbs.length - 1 ? (
                  <span className="current">{b.name}</span>
                ) : (
                  <Link to={b.url}>{b.name}</Link>
                )}
              </React.Fragment>
            ))}
          </BreadcrumbNav>

          <MainTitle>{config.h1}</MainTitle>
          <IntroText>{config.intro}</IntroText>
        </HeroWrapper>
      </HeroSection>

      <ContentWrapper>
        {/* City-Specific Informational Content */}
        <Card>
          <SectionTitle>Legal Overview & Context</SectionTitle>
          <Paragraph>{config.cityContent}</Paragraph>
        </Card>

        {/* Services Provided */}
        <Card>
          <SectionTitle>Available Legal Services</SectionTitle>
          <ServiceGrid>
            {config.services.map((s, idx) => (
              <ServiceCard key={idx}>
                <ServiceCardTitle>{s.title}</ServiceCardTitle>
                <ServiceCardDesc>{s.desc}</ServiceCardDesc>
              </ServiceCard>
            ))}
          </ServiceGrid>
        </Card>

        {/* Real Experts Section */}
        <Card>
          <SectionTitle>{config.expertsSectionTitle}</SectionTitle>
          {config.realExperts && config.realExperts.length > 0 ? (
            <ExpertGrid>
              {config.realExperts.map((exp) => (
                <ExpertCard key={exp.id}>
                  <div>
                    <ExpertHeader>
                      {exp.profilePhoto ? (
                        <ExpertAvatarImg src={`/uploads/${exp.profilePhoto}`} alt={exp.name} />
                      ) : (
                        <ExpertAvatarInitials>
                          {exp.name ? exp.name.charAt(0) : "E"}
                        </ExpertAvatarInitials>
                      )}
                      <ExpertMeta>
                        <ExpertName>{exp.name}</ExpertName>
                        <ExpertPosition>{exp.position || "Legal Consultant"}</ExpertPosition>
                      </ExpertMeta>
                    </ExpertHeader>

                    {exp.specialization && (
                      <ExpertSpecialization>{exp.specialization}</ExpertSpecialization>
                    )}

                    <ExpertLocation>
                      📍 {exp.city || "Madhya Pradesh"}, MP
                    </ExpertLocation>

                    <ExpertBadgeGroup>
                      {exp.education && <ExpertTag>🎓 {exp.education}</ExpertTag>}
                      {exp.experience && <ExpertTag>⭐ {exp.experience} exp</ExpertTag>}
                    </ExpertBadgeGroup>
                  </div>

                  <div>
                    <ExpertCardCta to={exp.profileUrl}>
                      View Profile →
                    </ExpertCardCta>
                  </div>
                </ExpertCard>
              ))}
            </ExpertGrid>
          ) : (
            <EmptyStateContainer>
              <EmptyStateTitle>{config.emptyStateTitle}</EmptyStateTitle>
              <EmptyStateText>{config.emptyStateMessage}</EmptyStateText>
              <CtaButton href={config.emptyStateCtaLink}>
                {config.emptyStateCtaText}
              </CtaButton>
            </EmptyStateContainer>
          )}
        </Card>

        {/* Informational CTA */}
        <CtaBanner>
          <CtaTitle>{config.ctaTitle}</CtaTitle>
          <CtaText>{config.ctaDescription}</CtaText>
          <CtaButton href={config.ctaButtonLink}>
            {config.ctaButtonText}
          </CtaButton>
        </CtaBanner>

        {/* FAQs */}
        <Card>
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          <FaqList>
            {config.faqs.map((f, idx) => (
              <FaqItem key={idx}>
                <FaqQuestion>{f.q}</FaqQuestion>
                <FaqAnswer>{f.a}</FaqAnswer>
              </FaqItem>
            ))}
          </FaqList>
        </Card>

        {/* Related Pages */}
        <Card>
          <SectionTitle>Related Locations & Services</SectionTitle>
          <LinksGrid>
            {config.relatedLinks.map((l, idx) => (
              <RelatedLink key={idx} href={l.url}>
                {l.title} →
              </RelatedLink>
            ))}
          </LinksGrid>
        </Card>
      </ContentWrapper>
    </Container>
  );
}
