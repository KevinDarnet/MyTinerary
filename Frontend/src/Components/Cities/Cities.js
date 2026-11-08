import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import citiesActions from "../Redux/actions/citiesActions";
import "./Cities.css";

const FALLBACK_CITY_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80";

function Cities(props) {
  const [busqueda, setBusqueda] = useState("");
  const [loadedMap, setLoadedMap] = useState({});
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const raw = localStorage.getItem("mytinerary_saved_destinations");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setBusqueda(val);
    props.filterCity(props.cities, val);
  };

  const handleResetSearch = () => {
    setBusqueda("");
    props.filterCity(props.cities, "");
  };

  const toggleFavorite = (e, cityId) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedIds((prev) => {
      const exists = prev.includes(cityId);
      const next = exists
        ? prev.filter((id) => id !== cityId)
        : [...prev, cityId];
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
  };

  useEffect(() => {
    props.fetchearCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredList = Array.isArray(props.citiesFilter)
    ? props.citiesFilter
    : [];

  return (
    <div className="cities-page min-h-screen w-full bg-[#070b12] pt-24 pb-24">
      <div>
        {/* Header & Glassmorphic Search Bar */}
        <section className="cities-hero">
          <div className="cities-hero__inner">
            <span className="cities-hero__eyebrow">
              <span className="material-icons" style={{ fontSize: "1rem" }}>
                travel_explore
              </span>
              <span>Global Destination Catalog</span>
            </span>

            <h1 className="cities-hero__title">Look for your next adventure</h1>
            <p className="cities-hero__subtitle">
              Explore unique destinations around the world and discover
              itineraries crafted by local insiders.
            </p>

            <div className="cities-search">
              <div className="cities-search__box">
                <span className="material-icons cities-search__icon">
                  search
                </span>
                <input
                  type="text"
                  className="cities-search__input"
                  placeholder="Search city or country (e.g. Pekin, Giza, Rome...)"
                  value={busqueda}
                  onChange={handleSearchChange}
                  aria-label="Search city"
                />
                {busqueda && (
                  <button
                    type="button"
                    className="cities-search__clear"
                    onClick={handleResetSearch}
                    title="Clear search"
                    aria-label="Clear search"
                  >
                    <span
                      className="material-icons"
                      style={{ fontSize: "1.1rem" }}
                    >
                      close
                    </span>
                  </button>
                )}
              </div>
              <div className="cities-search__meta">
                {filteredList.length}{" "}
                {filteredList.length === 1
                  ? "destination found"
                  : "destinations available"}
              </div>
            </div>
          </div>
        </section>

        {/* Destinations Cards Grid */}
        <main className="cities-main">
          {filteredList.length > 0 ? (
            <div className="cities-grid">
              {filteredList.map((ciudad) => {
                const isSaved = savedIds.includes(ciudad._id);
                const language = ciudad.language || ciudad.lenguage || "English";
                const isImgLoaded = Boolean(loadedMap[ciudad._id]);

                return (
                  <article className="city-card bg-zinc-900" key={ciudad._id}>
                    <img
                      className={`city-card__img transition-opacity duration-300 ${
                        isImgLoaded ? "is-loaded" : "is-loading"
                      }`}
                      src={ciudad.image || FALLBACK_CITY_IMAGE}
                      alt={ciudad.city || "City"}
                      loading="lazy"
                      decoding="async"
                      onLoad={() =>
                        setLoadedMap((prev) =>
                          prev[ciudad._id] ? prev : { ...prev, [ciudad._id]: true }
                        )
                      }
                      onError={(e) => {
                        if (e.target.src !== FALLBACK_CITY_IMAGE) {
                          e.target.src = FALLBACK_CITY_IMAGE;
                        }
                        setLoadedMap((prev) =>
                          prev[ciudad._id] ? prev : { ...prev, [ciudad._id]: true }
                        );
                      }}
                    />
                    <div className="city-card__overlay" />

                    <div className="city-card__top">
                      <span className="city-card__country-pill">
                        {ciudad.flag ? (
                          <img
                            src={ciudad.flag}
                            alt={ciudad.country}
                            className="city-card__flag"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <span
                            className="material-icons"
                            style={{ fontSize: "0.95rem" }}
                          >
                            place
                          </span>
                        )}
                        <span>{ciudad.country}</span>
                      </span>

                      <button
                        type="button"
                        className={`city-card__fav-btn ${
                          isSaved ? "is-saved" : ""
                        }`}
                        onClick={(e) => toggleFavorite(e, ciudad._id)}
                        title={
                          isSaved ? "Remove from favorites" : "Save destination"
                        }
                        aria-label={`Save ${ciudad.city}`}
                      >
                        <span
                          className="material-icons"
                          style={{ fontSize: "1.1rem" }}
                        >
                          {isSaved ? "favorite" : "favorite_border"}
                        </span>
                      </button>
                    </div>

                    <div className="city-card__body">
                      <h2 className="city-card__title">{ciudad.city}</h2>

                      {ciudad.description && (
                        <p className="city-card__desc">{ciudad.description}</p>
                      )}

                      <div className="city-card__badges">
                        <span className="city-card__badge">
                          <span className="material-icons">translate</span>
                          <span>{language}</span>
                        </span>
                        <span className="city-card__badge">
                          <span className="material-icons">payments</span>
                          <span>{ciudad.coin}</span>
                        </span>
                      </div>

                      <Link
                        to={`/Details/${ciudad._id}`}
                        className="city-card__cta"
                      >
                        <span>View Itineraries</span>
                        <span
                          className="material-icons"
                          style={{ fontSize: "1.1rem" }}
                        >
                          arrow_forward
                        </span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="cities-empty">
              <div className="cities-empty__icon">
                <span
                  className="material-icons"
                  style={{ fontSize: "2rem" }}
                >
                  search_off
                </span>
              </div>
              <h2 className="cities-empty__title">
                No destinations found
              </h2>
              <p className="cities-empty__text">
                We couldn't find any cities matching{" "}
                <strong>"{busqueda}"</strong>. Try another search term or
                explore the full catalog.
              </p>
              <button
                type="button"
                className="cities-empty__btn"
                onClick={handleResetSearch}
              >
                Explore All Destinations
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    cities: state.Data.cities,
    citiesFilter: state.Data.citiesFilter,
  };
};

const mapDispatchToProps = {
  fetchearCities: citiesActions.fetchearCities,
  filterCity: citiesActions.filterCity,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cities);
