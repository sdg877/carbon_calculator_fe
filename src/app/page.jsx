'use client'; 

import React from "react";
import styles from "../styles/homepage.css";

import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts"; 

const GLOBAL_AVERAGE_DATA = [
    { name: 'Transport', value: 35, colour: '#4D7C8A', description: 'Cars, buses, and trains' },
    { name: 'Energy/Housing', value: 25, colour: '#7465A7', description: 'Heating and electricity use' },
    { name: 'Food/Diet', value: 20, colour: '#C38148', description: 'Meat, dairy, and produce impact' },
    { name: 'Shopping/Goods', value: 15, colour: '#CD5B68', description: 'Purchases and consumption' },
    { name: 'Other/Waste', value: 5, colour: '#5F5F5F', description: 'Waste and miscellaneous' },
];

const TOTAL_COMMUNITY_CO2 = 125000;

const formatNumber = (num) => num.toLocaleString('en-GB');


export default function HomePage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Carbon Calculator</h1>

      <section className={styles.globalStatsSection}>
          <h2>Community Footprint Snapshot</h2>
          
          <div className={styles.statsSummary}>
              <p>
                  Our users have collectively tracked {formatNumber(TOTAL_COMMUNITY_CO2)} kg of CO<sub>2</sub> this month.
              </p>
              <p>
                  Here is the estimated **average** breakdown of an individual's footprint:
              </p>
          </div>

          <div className={styles.pieChartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                      data={GLOBAL_AVERAGE_DATA}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={50} 
                      paddingAngle={2}
                    >
                      {GLOBAL_AVERAGE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.colour} />
                      ))}
                    </Pie>

                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{ paddingLeft: '20px' }}
                        payload={GLOBAL_AVERAGE_DATA.map((a) => ({
                            id: a.name,
                            value: `${a.name} (${a.value}%)`,
                            type: 'square',
                            color: a.colour,
                        }))}
                    />
                </PieChart>
              </ResponsiveContainer>
          </div>
      </section>

      <section className={styles.introductionSection}>
        <p className={styles.paragraph}>
          Welcome to the Carbon Calculator. This app helps you track your
          personal carbon footprint based on your daily activities, like
          transport, energy use, food, shopping, and lifestyle choices.
        </p>
        <p className={styles.paragraph}>
          By logging your activities, you can see how much CO<sub>2</sub>{" "}
          you produce and get suggestions for reducing your
          impact on the environment. Earn points for completing eco-friendly
          actions and track your monthly progress.
        </p>
        <p className={styles.paragraph}>
          Start by logging in or registering to create your account, and
          begin your journey toward a more sustainable lifestyle.
        </p>
      </section>

      <section className={styles.blurbSection}>
        <div className={styles.blurbContent}>
          <p className={styles.blurbParagraph}>
            We get it. The world's biggest polluters aren't individuals, and
            true change requires action from corporations and billionaires. But
            that doesn't mean we're powerless! Think of this as your personal
            journey, where every small step adds up. Our website is a fun, easy
            way to start. Track your carbon footprint, discover unique ways to
            offset your emissions, and even find live volunteering gigs near
            you. It's about progress, not perfection.
          </p>
        </div>
      </section>
    </main>
  );
}