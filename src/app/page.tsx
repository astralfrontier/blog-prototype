import { pages } from "@/lib/blog";
import styles from "./page.module.css";

export default function Home() {
  const allPages = pages();
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <pre>{JSON.stringify(allPages, null, 2)}</pre>
      </main>
    </div>
  );
}
