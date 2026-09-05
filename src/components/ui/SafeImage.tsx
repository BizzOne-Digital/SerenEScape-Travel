import Image, { type ImageProps } from "next/image";
import { resolveImageSrc, isStoredUploadUrl } from "@/lib/images/resolve";

type SafeImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
};

export function SafeImage({ src, alt, ...props }: SafeImageProps) {
  const resolved = resolveImageSrc(src);
  const unoptimized =
    isStoredUploadUrl(resolved) ||
    resolved.endsWith(".svg") ||
    resolved.includes("Firefly_");

  return (
    <Image
      {...props}
      src={resolved}
      alt={alt}
      unoptimized={unoptimized || props.unoptimized}
    />
  );
}
