import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SEOHead from "../../../../shared/components/SEO/SEOHead";

const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const money = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const getServiceFromSearch = (data) =>
  data?.data?.services?.[0] || data?.data?.data?.[0] || data?.services?.[0] || null;

export default function MasterServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [activations, setActivations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const load = async () => {
      const detailRes = await fetch(`/api/master-services/public/${encodeURIComponent(slug)}`, {
        signal: controller.signal,
      });
      let detailData = await detailRes.json();
      let svc = detailData?.success ? detailData.data : null;

      if (!svc) {
        const searchRes = await fetch(`/api/master-services/search?slug=${encodeURIComponent(slug)}`, {
          signal: controller.signal,
        });
        const searchData = await searchRes.json();
        svc = searchData?.success ? getServiceFromSearch(searchData) : null;
      }

      if (!svc) throw new Error("Service template not found.");

      setService(svc);

      const expertRes = await fetch(`/api/expert-activations/master-service/${svc.id}/experts`, {
        signal: controller.signal,
      });
      const expertData = await expertRes.json();
      setActivations(expertData?.success ? expertData.data || [] : []);
    };

    load()
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message || "Unable to load service.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [slug]);

  const documents = useMemo(() => service?.document_specs || service?.documents || [], [service]);
  const workflow = useMemo(() => service?.workflow_steps || [], [service]);
  const benefits = asArray(service?.benefits_json || service?.benefits);
  const faq = asArray(service?.faq_json || service?.faq);
  const gallery = asArray(service?.gallery_json || service?.gallery);

  const bookPath = (activationId) =>
    `/user/booking/${service.slug}${activationId ? `?expertActivationId=${activationId}` : ""}`;

  if (loading) {
    return <div style={{ padding: "4rem", textAlign: "center" }}>Loading service details...</div>;
  }

  if (error || !service) {
    return (
      <div style={{ padding: "4rem", color: "#dc2626", textAlign: "center" }}>
        {error || "Service unavailable."}
      </div>
    );
  }

  const schemaJson = {
    "@context": "https://schema.org/",
    "@type": "Service",
    name: service.title,
    description: service.short_description,
    provider: { "@type": "Organization", name: "G9Expert" },
    offers: { "@type": "Offer", priceCurrency: "INR", price: service.base_price },
  };

  return (
    <div style={{ background: "#f6f7fb", minHeight: "100vh", paddingBottom: "5rem" }}>
      <SEOHead
        title={`${service.title} | G9Expert Marketplace`}
        description={service.short_description}
        canonicalUrl={`https://g9expert.com/service/${service.slug}`}
        schemaJson={schemaJson}
      />

      <section
        style={{
          background: service.banner_url
            ? `linear-gradient(90deg, rgba(10,22,45,0.84), rgba(10,22,45,0.48)), url(${service.banner_url}) center/cover`
            : "#101828",
          color: "#fff",
          padding: "3rem 1.25rem",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 12 }}>
            <Link to="/user" style={{ color: "#fff", textDecoration: "none" }}>Home</Link>
            {" / "}
            <Link to="/user/categories" style={{ color: "#fff", textDecoration: "none" }}>
              {service.category_name || "Categories"}
            </Link>
            {service.subcategory_name ? ` / ${service.subcategory_name}` : ""}
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", margin: "0 0 0.75rem", maxWidth: 760 }}>
            {service.title}
          </h1>
          {service.short_description ? (
            <div
              className="master-service-rich-description"
              dangerouslySetInnerHTML={{ __html: service.short_description }}
              style={{ fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 760, margin: 0 }}
            />
          ) : (
            <p style={{ fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 760, margin: 0 }}>
              Compare verified experts, submit requirements, and manage delivery in one workspace.
            </p>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
            <strong style={{ background: "rgba(255,255,255,0.16)", padding: "10px 14px", borderRadius: 8 }}>
              Starting from {money(service.base_price)}
            </strong>
            <button
              type="button"
              onClick={() => document.getElementById("available-experts")?.scrollIntoView({ behavior: "smooth" })}
              style={{ padding: "10px 16px", borderRadius: 8, border: 0, fontWeight: 800, cursor: "pointer" }}
            >
              Choose Expert
            </button>
          </div>
        </div>
      </section>

      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "2rem 1.25rem", display: "grid", gap: 24 }}>
        <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 24 }}>
          <div style={{ display: "grid", gap: 16 }}>
            <InfoBlock title="Overview">
              <p>{service.full_description || service.short_description || "Service details are being updated."}</p>
            </InfoBlock>

            {benefits.length > 0 && (
              <InfoBlock title="Benefits">
                <ul>{benefits.map((item, index) => <li key={index}>{item.label || item.title || item}</li>)}</ul>
              </InfoBlock>
            )}

            <InfoBlock title="Process & Timeline">
              {workflow.length > 0 ? (
                <div style={{ display: "grid", gap: 10 }}>
                  {workflow.map((step, index) => (
                    <div key={step.id || step.step_key || index} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ width: 30, height: 30, borderRadius: 15, background: "#2563eb", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800 }}>
                        {index + 1}
                      </span>
                      <strong>{step.step_label || step.step_key}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Submitted, documents reviewed, work in progress, delivery, completion.</p>
              )}
            </InfoBlock>

            <InfoBlock title="Required Documents">
              {documents.length > 0 ? (
                <ul>
                  {documents.map((doc) => (
                    <li key={doc.id || doc.doc_type_key}>
                      {doc.label} {doc.is_mandatory ? "(mandatory)" : "(optional)"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No documents are required before booking. The expert may request documents in the workspace.</p>
              )}
            </InfoBlock>

            {gallery.length > 0 && (
              <InfoBlock title="Gallery">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
                  {gallery.map((src, index) => <img key={index} src={src} alt={`${service.title} gallery ${index + 1}`} style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: 8 }} />)}
                </div>
              </InfoBlock>
            )}

            {faq.length > 0 && (
              <InfoBlock title="FAQ">
                {faq.map((item, index) => (
                  <details key={index} style={{ borderTop: "1px solid #e5e7eb", padding: "12px 0" }}>
                    <summary style={{ fontWeight: 800 }}>{item.question || item.title}</summary>
                    <p>{item.answer || item.description}</p>
                  </details>
                ))}
              </InfoBlock>
            )}
          </div>

          <aside style={{ alignSelf: "start", position: "sticky", top: 20, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 18 }}>
            <div style={{ color: "#667085", fontSize: 14 }}>Service price starts at</div>
            <div style={{ color: "#027a48", fontSize: 28, fontWeight: 900 }}>{money(service.base_price)}</div>
            <p style={{ color: "#667085", lineHeight: 1.55 }}>Final pricing depends on the expert selected in the booking review.</p>
            <button
              type="button"
              onClick={() => document.getElementById("available-experts")?.scrollIntoView({ behavior: "smooth" })}
              style={{ width: "100%", padding: 12, borderRadius: 8, border: 0, background: "#2563eb", color: "#fff", fontWeight: 900, cursor: "pointer" }}
            >
              View Available Experts
            </button>
          </aside>
        </section>

        <section id="available-experts" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 20 }}>
          <h2 style={{ margin: "0 0 4px" }}>Available Experts</h2>
          <p style={{ color: "#667085", marginTop: 0 }}>Only experts who activated this admin service are shown here.</p>

          {activations.length === 0 ? (
            <div style={{ padding: 20, background: "#f9fafb", borderRadius: 8, color: "#667085" }}>
              No expert has activated this service yet.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              {activations.map((expert) => {
                const price = expert.offer_price || expert.custom_price || service.base_price;
                return (
                  <article key={expert.id} style={{ display: "grid", gridTemplateColumns: "72px minmax(0, 1fr) auto", gap: 16, alignItems: "center", padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }}>
                    <img
                      src={expert.profile_photo || "https://placehold.co/96x96/eef2ff/1d4ed8?text=G9"}
                      alt={expert.expert_name || "Expert"}
                      style={{ width: 72, height: 72, objectFit: "cover", borderRadius: "50%" }}
                    />
                    <div>
                      <h3 style={{ margin: 0 }}>{expert.expert_name || "Verified Expert"} {expert.verified_badge ? "Verified" : ""}</h3>
                      <div style={{ color: "#667085", marginTop: 4 }}>
                        Rating {Number(expert.avg_rating || 0).toFixed(1)} | {expert.total_experience || 0}+ yrs | {expert.completed_orders || 0} orders
                      </div>
                      <div style={{ color: "#667085", marginTop: 4 }}>
                        {expert.languages || "English, Hindi"} | Delivery in {expert.delivery_time_days || 1} day(s) | {expert.online_status ? "Online" : "Available"}
                      </div>
                      {expert.custom_bio && <p style={{ margin: "8px 0 0", color: "#344054" }}>{expert.custom_bio}</p>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {expert.offer_price && <div style={{ color: "#98a2b3", textDecoration: "line-through" }}>{money(expert.custom_price)}</div>}
                      <div style={{ fontSize: 22, fontWeight: 900, color: "#027a48" }}>{money(price)}</div>
                      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                        <button type="button" onClick={() => navigate(`/user/experts/${expert.expert_slug || expert.expert_id}`)} style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #d0d5dd", background: "#fff", cursor: "pointer" }}>
                          View Profile
                        </button>
                        <button type="button" onClick={() => navigate(bookPath(expert.id))} style={{ padding: "9px 12px", borderRadius: 8, border: 0, background: "#16a34a", color: "#fff", fontWeight: 800, cursor: "pointer" }}>
                          Book
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function InfoBlock({ title, children }) {
  return (
    <section style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 20, lineHeight: 1.7 }}>
      <h2 style={{ margin: "0 0 10px", fontSize: 22 }}>{title}</h2>
      {children}
    </section>
  );
}
