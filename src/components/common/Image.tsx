import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Skeleton } from "@heroui/react";

interface ImageProps {
  src: string;
  alt?: string;
  classNames?: {
    img?: string;
    skeleton?: string;
  };
  onClick?: () => void;
  imageInfo?: {
    width?: number;
    height?: number;
    [key: string]: any; // 👈 permite cosas como "name" sin romper
  };
  [key: string]: any;
}

export default React.memo(function Image({
  src,
  alt,
  classNames = {},
  onClick,
  imageInfo = {},
  ...props
}: ImageProps) {
  const [isLoad, setIsLoad] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const radio =
    imageInfo?.width && imageInfo?.height
      ? Math.round((imageInfo.width / imageInfo.height) * 100) / 100
      : undefined;

  return (
    <Skeleton
      classNames={{
        base: clsx([
          "w-full text-white/0",
          !isLoad && "animate-[pulse_1s_ease-in-out_infinite] bg-[#f6f9f0] dark:bg-[#222] transform-gpu",
          !isLoad && !radio && "h-[40dvh]",
          classNames.skeleton,
        ]),
      }}
      isLoaded={isLoad}
      style={radio ? { aspectRatio: radio } : undefined}
    >
      {mounted && (
        <picture>
          <source srcSet={`${src}.avif`} type="image/avif" />
          <source srcSet={`${src}.webp`} type="image/webp" />
          <img
            onContextMenu={(e) => e.preventDefault()}
            key={src}
            loading="lazy"
            className={clsx("w-full", classNames.img)}
            onClick={onClick}
            src={`${src}.webp`}
            onLoad={() => setIsLoad(true)}
            {...props}
          />
        </picture>
      )}
    </Skeleton>
  );
});
