import Image from "next/image";
import styles from "./page.module.css";

export type VisualMarker = {
  x: number;
  y: number;
  label: string;
};

export type VisualGuideProps = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  markers?: VisualMarker[];
};

/** A real StageFlo screenshot with numbered callouts, matching the step-by-step help style. */
export default function VisualGuide({
  src,
  alt,
  caption,
  width,
  height,
  markers = [],
}: VisualGuideProps) {
  return (
    <figure className={styles.visualGuide}>
      <div className={styles.visualFrame}>
        <Image src={src} alt={alt} width={width} height={height} loading="lazy" />
        <span className={styles.screenshotBadge}>In StageFlo</span>
        {markers.map((marker, index) => (
          <span
            key={`${marker.label}-${index}`}
            className={styles.visualMarker}
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            aria-label={`${index + 1}. ${marker.label}`}
            title={marker.label}
          >
            {index + 1}
          </span>
        ))}
      </div>
      <figcaption>
        <strong>{caption}</strong>
        {markers.length > 0 ? (
          <ol className={styles.markerLegend}>
            {markers.map((marker, index) => (
              <li key={`${marker.label}-legend-${index}`}>{marker.label}</li>
            ))}
          </ol>
        ) : null}
      </figcaption>
    </figure>
  );
}
