import Header from "../Header/Header";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import styles from "./findHome.module.css";
import { FilterItem } from "./FilterItem";
import { HomeCard } from "../HomeComponents/seondComponent/components/HomeCard";
import homes_store from "../../stores/homes_store.js";
import homesStore from "../../stores/homes_store.js";
import { Footer } from "../HomeComponents/footer/Footer.jsx";
import locationHierarchy from "../../stores/regs.json";

const FindHome = () => {
  const { t } = useTranslation();

  const getHomes = homes_store((state) => state.getHomes);
  const homes = homes_store((state) => state.homes);
  const totalCount = homesStore((state) => state.totalCountOfHomes);

  const [selectedFiltersState, setSelectedFiltersState] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [priceRange, setPriceRange] = useState({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rooms, setRooms] = useState(null);
  const [locationType, setLocationType] = useState(null);
  const [subLocation, setSubLocation] = useState(null);
  const [finalLocation, setFinalLocation] = useState(null);
  const [initializedFromPassed, setInitializedFromPassed] = useState(false);

  const location = useLocation();
  const passedFilters = location.state?.filters || {};

  const DEAL_FILTER = "dealType";
  const PROPERTY_FILTER = "propertyType";

  const dealOptions = [
    { label: t("filters.deal.sale"), armValue: "Վաճառք", apiValue: "sale" },
    { label: t("filters.deal.rent"), armValue: "Վարձակալություն", apiValue: "rent" },
    {
      label: t("filters.deal.longTermRent"),
      armValue: "Երկարաժամկետ վարձակալություն",
      apiValue: "long_rent",
    },
    {
      label: t("filters.deal.shortTermRent"),
      armValue: "Կարճաժամկետ վարձակալություն",
      apiValue: "short_rent",
    },
  ];

  const propertyOptions = [
    { label: t("filters.type.commercial"), armValue: "Կոմերցիոն", apiValue: "commercial" },
    { label: t("filters.type.summerHouse"), armValue: "Ամառանոց", apiValue: "cottage" },
    { label: t("filters.type.apartment"), armValue: "Բնակարան", apiValue: "apartment" },
    { label: t("filters.type.house"), armValue: "Տուն", apiValue: "house" },
    { label: t("filters.type.townhouse"), armValue: "Թաունհաուս", apiValue: "town_house" },
  ];

  const locationTypeLabels = {
    Հայաստան: t("filters.region.armenia"),
    Արտերկիր: t("filters.region.abroad"),
  };

  const locationTypes = Object.values(
    locationHierarchy.location_hierarchy.LocationType
  );

  const getFilterParams = () => {
    const params = {};

    if (priceRange.from) params.price_min = priceRange.from;
    if (priceRange.to) params.price_max = priceRange.to;

    const propertyTypes =
      selectedFiltersState[PROPERTY_FILTER]?.map(
        (i) => propertyOptions[i].apiValue
      ) || [];

    const advTypes =
      selectedFiltersState[DEAL_FILTER]?.map((i) => dealOptions[i].apiValue) ||
      [];

    if (propertyTypes.length > 0) {
      params.property_type = propertyTypes.join(",");
    }

    if (advTypes.length > 0) {
      params.adv_type = advTypes.join(",");
    }

    if (rooms) params.rooms = rooms;
    if (locationType) params.location_type = locationType;

    if (locationType === "Հայաստան") {
      if (subLocation) params.armenian_region = subLocation;
      if (finalLocation) params.armenian_city = finalLocation;
    }

    if (locationType === "Արտերկիր") {
      if (subLocation) params.world_region = subLocation;
      if (finalLocation) params.foreign_country = finalLocation;
    }

    return params;
  };

  useEffect(() => {
    if (!passedFilters || initializedFromPassed) return;

    const newFilters = {};

    if (passedFilters.deal) {
      const dealIndex = dealOptions.findIndex(
        (item) =>
          item.armValue === passedFilters.deal ||
          item.apiValue === passedFilters.deal ||
          item.label === passedFilters.deal
      );

      if (dealIndex >= 0) {
        newFilters[DEAL_FILTER] = [dealIndex];
      }
    }

    if (passedFilters.type) {
      const typeIndex = propertyOptions.findIndex(
        (item) =>
          item.armValue === passedFilters.type ||
          item.apiValue === passedFilters.type ||
          item.label === passedFilters.type
      );

      if (typeIndex >= 0) {
        newFilters[PROPERTY_FILTER] = [typeIndex];
      }
    }

    if (passedFilters.region) {
      const regionIndex = ["Հայաստան", "Արտերկիր"].indexOf(
        passedFilters.region
      );

      if (regionIndex >= 0) {
        setLocationType(["Հայաստան", "Արտերկիր"][regionIndex]);
      }
    }

    setSelectedFiltersState(newFilters);
    setInitializedFromPassed(true);
  }, [passedFilters, initializedFromPassed]);

  useEffect(() => {
    if (
      initializedFromPassed &&
      (Object.keys(selectedFiltersState).length > 0 ||
        priceRange.from ||
        priceRange.to ||
        rooms ||
        locationType ||
        subLocation ||
        finalLocation)
    ) {
      getHomes(true, getFilterParams());
    }
  }, [
    initializedFromPassed,
    selectedFiltersState,
    priceRange,
    rooms,
    locationType,
    subLocation,
    finalLocation,
  ]);

  const totalPages = Math.ceil(totalCount / 12);

  const handleClearFilter = () => {
    setSelectedFiltersState({});
    setSelectedCurrency(null);
    setPriceRange({ from: "", to: "" });
    setRooms(null);
    setLocationType(null);
    setSubLocation(null);
    setFinalLocation(null);
    getHomes(true, {});
  };

  const handleFilterSelection = (category, index) => {
    setSelectedFiltersState((prev) => ({
      ...prev,
      [category]: [index],
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    getHomes(false, { ...getFilterParams(), page });
  };

  return (
    <>
      <div>
        <Header />

        <div className={styles.mainContainer}>
          <div className={styles.filterContainer}>
            <h1 className={styles.title}>{t("findHome.title")}</h1>

            <p onClick={handleClearFilter} className={styles.clearTxt}>
              {t("findHome.clearAll")}
            </p>

            <div className={styles.filters}>
              <FilterItem
                title={t("findHome.dealType")}
                options={dealOptions.map((item) => item.label)}
                selectedIndexes={selectedFiltersState[DEAL_FILTER] || []}
                onSelect={(index) => handleFilterSelection(DEAL_FILTER, index)}
              />

              <FilterItem
                title={t("findHome.propertyType")}
                options={propertyOptions.map((item) => item.label)}
                selectedIndexes={selectedFiltersState[PROPERTY_FILTER] || []}
                onSelect={(index) =>
                  handleFilterSelection(PROPERTY_FILTER, index)
                }
              />

              <FilterItem
                title={t("findHome.location")}
                options={locationTypes.map(
                  (l) => locationTypeLabels[l.enum_value] || l.display
                )}
                selectedIndexes={
                  locationType
                    ? [
                        locationTypes.findIndex(
                          (l) => l.enum_value === locationType
                        ),
                      ]
                    : []
                }
                onSelect={(index) => {
                  const selected = locationTypes[index];
                  setLocationType(selected.enum_value);
                  setSubLocation(null);
                  setFinalLocation(null);
                }}
              />

              {locationType === "Հայաստան" && (
                <FilterItem
                  title={t("findHome.region")}
                  options={Object.values(
                    locationTypes.find((l) => l.enum_value === "Հայաստան")
                      .regions
                  ).map((r) => r.display)}
                  selectedIndexes={
                    subLocation
                      ? [
                          Object.values(
                            locationTypes.find(
                              (l) => l.enum_value === "Հայաստան"
                            ).regions
                          ).findIndex((r) => r.enum_value === subLocation),
                        ]
                      : []
                  }
                  onSelect={(index) => {
                    const selectedRegion = Object.values(
                      locationTypes.find((l) => l.enum_value === "Հայաստան")
                        .regions
                    )[index];

                    setSubLocation(selectedRegion.enum_value);
                    setFinalLocation(null);
                  }}
                />
              )}

              {locationType === "Արտերկիր" && (
                <FilterItem
                  title={t("findHome.worldRegion")}
                  options={Object.values(
                    locationTypes.find((l) => l.enum_value === "Արտերկիր")
                      .world_regions
                  ).map((r) => r.display)}
                  selectedIndexes={
                    subLocation
                      ? [
                          Object.values(
                            locationTypes.find(
                              (l) => l.enum_value === "Արտերկիր"
                            ).world_regions
                          ).findIndex((r) => r.enum_value === subLocation),
                        ]
                      : []
                  }
                  onSelect={(index) => {
                    const selectedContinent = Object.values(
                      locationTypes.find((l) => l.enum_value === "Արտերկիր")
                        .world_regions
                    )[index];

                    setSubLocation(selectedContinent.enum_value);
                    setFinalLocation(null);
                  }}
                />
              )}

              {locationType === "Հայաստան" && subLocation && (
                <FilterItem
                  title={t("findHome.city")}
                  options={Object.values(
                    locationTypes.find((l) => l.enum_value === "Հայաստան")
                      .regions
                  )
                    .find((r) => r.enum_value === subLocation)
                    .cities.map((c) => c.display)}
                  selectedIndexes={
                    finalLocation
                      ? [
                          Object.values(
                            locationTypes.find(
                              (l) => l.enum_value === "Հայաստան"
                            ).regions
                          )
                            .find((r) => r.enum_value === subLocation)
                            .cities.findIndex(
                              (c) => c.enum_value === finalLocation
                            ),
                        ]
                      : []
                  }
                  onSelect={(index) => {
                    const selectedCity = Object.values(
                      locationTypes.find((l) => l.enum_value === "Հայաստան")
                        .regions
                    ).find((r) => r.enum_value === subLocation).cities[index];

                    setFinalLocation(selectedCity.enum_value);
                  }}
                />
              )}

              {locationType === "Արտերկիր" && subLocation && (
                <FilterItem
                  title={t("findHome.country")}
                  options={Object.values(
                    locationTypes.find((l) => l.enum_value === "Արտերկիր")
                      .world_regions
                  )
                    .find((r) => r.enum_value === subLocation)
                    .countries.map((c) => c.display)}
                  selectedIndexes={
                    finalLocation
                      ? [
                          Object.values(
                            locationTypes.find(
                              (l) => l.enum_value === "Արտերկիր"
                            ).world_regions
                          )
                            .find((r) => r.enum_value === subLocation)
                            .countries.findIndex(
                              (c) => c.enum_value === finalLocation
                            ),
                        ]
                      : []
                  }
                  onSelect={(index) => {
                    const selectedCountry = Object.values(
                      locationTypes.find((l) => l.enum_value === "Արտերկիր")
                        .world_regions
                    ).find((r) => r.enum_value === subLocation).countries[
                      index
                    ];

                    setFinalLocation(selectedCountry.enum_value);
                  }}
                />
              )}

              <label>{t("findHome.rooms")}</label>

              <div className={styles.priceInputs}>
                <input
                  type="number"
                  value={rooms || ""}
                  onChange={(e) => setRooms(e.target.value)}
                />
              </div>

              <div className={styles.priceFilter}>
                <label>{t("findHome.price")}</label>

                <div className={styles.priceInputs}>
                  <input
                    type="number"
                    placeholder={t("findHome.priceFrom")}
                    value={priceRange.from}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        from: e.target.value,
                      }))
                    }
                  />

                  <input
                    type="number"
                    placeholder={t("findHome.priceTo")}
                    value={priceRange.to}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        to: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.homesWrapper}>
            {homes.length > 0 ? (
              <>
                <div className={styles.homesContainer}>
                  {homes.map((home) => (
                    <HomeCard key={home.uuid} home={home} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className={styles.paginationWrapper}>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        className={`${styles.pageButton} ${
                          currentPage === i + 1 ? styles.activePage : ""
                        }`}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className={styles.emptyState}>
                <p>{t("findHome.noData")}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FindHome;