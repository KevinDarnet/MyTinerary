import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import citiesActions from "../Redux/actions/citiesActions";
import itinerariesActions from "../Redux/actions/itinerariesActions";
import Swal from "sweetalert2";
import "../Styles/itineraryDetails.css";
import Activities from "./Activities";
import Comments from "../Comments/Comments";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

const FALLBACK_ITINERARY_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80";

const renderPrice = (priceLevel) => {
  const totalLevels = 5;
  const activeCount = Math.max(
    1,
    Math.min(totalLevels, parseInt(priceLevel, 10) || 1)
  );

  return (
    <span
      className="itinerary-meta-pill itinerary-meta-pill--price"
      title={`Price Level: ${activeCount}/${totalLevels}`}
    >
      <span className="material-icons">payments</span>
      <span className="text-xs uppercase tracking-wider text-zinc-300 font-medium">
        Price:
      </span>
      <div className="itinerary-price-scale flex items-center">
        {[...Array(totalLevels)].map((_, i) => (
          <span
            key={i}
            className={`itinerary-price-char text-sm font-bold transition-colors ${
              i < activeCount
                ? "is-active text-emerald-400 font-black"
                : "is-inactive text-zinc-600 opacity-35"
            }`}
          >
            $
          </span>
        ))}
      </div>
      <span className="itinerary-price-fraction text-[11px] text-zinc-400 font-semibold ml-1">
        ({activeCount}/{totalLevels})
      </span>
    </span>
  );
};

