import Image from "next/image";
import styles from "./page.module.css";
import LoginPage from "./components/LoginPage/LoginPage";

export default function Home() {
  return (
    <div>
      <LoginPage />
    </div>
  );
}
