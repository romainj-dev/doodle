import { InputBar } from "@/components/input-bar/InputBar";
import { Messages } from "@/components/message/Messages";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <Messages />
      </div>
      <InputBar />
      <div className={styles.backgroundFixed} />
    </main>
  );
}
