const initialState = {
  cities: [],
  city: {},
  citiesFilter: [],
};

const citiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "fetch": {
      const list = Array.isArray(action.send) ? action.send : [];
      return {
        ...state,
        cities: list,
        citiesFilter: list,
        citiesAux: list,
      };
    }
    case "fetchOne":
      return {
        ...state,
        city: action.send || {},
      };
    case "delete":
      return {
        ...state,
        cities: Array.isArray(action.send) ? action.send : [],
      };
    case "chargeCities": {
      const cities = [...state.cities];
      if (action.send) {
        cities.push(action.send);
      }
      return {
        ...state,
        cities,
        aux: [...cities],
      };
    }
    case "filtro": {
      const sourceCities = Array.isArray(action.send?.cities)
        ? action.send.cities
        : [];
      const searchVal = String(action.send?.value || "")
        .toLowerCase()
        .trim();
      const filtrado = sourceCities.filter((data) => {
        const cityName = String(data?.city || "").toLowerCase();
        const countryName = String(data?.country || "").toLowerCase();
        return (
          cityName.startsWith(searchVal) ||
          cityName.includes(searchVal) ||
          countryName.includes(searchVal)
        );
      });
      return {
        ...state,
        citiesFilter: filtrado,
      };
    }
    default:
      return state;
  }
};

export default citiesReducer;
