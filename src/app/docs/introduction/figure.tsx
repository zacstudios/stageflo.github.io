import Image from "next/image";
import styles from "./page.module.css";

type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
  /** Pixel size of the screenshot, so the page keeps its space while it loads. */
  width: number;
  height: number;
};

/** A screenshot from the app with an optional caption. */
export default function Figure({ src, alt, caption, width, height }: FigureProps) {
  return (
    <figure className={styles.figure}>
      <Image src={src} alt={alt} width={width} height={height} loading="lazy" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
