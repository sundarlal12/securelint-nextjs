/* eslint-disable @next/next/no-img-element */

interface LogoProps {
  size?: number;
  className?: string;
}

export function SecureLintIcon({ size = 28, className = "" }: LogoProps) {
  return (
    <img
      src="/icons/icon-128.png"
      alt="SecureLint"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function SecureLintIconLight({ size = 28, className = "" }: LogoProps) {
  return (
    <img
      src="/icons/icon-128.png"
      alt="SecureLint"
      width={size}
      height={size}
      className={className}
    />
  );
}
