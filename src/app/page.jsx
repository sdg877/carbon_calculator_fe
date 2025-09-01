import React from "react";
import styles from "../styles/homepage.css";

export default function HomePage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Carbon Calculator</h1>
      <p className={styles.paragraph}>
        Welcome to the Carbon Calculator! This app helps you track your personal carbon footprint based on your daily activities—like transport, energy use, food, shopping, and lifestyle choices.
      </p>
      <p className={styles.paragraph}>
        By logging your activities, you can see how much CO₂ you produce and get personalised suggestions for reducing your impact on the environment. Earn points for completing eco-friendly actions and track your monthly progress.
      </p>
      <p className={styles.paragraph}>
        Start by logging in or registering to create your account, and begin your journey toward a more sustainable lifestyle.
      </p>
    </main>
  );
}
