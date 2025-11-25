"use client";

import React from "react";
import styles from "../styles/homepage.module.css";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

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
            {/* Pie Chart */}
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

      {/* --- SECTION 2: PHILOSOPHY CARD --- */}
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
    </main>
  );
}
