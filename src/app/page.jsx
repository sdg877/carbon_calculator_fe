"use client";

import React, { useState, useEffect } from "react";
import styles from "../styles/homepage.module.css";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

async function fetchEnvironmentalNews() {
  const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  if (!API_KEY) {
    console.error("News API key is missing. Check your .env.local file.");
    return [];
  }

  const relevantQuery =
    "(climate OR environment OR sustainability OR ecology) AND NOT (crime OR police OR finance OR drug OR court)";

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    relevantQuery
  )}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`API call failed with status: ${response.status}`);
      return [];
    }
    const data = await response.json();

    const filteredArticles = data.articles.filter(
      (article) =>
        article.title &&
        article.urlToImage &&
        !article.urlToImage.includes("logo") &&
        !article.urlToImage.includes("placeholder")
    );

    return filteredArticles.slice(0, 8);
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

const GLOBAL_AVERAGE_DATA = [
  {
    name: "Transport",
    value: 35,
    colour: "#4D7C8A",
    description: "Cars, buses, and trains",
  },
  {
    name: "Energy/Housing",
    value: 25,
    colour: "#7465A7",
    description: "Heating and electricity use",
  },
  {
    name: "Food/Diet",
    value: 20,
    colour: "#C38148",
    description: "Meat, dairy, and produce impact",
  },
  {
    name: "Shopping/Goods",
    value: 15,
    colour: "#CD5B68",
    description: "Purchases and consumption",
  },
  {
    name: "Other/Waste",
    value: 5,
    colour: "#5F5F5F",
    description: "Waste and miscellaneous",
  },
];

const formatNumber = (num) => num.toLocaleString("en-GB");
const TOTAL_COMMUNITY_CO2 = 125000;
const AUTH_PAGE_PATH = "/auth/login";

export default function HomePage() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      const articles = await fetchEnvironmentalNews();
      setNewsArticles(articles);
      setIsLoading(false);
    }
    loadNews();
  }, []);

  const formatPublishedAt = (isoDate) => {
    if (!isoDate) return "Unknown date";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const cleanTitle = (title) => {
    return title.replace(/\*\*/g, "").replace(/""/g, '"').trim();
  };

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
                    paddingAngle={2}
                  >
                    {GLOBAL_AVERAGE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.colour} />
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

          {isLoading && <p>Loading the latest environmental news...</p>}

          {!isLoading && newsArticles.length === 0 && (
            <p>
              Sorry, we couldn't load any news articles right now. Please ensure
              your API key is correct in `.env.local`.
            </p>
          )}

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
                      alt={article.title || "News article image"}
                      className={styles.newsImage}
                    />
                  )}
                  <div className={styles.newsContent}>
                    <p className={styles.newsTitle}>
                      {cleanTitle(article.title)}
                    </p>
                    <p className={styles.newsSource}>
                      {article.source.name || "Unknown"} |{" "}
                      {formatPublishedAt(article.publishedAt)}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {newsArticles.length > 0 && (
            <>
              <p className={styles.externalLinkDisclaimer}>
                *Please note: Clicking news headlines will take you to external
                websites.
              </p>
              <a
                href="https://newsapi.org/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.viewMoreLink}
              >
                Powered by NewsAPI.org - View More News →
              </a>
            </>
          )}
        </div>
      </section>
    </main>
  );
}