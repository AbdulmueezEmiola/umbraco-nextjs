import styles from "./page.module.css";
import { getAllPages } from "@/services/page";

export default async function Home() {
  const pages = await getAllPages();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Pages Available</h1>
        <ul>
          {pages.items.map((page) => (
            <li key={page.id}>
              Visit{" "}
              <a href={`/${page.id}`} className={styles.primary}>
                {page.name}
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
