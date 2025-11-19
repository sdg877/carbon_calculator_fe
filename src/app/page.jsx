import React from "react";
import styles from "../styles/homepage.css";

export default function HomePage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Carbon Calculator</h1>

      <section className={styles.introductionSection}>
        <p className={styles.paragraph}>
          Welcome to the Carbon Calculator. This app helps you track your
          personal carbon footprint based on your daily activities—like
          transport, energy use, food, shopping, and lifestyle choices.
        </p>
        <p className={styles.paragraph}>
          By logging your activities, you can see how much **CO**<sub>2</sub>{" "}
          you produce and get **personalised suggestions** for reducing your
          impact on the environment. Earn points for completing eco-friendly
          actions and track your monthly progress.
        </p>
        <p className={styles.paragraph}>
          Start by **logging in or registering** to create your account, and
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
            you. It's about **progress, not perfection**.
          </p>
        </div>
      </section>
    </main>
  );
}
