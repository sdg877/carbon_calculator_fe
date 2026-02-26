"use client";

import React, { useState, useEffect } from "react";
import styles from "@/styles/homepage.module.css";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const GLOBAL_AVERAGE_DATA = [
  { name: "Transport", value: 35, colour: "#A29BFE" },
  { name: "Energy/Housing", value: 25, colour: "#74B9FF" },
  { name: "Food/Diet", value: 20, colour: "#B2BEC3" },
  { name: "Shopping/Goods", value: 15, colour: "#636E72" },
  { name: "Other/Waste", value: 5, colour: "#ADD8E6" },
];

const formatNumber = (num) => num.toLocaleString("en-GB");
const TOTAL_COMMUNITY_CO2 = 125000;
const AUTH_PAGE_PATH = "/auth/login";

const cleanTitle = (title) =>
  title.replace(/\*\*/g, "").replace(/""/g, '"').trim();

const formatPublishedAt = (isoDate) => {
  if (!isoDate) return "Unknown date";
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function HomePage() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!backendUrl) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(`${backendUrl}/api/news`);
        if (!response.ok) throw new Error("Backend response not ok");
        const data = await response.json();
        setNewsArticles(data.articles?.slice(0, 8) || []);
      } catch (error) {
        console.error("News load failed:", error);
        setNewsArticles([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadNews();
  }, []);

  return (
    <main className={styles.landingContainer}>
      <h1 className={styles.landingTitle}>
        Track Your Footprint, Make an Impact
      </h1>

      <section className={styles.mainContentSection}>
        <div className={styles.infoCard}>
          <h2 className={styles.cardTitle}>Welcome to CarbonCalc</h2>
          <p className={styles.paragraph}>
            This app helps you track your personal carbon footprint based on
            your daily activities.
          </p>
          <div className={styles.communityStat}>
            <p>
              Our community has tracked{" "}
              <span className={styles.statHighlight}>
                {formatNumber(TOTAL_COMMUNITY_CO2)} kg of CO₂
              </span>{" "}
              this month.
            </p>
          </div>
          <a href={AUTH_PAGE_PATH} className={styles.ctaButton}>
            Log in or Register to Start Tracking
          </a>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.cardTitle}>Global Average Breakdown</h2>
          <div className={styles.chartAndKeyWrapper}>
            <div className={styles.chartArea}>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={GLOBAL_AVERAGE_DATA}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    label={false}
                  >
                    {GLOBAL_AVERAGE_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.colour} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    formatter={(value, entry) => (
                      <span style={{ color: '#333', marginRight: '10px', fontSize: '14px' }}>
                        {value}: {entry.payload.value}%
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.newsFeedSection}>
        <div className={styles.newsFeedCard}>
          <h3 className={styles.cardTitle}>Environmental News</h3>
          {isLoading ? (
            <div className={styles.loaderContainer}>
              <div className={styles.loadingSpinner}></div>
              <p className={styles.loadingText}>Fetching news...</p>
            </div>
          ) : (
            <div className={styles.newsGrid}>
              {newsArticles.map((article) => (
                <a
                  key={article.url}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.newsItemLink}
                >
                  <div className={styles.newsItem}>
                    {article.urlToImage && (
                      <img
                        src={article.urlToImage}
                        alt={cleanTitle(article.title)}
                        className={styles.newsImage}
                      />
                    )}
                    <div className={styles.newsContent}>
                      <p className={styles.newsTitle}>{cleanTitle(article.title)}</p>
                      <p className={styles.newsSource}>
                        {article.source.name} | {formatPublishedAt(article.publishedAt)}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}