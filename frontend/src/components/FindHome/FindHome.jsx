import Header from "../Header/Header";
import { useEffect, useState } from "react";
import styles from "./findHome.module.css";
import { FilterItem } from "./FilterItem";
import { HomeCard } from "../HomeComponents/seondComponent/components/HomeCard";
import homes_store from "../../stores/homes_store.js";
import homesStore from "../../stores/homes_store.js";
import { Footer } from "../HomeComponents/footer/Footer.jsx";
import locationHierarchy from "../../stores/regs.json";
import { useLocation } from "react-router-dom";

const FindHome = () => {
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

  const filterToEnglish = {
    Կոմերցիոն: "commercial",
    Ամառանոց: "cottage",
    Բնակարան: "apartment",
    Տուն: "house",
    Թաունհաուս: "town_house",
    Վաճառք: "sale",
    Վարձակալություն: "rent",
    "Երկարաժամկետ վարձակալություն": "long_rent",
    "Կարճաժամկետ վարձակալություն": "short_rent",
  };

  const locationTypes = Object.values(
    locationHierarchy.location_hierarchy.LocationType
  );

  const getFilterParams = () => {
    const params = {};
    if (priceRange.from) params.price_min = priceRange.from;
    if (priceRange.to) params.price_max = priceRange.to;

    const propertyTypes =
      selectedFiltersState["Գույքի տեսակ"]?.map(
        (i) =>
          filterToEnglish[
            ["Կոմերցիոն", "Ամառանոց", "Բնակարան", "Տուն", "Թաունհաուս"][i]
          ]
      ) || [];

    const advTypes =
      selectedFiltersState["Գործարքի տեսակ"]?.map(
        (i) =>
          filterToEnglish[
            [
              "Վաճառք",
              "Վարձակալություն",
              "Երկարաժամկետ վարձակալություն",
              "Կարճաժամկետ վարձակալություն",
            ][i]
          ]
      ) || [];

    if (propertyTypes.length > 0)
      params.property_type = propertyTypes.join(",");
    if (advTypes.length > 0) params.adv_type = advTypes.join(",");
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

  // 1️⃣ On mount, apply passed filters (runs only once)
  useEffect(() => {
    if (!passedFilters || initializedFromPassed) return;

    const newFilters = {};

    if (passedFilters.deal) {
      const dealIndex = [
        "Վաճառք",
        "Վարձակալություն",
        "Երկարաժամկետ վարձակալություն",
        "Կարճաժամկետ վարձակալություն",
      ].indexOf(passedFilters.deal);
      if (dealIndex >= 0) {
        newFilters["Գործարքի տեսակ"] = [dealIndex];
      }
    }

    if (passedFilters.type) {
      const typeIndex = [
        "Կոմերցիոն",
        "Ամառանոց",
        "Բնակարան",
        "Տուն",
        "Թաունհաուս",
      ].indexOf(passedFilters.type);
      if (typeIndex >= 0) {
        newFilters["Գույքի տեսակ"] = [typeIndex];
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

  // 2️⃣ Fetch homes when filters change
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
          <h1 className={styles.title}>Ֆիլտրեր</h1>
          <p onClick={handleClearFilter} className={styles.clearTxt}>
            Մաքրել բոլոր ֆիլտրերը
          </p>

          <div className={styles.filters}>
            <FilterItem
              title="Գործարքի տեսակ"
              options={[
                "Վաճառք",
                "Վարձակալություն",
                "Երկարաժամկետ վարձակալություն",
                "Կարճաժամկետ վարձակալություն",
              ]}
              selectedIndexes={selectedFiltersState["Գործարքի տեսակ"] || []}
              onSelect={(index) =>
                handleFilterSelection("Գործարքի տեսակ", index)
              }
            />

            <FilterItem
              title="Գույքի տեսակ"
              options={[
                "Կոմերցիոն",
                "Ամառանոց",
                "Բնակարան",
                "Տուն",
                "Թաունհաուս",
              ]}
              selectedIndexes={selectedFiltersState["Գույքի տեսակ"] || []}
              onSelect={(index) => handleFilterSelection("Գույքի տեսակ", index)}
            />

            <FilterItem
              title="Տարածաշրջան"
              options={locationTypes.map((l) => l.display)}
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

            {/* Armenian Region */}
            {locationType === "Հայաստան" && (
              <FilterItem
                title="Մարզ"
                options={Object.values(
                  locationTypes.find((l) => l.enum_value === "Հայաստան").regions
                ).map((r) => r.display)}
                selectedIndexes={
                  subLocation
                    ? [
                        Object.values(
                          locationTypes.find((l) => l.enum_value === "Հայաստան")
                            .regions
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

            {/* Foreign Region */}
            {locationType === "Արտերկիր" && (
              <FilterItem
                title="Աշխարհամաս"
                options={Object.values(
                  locationTypes.find((l) => l.enum_value === "Արտերկիր")
                    .world_regions
                ).map((r) => r.display)}
                selectedIndexes={
                  subLocation
                    ? [
                        Object.values(
                          locationTypes.find((l) => l.enum_value === "Արտերկիր")
                            .world_regions
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

            {/* Armenian City */}
            {locationType === "Հայաստան" && subLocation && (
              <FilterItem
                title="Քաղաք"
                options={Object.values(
                  locationTypes.find((l) => l.enum_value === "Հայաստան").regions
                )
                  .find((r) => r.enum_value === subLocation)
                  .cities.map((c) => c.display)}
                selectedIndexes={
                  finalLocation
                    ? [
                        Object.values(
                          locationTypes.find((l) => l.enum_value === "Հայաստան")
                            .regions
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

            {/* Foreign Country */}
            {locationType === "Արտերկիր" && subLocation && (
              <FilterItem
                title="Երկիր"
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
                          locationTypes.find((l) => l.enum_value === "Արտերկիր")
                            .world_regions
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
                  ).find((r) => r.enum_value === subLocation).countries[index];
                  setFinalLocation(selectedCountry.enum_value);
                }}
              />
            )}

            <label>Սենյակների քանակ</label>
            <div className={styles.priceInputs}>
              <input
                type="number"
                value={rooms || ""}
                onChange={(e) => setRooms(e.target.value)}
              />
            </div>

            {/* Price */}
            <div className={styles.priceFilter}>
              <label>Գին</label>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  placeholder="Սկսած"
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
                  placeholder="Մինչև"
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
              <p>Տվյալներ չեն գտնվել...</p>
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
