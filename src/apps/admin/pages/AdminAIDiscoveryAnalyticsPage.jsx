import React, { useState, useEffect, useCallback } from "react";
import {
  FiBarChart2,
  FiRefreshCw,
  FiAlertTriangle,
  FiLayers,
  FiCheckCircle,
  FiHelpCircle,
  FiActivity,
  FiUsers,
  FiMousePointer,
  FiZap,
  FiCalendar,
  FiLock
} from "react-icons/fi";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import {
  getAIAnalyticsOverview,
  getAIAnalyticsTimeseries,
  getAIAnalyticsRankPerformance,
  getAIAnalyticsExperiments,
  getAIAnalyticsConversionFunnel
} from "../../../shared/api/admin/aiAnalytics.api";
import "./AdminAIDiscoveryAnalyticsPage.css";

export default function AdminAIDiscoveryAnalyticsPage() {
  // Date State
  const [datePreset, setDatePreset] = useState("7d"); // "today" | "7d" | "30d" | "90d" | "custom"
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [granularity, setGranularity] = useState("day"); // "day" | "hour"

  // Data States
  const [overview, setOverview] = useState(null);
  const [timeseries, setTimeseries] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [funnel, setFunnel] = useState([]);

  // UI States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Compute calculated date range strings (YYYY-MM-DD)
  const getQueryParams = useCallback(() => {
    const today = new Date();
    const toStr = today.toISOString().split("T")[0];

    if (datePreset === "today") {
      return { from: toStr, to: toStr };
    }

    if (datePreset === "7d") {
      const fromDate = new Date(today);
      fromDate.setDate(today.getDate() - 7);
      return { from: fromDate.toISOString().split("T")[0], to: toStr };
    }

    if (datePreset === "30d") {
      const fromDate = new Date(today);
      fromDate.setDate(today.getDate() - 30);
      return { from: fromDate.toISOString().split("T")[0], to: toStr };
    }

    if (datePreset === "90d") {
      const fromDate = new Date(today);
      fromDate.setDate(today.getDate() - 90);
      return { from: fromDate.toISOString().split("T")[0], to: toStr };
    }

    if (datePreset === "custom" && customFrom && customTo) {
      return { from: customFrom, to: customTo };
    }

    // Default fallback 7 days
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - 7);
    return { from: fromDate.toISOString().split("T")[0], to: toStr };
  }, [datePreset, customFrom, customTo]);

  // Fetch all analytics APIs in parallel
  const fetchAnalyticsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPermissionDenied(false);

    try {
      const params = getQueryParams();

      // Check diffDays for granularity safety
      const fromDate = new Date(params.from);
      const toDate = new Date(params.to);
      const diffDays = Math.ceil(Math.abs(toDate - fromDate) / (1000 * 60 * 60 * 24));
      
      let effectiveGranularity = granularity;
      if (diffDays > 3 && granularity === "hour") {
        effectiveGranularity = "day";
        setGranularity("day");
      }

      const timeseriesParams = { ...params, granularity: effectiveGranularity };

      const [ovRes, tsRes, rkRes, expRes, fnRes] = await Promise.all([
        getAIAnalyticsOverview(params),
        getAIAnalyticsTimeseries(timeseriesParams),
        getAIAnalyticsRankPerformance(params),
        getAIAnalyticsExperiments(params),
        getAIAnalyticsConversionFunnel(params)
      ]);

      const extractArray = (res, key) => {
        if (!res) return [];
        if (Array.isArray(res)) return res;
        if (Array.isArray(res.data)) return res.data;
        if (res.data && Array.isArray(res.data[key])) return res.data[key];
        if (Array.isArray(res[key])) return res[key];
        return [];
      };

      if (ovRes?.success) setOverview(ovRes.data || null);
      if (tsRes?.success) setTimeseries(extractArray(tsRes, "timeseries"));
      if (rkRes?.success) setRanks(extractArray(rkRes, "ranks"));
      if (expRes?.success) setExperiments(extractArray(expRes, "experiments"));
      if (fnRes?.success) setFunnel(extractArray(fnRes, "funnel"));
    } catch (err) {
      console.error("[AI_ANALYTICS_DASHBOARD][FETCH_ERROR]", err);
      if (typeof err === "string" && (err.includes("Access denied") || err.includes("403"))) {
        setPermissionDenied(true);
      } else {
        setError(err?.message || "Failed to load AI discovery analytics data.");
      }
    } finally {
      setLoading(false);
    }
  }, [getQueryParams, granularity]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Permission Denied View (403)
  if (permissionDenied) {
    return (
      <div className="ai-analytics-container">
        <div className="state-banner error">
          <FiLock size={40} style={{ color: "#991b1b", marginBottom: "0.5rem" }} />
          <h3>Access Restricted</h3>
          <p>You don't have permission to view AI analytics.</p>
        </div>
      </div>
    );
  }

  const queryRange = getQueryParams();
  const fromDateObj = new Date(queryRange.from);
  const toDateObj = new Date(queryRange.to);
  const selectedDiffDays = Math.ceil(Math.abs(toDateObj - fromDateObj) / (1000 * 60 * 60 * 24));
  const isHourlyDisabled = selectedDiffDays > 3;

  return (
    <div className="ai-analytics-container">
      {/* Header & Date Controls */}
      <header className="ai-analytics-header">
        <div className="ai-analytics-title-area">
          <h2>
            <FiActivity style={{ color: "#2563eb" }} /> AI Discovery Analytics
          </h2>
          <p>
            Monitor AI search volume, recommendation engagement, A/B experiments, and downstream booking conversions.
          </p>
        </div>

        <div className="ai-analytics-controls">
          <div className="date-preset-group">
            <button
              className={`date-preset-btn ${datePreset === "today" ? "active" : ""}`}
              onClick={() => setDatePreset("today")}
            >
              Today
            </button>
            <button
              className={`date-preset-btn ${datePreset === "7d" ? "active" : ""}`}
              onClick={() => setDatePreset("7d")}
            >
              Last 7 Days
            </button>
            <button
              className={`date-preset-btn ${datePreset === "30d" ? "active" : ""}`}
              onClick={() => setDatePreset("30d")}
            >
              Last 30 Days
            </button>
            <button
              className={`date-preset-btn ${datePreset === "90d" ? "active" : ""}`}
              onClick={() => setDatePreset("90d")}
            >
              Last 90 Days
            </button>
            <button
              className={`date-preset-btn ${datePreset === "custom" ? "active" : ""}`}
              onClick={() => setDatePreset("custom")}
            >
              Custom
            </button>
          </div>

          {datePreset === "custom" && (
            <div className="custom-date-inputs">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                placeholder="From"
              />
              <span>to</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                placeholder="To"
              />
            </div>
          )}

          <button className="refresh-btn" onClick={fetchAnalyticsData} disabled={loading}>
            <FiRefreshCw className={loading ? "spin" : ""} /> Refresh
          </button>
        </div>
      </header>

      {/* Error State Banner */}
      {error && (
        <div className="state-banner error">
          <FiAlertTriangle size={36} style={{ color: "#991b1b", marginBottom: "0.5rem" }} />
          <h3>Unable to Load Analytics</h3>
          <p>{error}</p>
          <button className="refresh-btn" onClick={fetchAnalyticsData}>
            Try Again
          </button>
        </div>
      )}

      {/* Loading Skeleton View */}
      {loading && !overview && (
        <div className="kpi-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="kpi-card" style={{ height: "110px", background: "#f8fafc" }}>
              <div style={{ width: "40%", height: "14px", background: "#e2e8f0", borderRadius: "4px", marginBottom: "1rem" }} />
              <div style={{ width: "60%", height: "28px", background: "#cbd5e1", borderRadius: "4px" }} />
            </div>
          ))}
        </div>
      )}

      {/* Main Analytics Content */}
      {overview && (
        <>
          {/* 1. KPI Summary Cards */}
          <section className="kpi-grid">
            <KpiCard
              label="AI Searches"
              value={overview.total_ai_searches?.toLocaleString("en-IN")}
              subtext="Assistant queries processed"
              badgeText="Exact"
              badgeType="exact"
            />
            <KpiCard
              label="Unique Users"
              value={(overview.unique_logged_in_users + overview.unique_guest_sessions)?.toLocaleString("en-IN")}
              subtext={`${overview.unique_logged_in_users} logged-in | ${overview.unique_guest_sessions} guests`}
              badgeText="Exact"
              badgeType="exact"
            />
            <KpiCard
              label="Recommendations"
              value={overview.total_recommendation_impressions?.toLocaleString("en-IN")}
              subtext="Cards delivered across searches"
              badgeText="Exact"
              badgeType="exact"
            />
            <KpiCard
              label="Card Clicks"
              value={overview.total_clicks?.toLocaleString("en-IN")}
              subtext={`${overview.unique_clicked_messages} unique messages clicked`}
              badgeText="Exact"
              badgeType="exact"
            />
            <KpiCard
              label="Overall CTR"
              value={`${overview.ctr}%`}
              subtext={`${overview.unique_clicked_messages_ctr}% message CTR`}
              badgeText="Exact"
              badgeType="exact"
            />
            <KpiCard
              label="Attributed Bookings"
              value={overview.total_booking_conversions?.toLocaleString("en-IN")}
              subtext="Initiated within 72h of click"
              badgeText="Approx 72h"
              badgeType="approx"
            />
            <KpiCard
              label="Completed Bookings"
              value={overview.total_completed_booking_conversions?.toLocaleString("en-IN")}
              subtext="Fulfilled orders from AI clicks"
              badgeText="Approx 72h"
              badgeType="approx"
            />
            <KpiCard
              label="Active Ranking Engine"
              value={overview.active_ranking_versions?.[0] || "default"}
              subtext={`${overview.active_experiment_variants?.length || 0} active experiment variants`}
              badgeText="Metadata"
              badgeType="meta"
            />
          </section>

          {/* 2. Discovery Trends Chart */}
          <section className="analytics-section">
            <div className="section-header">
              <div>
                <h3 className="section-title">
                  <FiBarChart2 style={{ color: "#2563eb" }} /> Search & Click Trends
                </h3>
                <p className="section-desc">Volume of AI searches, card clicks, and bookings over time.</p>
              </div>

              <div className="granularity-toggle">
                <button
                  className={`granularity-btn ${granularity === "day" ? "active" : ""}`}
                  onClick={() => setGranularity("day")}
                >
                  Day
                </button>
                <button
                  className={`granularity-btn ${granularity === "hour" ? "active" : ""}`}
                  onClick={() => setGranularity("hour")}
                  disabled={isHourlyDisabled}
                  title={isHourlyDisabled ? "Hourly resolution is limited to date ranges up to 3 days" : ""}
                >
                  Hour {isHourlyDisabled && "(<=3d)"}
                </button>
              </div>
            </div>

            {timeseries.length === 0 ? (
              <p style={{ textAlign: "center", color: "#64748b", padding: "2rem 0" }}>
                No AI discovery activity recorded for this period.
              </p>
            ) : (
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <AreaChart data={timeseries} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="bucket" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="searches" name="AI Searches" stroke="#2563eb" fillOpacity={1} fill="url(#colorSearches)" strokeWidth={2} />
                    <Area type="monotone" dataKey="clicks" name="Card Clicks" stroke="#059669" fillOpacity={1} fill="url(#colorClicks)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          {/* 3. A/B Ranking Experiments Section */}
          <section className="analytics-section">
            <div className="section-header">
              <div>
                <h3 className="section-title">
                  <FiLayers style={{ color: "#7c3aed" }} /> AI Ranking Experiment Comparison
                </h3>
                <p className="section-desc">Performance breakdown across experiment keys and active algorithm variants.</p>
              </div>

              <span className="kpi-badge approx" style={{ fontSize: "0.75rem" }}>
                Bookings: Approximate (72h Window)
              </span>
            </div>

            {experiments.length === 0 ? (
              <p style={{ textAlign: "center", color: "#64748b", padding: "2rem 0" }}>
                No active A/B experiment data recorded for this date range.
              </p>
            ) : (
              experiments.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: "800", color: "#0f172a", marginBottom: "0.75rem", fontFamily: "monospace" }}>
                    EXPERIMENT KEY: {exp.experiment_key}
                  </div>

                  <div className="experiment-grid">
                    {Object.values(exp.variants || {}).map((v, vIdx) => (
                      <div
                        key={vIdx}
                        className={`experiment-card ${v.variant === "control" ? "control" : "variant-b"}`}
                      >
                        <div className="variant-header">
                          <span className={`variant-tag ${v.variant === "control" ? "control" : "variant-b"}`}>
                            {v.variant}
                          </span>
                          <span className="variant-version">ver: {v.ranking_version}</span>
                        </div>

                        <div className="metric-row">
                          <span className="metric-label">AI Searches</span>
                          <span className="metric-val">{v.searches?.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="metric-row">
                          <span className="metric-label">Recommendations</span>
                          <span className="metric-val">{v.impressions?.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="metric-row">
                          <span className="metric-label">Total Clicks</span>
                          <span className="metric-val">{v.clicks?.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="metric-row">
                          <span className="metric-label">Unique Clicked Messages</span>
                          <span className="metric-val">{v.unique_clicked_messages?.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="metric-row">
                          <span className="metric-label">Click-Through Rate (CTR)</span>
                          <span className="metric-val" style={{ color: "#2563eb" }}>{v.ctr}%</span>
                        </div>
                        <div className="metric-row">
                          <span className="metric-label">Attributed Bookings (72h)</span>
                          <span className="metric-val" style={{ color: "#d97706" }}>{v.approximate_booking_conversions}</span>
                        </div>
                        <div className="metric-row">
                          <span className="metric-label">Completed Bookings (72h)</span>
                          <span className="metric-val" style={{ color: "#059669" }}>{v.approximate_completed_booking_conversions}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </section>

          {/* 4. Rank Performance (#1 to #10) */}
          <section className="analytics-section">
            <div className="section-header">
              <div>
                <h3 className="section-title">
                  <FiCheckCircle style={{ color: "#059669" }} /> Rank Position Performance (#1 - #10)
                </h3>
                <p className="section-desc">Click volume and unique user engagement across recommendation card rank positions.</p>
              </div>
            </div>

            <div className="rank-table-wrap">
              <table className="rank-table">
                <thead>
                  <tr>
                    <th>Rank Position</th>
                    <th>Click Count</th>
                    <th>Unique Messages Clicked</th>
                    <th>Unique Clicking Users</th>
                    <th>Rank CTR Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ranks.map((r, i) => (
                    <tr key={i}>
                      <td>
                        <div className="rank-pill">{r.rank_position}</div>
                      </td>
                      <td style={{ fontWeight: "800", color: "#0f172a" }}>{r.click_count?.toLocaleString("en-IN")}</td>
                      <td>{r.unique_messages_clicked?.toLocaleString("en-IN")}</td>
                      <td>{r.unique_clicking_users?.toLocaleString("en-IN")}</td>
                      <td>
                        <span className="not-available-tag" title={r.ctr_note}>
                          <FiHelpCircle /> Not Available
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.75rem" }}>
              * Note: Individual card rank CTR is marked <strong>Not Available</strong> because card position impressions are not recorded as separate row-level display events upon search render.
            </p>
          </section>

          {/* 5. Conversion Funnel */}
          <section className="analytics-section">
            <div className="section-header">
              <div>
                <h3 className="section-title">
                  <FiZap style={{ color: "#d97706" }} /> End-to-End Conversion Funnel
                </h3>
                <p className="section-desc">Sequential progression from AI query to completed consultation booking.</p>
              </div>
            </div>

            <div className="funnel-container">
              {Array.isArray(funnel) && funnel.length > 0 ? (
                funnel.map((step, idx) => {
                  const maxCount = funnel[0]?.count || 1;
                  const widthPct = Math.max(8, Math.min(100, (step.count / maxCount) * 100));

                  return (
                    <div key={idx} className="funnel-step">
                      <div className="funnel-step-num">{idx + 1}</div>
                      <div className="funnel-step-info">
                        <div className="funnel-step-title">{step.step}</div>
                        <div className="funnel-step-meta">
                          <span>Count: <strong>{step.count?.toLocaleString("en-IN")}</strong></span>
                          <span>Step Rate: <strong>{step.conversion_rate}%</strong></span>
                          <span className={`kpi-badge ${step.attribution_type === "exact" ? "exact" : "approx"}`}>
                            {step.attribution_type}
                          </span>
                        </div>
                      </div>
                      <div className="funnel-bar-wrap">
                        <div className="funnel-bar-fill" style={{ width: `${widthPct}%` }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: "1.2rem", textAlign: "center", color: "#64748b", fontSize: "0.88rem" }}>
                  No conversion funnel steps available for the selected time range.
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function KpiCard({ label, value, subtext, badgeText, badgeType }) {
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <span className="kpi-label">{label}</span>
        {badgeText && <span className={`kpi-badge ${badgeType}`}>{badgeText}</span>}
      </div>
      <div className="kpi-value">{value ?? "-"}</div>
      <div className="kpi-subtext">{subtext}</div>
    </div>
  );
}
