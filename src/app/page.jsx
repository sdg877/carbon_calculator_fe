"use client";

import React, { useState, useEffect } from "react";
import styles from "@/styles/homepage.module.css";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const GLOBAL_AVERAGE_DATA = [
  {
    name: "Transport",
    value: 35,
    colour: "#A29BFE",
    description: "Cars, buses, and trains",
  },
  {
    name: "Energy/Housing",
    value: 25,
    colour: "#74B9FF",
    description: "Heating and electricity use",
  },
  {
    name: "Food/Diet",
    value: 20,
    colour: "#B2BEC3",
    description: "Meat, dairy, and produce impact",
  },
  {
    name: "Shopping/Goods",
    value: 15,
    colour: "#636E72",
    description: "Purchases and consumption",
  },
  {
    name: "Other/Waste",
    value: 5,
    colour: "#ADD8E6",
    description: "Waste and miscellaneous",
  },
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
      const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
      if (!API_KEY) {
        setIsLoading(false);
        return;
      }
      const query = encodeURIComponent(
        '+"climate change" OR +"carbon emissions" OR +"sustainability"',
      );
      const exclude =
        "dailymail.co.uk,foxnews.com,tmz.com,bbc.co.uk,telegraph.co.uk,theguardian.com,independent.co.uk,mirror.co.uk,cnn.com,nbcnews.com";

      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${query}&searchIn=title&language=en&sortBy=relevancy&excludeDomains=${exclude}&pageSize=8&apiKey=${API_KEY}`,
        );
        if (!response.ok) throw new Error();
        const data = await response.json();
        setNewsArticles(data.articles || []);
      } catch (error) {
        console.error("News load failed");
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
            your daily activities, like transport, energy use, food, shopping,
            and lifestyle choices.
          </p>
          <p className={styles.paragraph}>
            See how your habits compare to the estimated global average
            breakdown shown here.
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
          <h2 className={styles.cardTitle}>
            Estimated Global Average Breakdown
          </h2>
          <div className={styles.chartAndKeyWrapper}>
            <div className={styles.chartArea}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={GLOBAL_AVERAGE_DATA}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                  >
                    {GLOBAL_AVERAGE_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.colour} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className={styles.chartKeyList}>
              {GLOBAL_AVERAGE_DATA.map((entry) => (
                <li key={entry.name} className={styles.chartKeyItem}>
                  <span
                    style={{ backgroundColor: entry.colour }}
                    className={styles.keyDot}
                  ></span>
                  {entry.name} ({entry.value}%)
                </li>
              ))}
            </ul>
          </div>
          <p className={styles.chartDescription}>
            This shows the average footprint distribution. Your results will be
            personalised.
          </p>
        </div>
      </section>

      <section className={styles.philosophySection}>
        <div className={styles.philosophyCard}>
          <h3 className={styles.cardTitle}>
            It's About Progress, Not Perfection
          </h3>
          <p className={styles.paragraph}>
            We know that global change requires corporate action, but that
            doesn't mean we're powerless! Think of this as your personal
            journey, where every small step adds up.
          </p>
          <p className={styles.paragraph}>
            Our website is a fun, easy way to start. Track your carbon
            footprint, discover unique ways to offset your emissions, and even
            find live volunteering gigs near you.
          </p>
        </div>
      </section>

      <section className={styles.newsFeedSection}>
        <div className={styles.newsFeedCard}>
          <h3 className={styles.cardTitle}>
            Environmental News from Around the World
          </h3>
          {isLoading ? (
            <p>Loading the latest environmental news...</p>
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
                        loading="lazy"
                      />
                    )}
                    <div className={styles.newsContent}>
                      <p className={styles.newsTitle}>
                        {cleanTitle(article.title)}
                      </p>
                      <p className={styles.newsSource}>
                        {article.source.name} |{" "}
                        {formatPublishedAt(article.publishedAt)}
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