const DetailsCityId = (props) => {
  const cambio = useSelector((state) => state.comentarioReducer.cambio);
  const [reload, setReload] = useState(false);
  const [collapsedMap, setCollapsedMap] = useState({});
  const [loadedMediaMap, setLoadedMediaMap] = useState({});
  const { city } = props;
  const { id } = useParams();

  async function likesOrDislikes(itineraryId) {
    await props.likeDislike(itineraryId);
    setReload((prev) => !prev);
  }

  function noUser() {
    Swal.fire({
      icon: "warning",
      title: "Please sign in to like this itinerary",
      background: "#0f172a",
      color: "#ffffff",
      showConfirmButton: false,
      timer: 1800,
    });
  }

  function toggleItinerarySection(itinId) {
    setCollapsedMap((prev) => ({
      ...prev,
      [itinId]: !prev[itinId],
    }));
  }

  useEffect(() => {
    if (id) {
      props.findOneCity(id);
      props.itinerarioPorCiudad(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, reload, cambio]);

  const itinerariesList = Array.isArray(props.itineraries)
    ? props.itineraries
    : [];

  const language = city?.language || city?.lenguage || "English";

  return (
    <div className="details-page min-h-screen w-full bg-[#070b12] pt-24 pb-24">
      <div>
        {/* 1. City / Destination Wide Hero Banner */}
        <section className="details-hero">
          {city?.image && (
            <div
              className="details-hero__bg"
              style={{ backgroundImage: `url("${city.image}")` }}
            />
          )}
          <div className="details-hero__overlay" />

          <div className="details-hero__inner">
            <Link to="/Cities" className="details-hero__back">
              <span className="material-icons" style={{ fontSize: "1.05rem" }}>
                arrow_back
              </span>
              <span>Back to Cities</span>
            </Link>

            {city && city._id && (
              <>
                <div className="details-hero__badges">
                  <span className="details-hero__country-pill">
                    {city.flag ? (
                      <img
                        src={city.flag}
                        alt={city.country}
                        className="details-hero__flag"
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
                    <span>{city.country}</span>
                  </span>

                  {language && (
                    <span className="details-hero__chip">
                      <span className="material-icons">translate</span>
                      <span>{language}</span>
                    </span>
                  )}

                  {city.coin && (
                    <span className="details-hero__chip">
                      <span className="material-icons">payments</span>
                      <span>{city.coin}</span>
                    </span>
                  )}
                </div>

                <h1 className="details-hero__title">{city.city}</h1>

                {city.description && (
                  <p className="details-hero__desc">{city.description}</p>
                )}
              </>
            )}
          </div>
        </section>

        {/* 2. Itineraries, Activities & Comments */}
        <main className="details-main">
          <div className="details-section-header">
            <div className="details-section-title-wrap">
              <span
                className="material-icons"
                style={{ fontSize: "1.5rem", color: "#fbbf24" }}
              >
                map
              </span>
              <h2 className="details-section-title">Curated Itineraries</h2>
            </div>
            <span className="details-section-count">
              {itinerariesList.length}{" "}
              {itinerariesList.length === 1
                ? "Itinerary Available"
                : "Itineraries Available"}
            </span>
          </div>

          {itinerariesList.length > 0 ? (
            <div className="itineraries-stack">
              {itinerariesList.map((itinerary, index) => {
                const itinKey = itinerary?._id || String(index);
                const isCollapsed = Boolean(collapsedMap[itinKey]);
                const likesArr = Array.isArray(itinerary?.likes)
                  ? itinerary.likes.map(String)
                  : [];
                const isLiked =
                  Boolean(props.user?.id) &&
                  likesArr.includes(String(props.user.id));
                const hashtags = Array.isArray(itinerary?.hashtag)
                  ? itinerary.hashtag
                  : [];

                const authorName =
                  itinerary?.username ||
                  itinerary?.userName ||
                  itinerary?.user?.fullName ||
                  itinerary?.user?.username ||
                  itinerary?.user?.name ||
                  "Local Insider";

                const avatarSrc =
                  (typeof itinerary?.userimage === "string" &&
                    itinerary.userimage.trim()) ||
                  (typeof itinerary?.userImage === "string" &&
                    itinerary.userImage.trim()) ||
                  (typeof itinerary?.imageUser === "string" &&
                    itinerary.imageUser.trim()) ||
                  (typeof itinerary?.user?.image === "string" &&
                    itinerary.user.image.trim()) ||
                  (typeof itinerary?.user?.picture === "string" &&
                    itinerary.user.picture.trim()) ||
                  FALLBACK_AVATAR;

                return (
                  <article className="itinerary-card" key={itinKey}>
                    {/* Author & Like Bar */}
                    <div className="itinerary-card__top">
                      <div className="itinerary-author">
                        <div className="itinerary-author__avatar-wrap bg-zinc-800">
                          <img
                            className="itinerary-author__avatar"
                            src={avatarSrc}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              if (e.target.src !== FALLBACK_AVATAR) {
                                e.target.src = FALLBACK_AVATAR;
                              }
                            }}
                          />
                        </div>
                        <div className="itinerary-author__info">
                          <h3 className="itinerary-author__name">
                            {authorName}
                          </h3>
                          <span className="itinerary-author__role">
                            Local Insider Guide
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`itinerary-like-btn ${
                          isLiked ? "is-liked" : ""
                        }`}
                        onClick={() =>
                          props.user
                            ? likesOrDislikes(itinerary._id)
                            : noUser()
                        }
                        title={
                          isLiked ? "Unlike itinerary" : "Like this itinerary"
                        }
                        aria-label="Like itinerary"
                      >
                        <span className="material-icons">
                          {isLiked ? "favorite" : "favorite_border"}
                        </span>
                        <span>{likesArr.length}</span>
                      </button>
                    </div>

                    {/* Itinerary Overview */}
                    <div className="itinerary-card__overview">
                      <div className="itinerary-card__media bg-zinc-900">
                        <img
                          className={`itinerary-card__img transition-opacity duration-300 ${
                            loadedMediaMap[itinKey] ? "is-loaded" : "is-loading"
                          }`}
                          src={itinerary?.image || FALLBACK_ITINERARY_IMAGE}
                          alt={itinerary?.name || "Itinerary"}
                          loading="lazy"
                          decoding="async"
                          onLoad={() =>
                            setLoadedMediaMap((prev) =>
                              prev[itinKey] ? prev : { ...prev, [itinKey]: true }
                            )
                          }
                          onError={(e) => {
                            if (e.target.src !== FALLBACK_ITINERARY_IMAGE) {
                              e.target.src = FALLBACK_ITINERARY_IMAGE;
                            }
                            setLoadedMediaMap((prev) =>
                              prev[itinKey] ? prev : { ...prev, [itinKey]: true }
                            );
                          }}
                        />
                      </div>

                      <div className="itinerary-card__info">
                        <div>
                          <h3 className="itinerary-card__title">
                            {itinerary?.name}
                          </h3>
                          <p className="itinerary-card__desc">
                            {itinerary?.details}
                          </p>
                        </div>

                        <div className="itinerary-meta-grid">
                          <span className="itinerary-meta-pill">
                            <span className="material-icons">schedule</span>
                            <span>Duration: {itinerary?.duration}</span>
                          </span>

                          {renderPrice(itinerary?.price)}
                        </div>

                        {hashtags.length > 0 && (
                          <div className="itinerary-hashtags">
                            {hashtags.map((tag, idx) => (
                              <span className="itinerary-hashtag" key={idx}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Toggle Button for Activities & Comments */}
                    <div className="itinerary-card__toggle-bar">
                      <button
                        type="button"
                        className="itinerary-toggle-btn"
                        onClick={() => toggleItinerarySection(itinKey)}
                        aria-expanded={!isCollapsed}
                      >
                        <span>
                          {isCollapsed
                            ? "Show Activities & Comments"
                            : "Hide Activities & Comments"}
                        </span>
                        <span className="material-icons">
                          {isCollapsed ? "expand_more" : "expand_less"}
                        </span>
                      </button>
                    </div>

                    {/* Activities & Comments Section (Open by default) */}
                    {!isCollapsed && (
                      <div className="itinerary-card__expandable">
                        <Activities id={itinerary._id} />

                        <Comments
                          user={props.user}
                          itineraryID={itinerary._id}
                          comments={itinerary.comments}
                        />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="details-empty">
              <div className="details-empty__icon">
                <span className="material-icons" style={{ fontSize: "2rem" }}>
                  explore_off
                </span>
              </div>
              <h3 className="details-empty__title">
                No itineraries found for this city yet
              </h3>
              <p className="details-empty__text">
                Our local insiders are currently crafting new experiences for{" "}
                <strong>{city?.city || "this destination"}</strong>. Explore
                other destinations in the meantime!
              </p>
              <Link to="/Cities" className="details-empty__btn">
                <span className="material-icons" style={{ fontSize: "1.1rem" }}>
                  travel_explore
                </span>
                <span>Explore All Destinations</span>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    city: state.Data.city,
    itineraries: state.itinerariesReducers.itineraries,
    user: state.userReducer.user,
  };
};

const mapDispatchToProps = {
  findOneCity: citiesActions.findOneCity,
  itinerarioPorCiudad: itinerariesActions.itinerarioPorCiudad,
  likeDislike: itinerariesActions.likeDislike,
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailsCityId);
