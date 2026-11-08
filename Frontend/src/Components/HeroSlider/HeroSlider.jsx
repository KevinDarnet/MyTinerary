import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DatosFallback from "../Json/datos";
import "./HeroSlider.css";

const API_URL =
  typeof window !== "undefined" &&
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1" &&
  (process.env.REACT_APP_API_URL || "").includes("localhost")
    ? ""
    : (process.env.REACT_APP_API_URL || "").replace(/\/api\/?$/, "");

const AUTOPLAY_DURATION_MS = 5000;

const FALLBACK_DESTINATIONS = DatosFallback.map((item, idx) => ({
  _id: `fallback-${idx}`,
  city: item.name || "Destination",
  country: item.country || "World",
  description: `Explore the iconic landmarks, culture, and local experiences of ${
    item.name || "this destination"
  } in ${item.country || "the world"}.`,
  image: item.image,
  language: item.language || "English",
  coin: item.coin || "Local Currency",
  flag: "",
  isFallback: true,
}));

const FALLBACK_CITY_IMAGE =
  "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80";

const normalizeDestination = (raw, index) => ({
  _id: raw._id || `dest-${index}`,
  city: raw.city || raw.name || "Destination",
  country: raw.country || "World",
  description:
    raw.description ||
    `Discover unforgettable itineraries and local insiders' secrets in ${
      raw.city || raw.name || "this city"
    }.`,
  image: raw.image || FALLBACK_CITY_IMAGE,
  language: (raw.language || raw.lenguage || "English").trim(),
  coin: raw.coin || "Currency",
  flag: raw.flag || "",
  isFallback: Boolean(raw.isFallback),
});

