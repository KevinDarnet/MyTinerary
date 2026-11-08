import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import activitiesActions from "../Redux/actions/activitiesActions";

const FALLBACK_ACTIVITY_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80";

function Activities(props) {
  const [activities, setActivities] = useState([]);
  const [loadedMap, setLoadedMap] = useState({});
  const { id } = props;

  useEffect(() => {
    let isMounted = true;
    if (id) {
      props.findOneActivityPerItinerary(id).then((res) => {
        if (isMounted) {
          setActivities(res?.response || []);
        }
      });
    }
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="activities-section">
      <div className="activities-section__header">
        <span
          className="material-icons"
          style={{ fontSize: "1.2rem", color: "#fbbf24" }}
        >
          local_activity
        </span>
        <h3 className="activities-section__title">Featured Activities</h3>
      </div>

      {Array.isArray(activities) && activities.length > 0 ? (
        <div className="activities-grid">
          {activities.map((activity, index) => {
            const numberBadge = `Activity ${String(index + 1).padStart(
              2,
              "0"
            )}`;
            const actKey = activity._id || String(index);
            const isImgLoaded = Boolean(loadedMap[actKey]);
            return (
              <article
                className="activity-card bg-zinc-900"
                key={actKey}
              >
                <img
                  className={`activity-card__img transition-opacity duration-300 ${
                    isImgLoaded ? "is-loaded" : "is-loading"
                  }`}
                  src={activity.image || FALLBACK_ACTIVITY_IMAGE}
                  alt={activity.name || "Activity"}
                  loading="lazy"
                  decoding="async"
                  onLoad={() =>
                    setLoadedMap((prev) =>
                      prev[actKey] ? prev : { ...prev, [actKey]: true }
                    )
                  }
                  onError={(e) => {
                    if (e.target.src !== FALLBACK_ACTIVITY_IMAGE) {
                      e.target.src = FALLBACK_ACTIVITY_IMAGE;
                    }
                    setLoadedMap((prev) =>
                      prev[actKey] ? prev : { ...prev, [actKey]: true }
                    );
                  }}
                />
                <div className="activity-card__overlay">
                  <span className="activity-card__badge">{numberBadge}</span>
                  <div className="activity-card__body">
                    <h4 className="activity-card__title">{activity.name}</h4>
                    {activity.description && (
                      <p className="activity-card__desc">
                        {activity.description}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="comments-empty">
          No activities listed for this itinerary yet.
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  oneActivityPerItinerary: state.activitiesReducer.oneActivityPerItinerary,
});

const mapDispatchToProps = {
  findOneActivityPerItinerary: activitiesActions.findOneActivityPerItinerary,
};

export default connect(mapStateToProps, mapDispatchToProps)(Activities);
