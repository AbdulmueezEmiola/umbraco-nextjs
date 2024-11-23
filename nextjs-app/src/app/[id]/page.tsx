import { getPage } from "@/services/page";
import styles from "../page.module.css";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const data = await getPage(id);
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>{data.name}</h1>
        <div>
          <span>Title: </span>
          <span>{data.properties.title}</span>
        </div>
        <div>
          <span>Description: </span>
          <span>{data.properties.description}</span>
        </div>
      </main>
    </div>
  );
}