export default function HeroSlider() {
  const [destinations, setDestinations] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(null);
  const [cycleId, setCycleId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [isCardsPaused, setIsCardsPaused] = useState(false);
  const [loadedMap, setLoadedMap] = useState({});
  const hasFetchedRef = useRef(false);
  const isPausedRef = useRef(false);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const [savedIds, setSavedIds] = useState(() => {
    try {
      const raw = localStorage.getItem("mytinerary_saved_destinations");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  // Execute strictly ONCE on initial mount
  useEffect(() => {
    if (hasFetchedRef.current) return undefined;
    hasFetchedRef.current = true;

    let isMounted = true;

    async function loadDestinationsOnce() {
      try {
        const res = await axios.get(`${API_URL}/api/allcities`);
        const apiCities = res.data?.response?.ciudades;
        if (isMounted && Array.isArray(apiCities) && apiCities.length > 0) {
          setDestinations(apiCities.map(normalizeDestination));
          setUsingFallback(false);
          setLoading(false);
          return;
        }
        throw new Error("Empty cities list from API");
      } catch (err) {
        if (isMounted) {
          setDestinations(FALLBACK_DESTINATIONS);
          setUsingFallback(true);
          setLoading(false);
        }
      }
    }

    loadDestinationsOnce();

    return () => {
      isMounted = false;
    };
  }, []);

  const total = destinations.length;

  const advanceTo = useCallback(
    (targetIdx) => {
      if (total <= 1) return;
      const normalizedTarget = ((targetIdx % total) + total) % total;
      if (normalizedTarget !== activeIndexRef.current) {
        setPreviousIndex(activeIndexRef.current);
        setActiveIndex(normalizedTarget);
        activeIndexRef.current = normalizedTarget;
        setCycleId((c) => c + 1);
      }
    },
    [total]
  );

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    const current = activeIndexRef.current;
    const next = (current + 1) % total;
    setPreviousIndex(current);
    setActiveIndex(next);
    activeIndexRef.current = next;
    setCycleId((c) => c + 1);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    const current = activeIndexRef.current;
    const prev = (current - 1 + total) % total;
    setPreviousIndex(current);
    setActiveIndex(prev);
    activeIndexRef.current = prev;
    setCycleId((c) => c + 1);
  }, [total]);

  const handleSelectIndex = useCallback(
    (targetIdx) => {
      if (targetIdx >= 0 && targetIdx < total) {
        advanceTo(targetIdx);
      }
    },
    [total, advanceTo]
  );

  const toggleBookmark = useCallback((e, destId) => {
    e.stopPropagation();
    e.preventDefault();
    setSavedIds((prev) => {
      const exists = prev.includes(destId);
      const next = exists
        ? prev.filter((id) => id !== destId)
        : [...prev, destId];
      try {
        localStorage.setItem(
          "mytinerary_saved_destinations",
          JSON.stringify(next)
        );
      } catch (err) {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  // Auto-advance timer (checks isPausedRef and wraps cleanly with circular modulo)
  useEffect(() => {
    if (loading || total <= 1) return undefined;
    const timer = setInterval(() => {
      if (!isPausedRef.current) {
        const current = activeIndexRef.current;
        const next = (current + 1) % total;
        setPreviousIndex(current);
        setActiveIndex(next);
        activeIndexRef.current = next;
      }
    }, AUTOPLAY_DURATION_MS);
    return () => clearInterval(timer);
  }, [loading, total, cycleId]);

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return;
      }
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleNext, handlePrev]);

  if (loading) {
    return (
      <section className="hero-slider hero-slider--loading" aria-busy="true">
        <div className="hero-slider__loader">
          <div className="hero-slider__spinner" />
          <p style={{ color: "rgba(255,255,255,0.75)", margin: 0 }}>
            Loading immersive destinations...
          </p>
        </div>
      </section>
    );
  }

  if (total === 0) {
    return null;
  }

  const safeActiveIndex = activeIndex % total;
  const activeDest = destinations[safeActiveIndex];
  const isCurrentSaved = savedIds.includes(activeDest._id);

  // Build upcoming queue of next 3 destinations in cyclic order
  const upcomingCount = Math.min(3, Math.max(0, total - 1));
  const upcomingCards = [];
  for (let offset = 1; offset <= upcomingCount; offset += 1) {
    const idx = (safeActiveIndex + offset) % total;
    upcomingCards.push({
      destination: destinations[idx],
      index: idx,
      offset,
    });
  }

  const formattedCurrent = String(safeActiveIndex + 1).padStart(2, "0");
  const formattedTotal = String(total).padStart(2, "0");
  const railPercentage = ((safeActiveIndex + 1) / total) * 100;

  const detailRoute = activeDest.isFallback
    ? "/Cities"
    : `/Details/${activeDest._id}`;

  return (
    <section
      className={`hero-slider ${isCardsPaused ? "is-cards-paused" : ""}`}
      aria-label="Immersive Destination Slider"
    >
      {/* Full-Screen Background Crossfade + Ken Burns Layers */}
      <div className="hero-slider__bg-container">
        {destinations.map((dest, idx) => {
          const isActive = idx === safeActiveIndex;
          const isPrevious = idx === previousIndex && !isActive;
          return (
            <div
              key={dest._id || idx}
              className={`hero-slider__bg-layer ${
                isActive ? "is-active" : isPrevious ? "is-previous" : ""
              }`}
              style={{ backgroundImage: `url("${dest.image}")` }}
            />
          );
        })}
        <div className="hero-slider__overlay" />
      </div>

      {usingFallback && (
        <div className="hero-slider__status-pill">
          <span
            className="material-icons"
            style={{ fontSize: "1rem", color: "#fbbf24" }}
          >
            cloud_off
          </span>
          <span>Local Catalog Mode</span>
        </div>
      )}

      {/* Main Two-Column Interactive Layout */}
      <div className="hero-slider__content">
        {/* Lateral Index Rail */}
        <aside className="hero-slider__rail" aria-hidden="true">
          <span className="hero-slider__rail-number">{formattedCurrent}</span>
          <div className="hero-slider__rail-track">
            <div
              className="hero-slider__rail-fill"
              style={{
                transform: `scaleY(${railPercentage / 100})`,
              }}
            />
          </div>
          <span className="hero-slider__rail-total">{formattedTotal}</span>
        </aside>

        {/* Left Column: Active Destination Hero Info (Staggered Fade-Up) */}
        <div
          className="hero-slider__info"
          key={activeDest._id || safeActiveIndex}
        >
          <div className="hero-slider__meta-row hero-stagger hero-stagger--1">
            <span className="hero-slider__country-badge">
              {activeDest.flag ? (
                <img
                  src={activeDest.flag}
                  alt={activeDest.country}
                  className="hero-slider__country-flag"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="material-icons" style={{ fontSize: "1rem" }}>
                  place
                </span>
              )}
              {activeDest.country}
            </span>

            {activeDest.language && (
              <span className="hero-slider__chip">
                <span className="material-icons">translate</span>
                {activeDest.language}
              </span>
            )}

            {activeDest.coin && (
              <span className="hero-slider__chip">
                <span className="material-icons">payments</span>
                {activeDest.coin}
              </span>
            )}
          </div>

          <h1 className="hero-slider__title hero-stagger hero-stagger--2">
            {activeDest.city}
          </h1>

          <p className="hero-slider__description hero-stagger hero-stagger--3">
            {activeDest.description}
          </p>

          <div className="hero-slider__actions hero-stagger hero-stagger--4">
            <Link to={detailRoute} className="hero-slider__btn-primary">
              <span>View Itineraries</span>
              <span className="material-icons" style={{ fontSize: "1.15rem" }}>
                arrow_forward
              </span>
            </Link>

            <Link to="/Cities" className="hero-slider__btn-secondary">
              <span className="material-icons" style={{ fontSize: "1.1rem" }}>
                explore
              </span>
              <span>Explore All</span>
            </Link>

            <button
              type="button"
              className={`hero-slider__btn-bookmark-main ${
                isCurrentSaved ? "is-saved" : ""
              }`}
              onClick={(e) => toggleBookmark(e, activeDest._id)}
              title={
                isCurrentSaved ? "Remove from saved" : "Save destination"
              }
              aria-label="Save destination"
            >
              <span className="material-icons">
                {isCurrentSaved ? "bookmark" : "bookmark_border"}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Secondary Destination Cards Carousel */}
        <div
          className="hero-slider__cards-wrapper"
          onMouseEnter={() => {
            isPausedRef.current = true;
            setIsCardsPaused(true);
          }}
          onMouseLeave={() => {
            isPausedRef.current = false;
            setIsCardsPaused(false);
            setCycleId((c) => c + 1);
          }}
        >
          <div className="hero-slider__cards-header">
            <span className="hero-slider__cards-label">
              Upcoming Destinations · Select to explore
            </span>
          </div>

          <div
            className="hero-slider__cards-track"
            key={`track-${safeActiveIndex}`}
          >
            {upcomingCards.map(({ destination, index, offset }) => {
              const isSaved = savedIds.includes(destination._id);
              const cardNumber = String(index + 1).padStart(2, "0");
              const isImgLoaded = Boolean(loadedMap[destination._id]);
              const isNextSpotlight = offset === 1;

              return (
                <article
                  key={`${destination._id}-${offset}`}
                  className={`hero-slider__card bg-zinc-900 ${
                    isNextSpotlight ? "is-next-up" : ""
                  }`}
                  style={{
                    "--card-stagger": `${(offset - 1) * 65}ms`,
                  }}
                  onClick={() => handleSelectIndex(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectIndex(index);
                    }
                  }}
                  aria-label={`Select destination ${destination.city}, ${destination.country}`}
                >
                  <img
                    src={destination.image || FALLBACK_CITY_IMAGE}
                    alt={destination.city}
                    className={`hero-slider__card-img transition-opacity duration-300 ${
                      isImgLoaded ? "is-loaded" : "is-loading"
                    }`}
                    loading="lazy"
                    decoding="async"
                    onLoad={() =>
                      setLoadedMap((prev) =>
                        prev[destination._id]
                          ? prev
                          : { ...prev, [destination._id]: true }
                      )
                    }
                    onError={(e) => {
                      if (e.target.src !== FALLBACK_CITY_IMAGE) {
                        e.target.src = FALLBACK_CITY_IMAGE;
                      }
                      setLoadedMap((prev) =>
                        prev[destination._id]
                          ? prev
                          : { ...prev, [destination._id]: true }
                      );
                    }}
                  />
                  <div className="hero-slider__card-Overlay">
                    <div className="hero-slider__card-top">
                      <span className="hero-slider__card-index">
                        {cardNumber}
                      </span>
                      <button
                        type="button"
                        className={`hero-slider__card-fav ${
                          isSaved ? "is-saved" : ""
                        }`}
                        onClick={(e) => toggleBookmark(e, destination._id)}
                        title={
                          isSaved ? "Saved to favorites" : "Save destination"
                        }
                        aria-label={`Save ${destination.city}`}
                      >
                        <span className="material-icons">
                          {isSaved ? "favorite" : "favorite_border"}
                        </span>
                      </button>
                    </div>

                    <div className="hero-slider__card-bottom">
                      <span className="hero-slider__card-country">
                        {destination.country}
                      </span>
                      <h3 className="hero-slider__card-title">
                        {destination.city}
                      </h3>
                      <span className="hero-slider__card-cta">
                        <span>Discover</span>
                        <span
                          className="material-icons"
                          style={{ fontSize: "0.9rem" }}
                        >
                          east
                        </span>
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Navigation Controls: Prev/Next Arrows, Dots & Linear Auto-Play Progress Bar */}
      <div className="hero-slider__footer">
        <div className="hero-slider__nav-buttons">
          <button
            type="button"
            className="hero-slider__nav-btn"
            onClick={handlePrev}
            aria-label="Previous destination"
            title="Previous"
          >
            <span className="material-icons">west</span>
          </button>
          <button
            type="button"
            className="hero-slider__nav-btn"
            onClick={handleNext}
            aria-label="Next destination"
            title="Next"
          >
            <span className="material-icons">east</span>
          </button>
        </div>

        <div className="hero-slider__dots" role="tablist">
          {destinations.map((dest, idx) => (
            <button
              key={dest._id || idx}
              type="button"
              role="tab"
              aria-selected={idx === safeActiveIndex}
              aria-label={`Go to ${dest.city}`}
              className={`hero-slider__dot ${
                idx === safeActiveIndex ? "is-active" : ""
              }`}
              onClick={() => handleSelectIndex(idx)}
            />
          ))}
        </div>

        <div className="hero-slider__progress-line" aria-hidden="true">
          <div
            key={`progress-${safeActiveIndex}-${cycleId}`}
            className="hero-slider__progress-bar"
          />
        </div>
      </div>
    </section>
  );
}
