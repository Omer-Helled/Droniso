import type { CSSProperties, MouseEventHandler } from "react";
import { avifSrcSet, jpgSrcSet, jpgUrl, type ImageRef } from "@/lib/media-url";

type Props = {
  img: ImageRef;
  sizes: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  className?: string;
  style?: CSSProperties;
  onDoubleClick?: MouseEventHandler<HTMLImageElement>;
};

/** Responsive image: AVIF for current browsers, JPEG for the rest. The <picture> itself takes no space
 *  (display: contents), so the <img> can be styled as if it were a direct child of its container. */
export function Picture({ img, sizes, alt, width, height, loading = "lazy", fetchPriority, className, style, onDoubleClick }: Props) {
  return (
    <picture className="contents">
      <source type="image/avif" srcSet={avifSrcSet(img)} sizes={sizes} />
      <img
        src={jpgUrl(img)}
        srcSet={jpgSrcSet(img)}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        className={className}
        style={style}
        onDoubleClick={onDoubleClick}
      />
    </picture>
  );
}
