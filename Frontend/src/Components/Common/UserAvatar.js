import React, { useState, useEffect } from "react";
import "./UserAvatar.css";

const PLACEHOLDER_OR_SILHOUETTE_PATTERN =
  /silhouette|default[-_]?avatar|default[-_]?user|blank[-_]?profile|no[-_]?avatar|user[-_]?tie|corbata|anonimo|sin[-_]?foto|flaticon\.com\/512\/149|vecteezy\.com|pngtree\.com|pngwing\.com|pngitem\.com|pngall\.com|kindpng\.com|nicepng\.com|clipartmax\.com|freeiconspng\.com|icon-library\.com|pixabay\.com\/photo\/2015\/10\/05\/22\/37|youtube\.com\/channel\//i;

export function isValidUserPhotoUrl(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (!/^https?:\/\/|^data:image\//i.test(trimmed)) return false;
  if (PLACEHOLDER_OR_SILHOUETTE_PATTERN.test(trimmed)) return false;
  return true;
}

export function getUserInitials(nameOrEmail) {
  const cleaned = String(nameOrEmail || "User").trim();
  if (!cleaned) return "U";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }
  return cleaned.charAt(0).toUpperCase();
}

export default function UserAvatar({
  src = "",
  name = "User",
  size = 40,
  className = "",
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const numericSize = typeof size === "number" ? size : 40;
  const dimensionStyle = {
    width: `${numericSize}px`,
    height: `${numericSize}px`,
    minWidth: `${numericSize}px`,
    minHeight: `${numericSize}px`,
    fontSize: `${Math.max(12, Math.round(numericSize * 0.38))}px`,
  };

  const canShowImage = isValidUserPhotoUrl(src) && !hasError;
  const initials = getUserInitials(name);

  return (
    <span
      className={`user-avatar ${className}`.trim()}
      style={dimensionStyle}
      title={name || "User"}
    >
      {canShowImage ? (
        <img
          src={src.trim()}
          alt={name || "User"}
          className="user-avatar__img"
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="user-avatar__initials" aria-label={name || "User"}>
          {initials}
        </span>
      )}
    </span>
  );
}
