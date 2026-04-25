import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import homesStore from "../../stores/homes_store.js";
import styles from "./addHomeStyles.module.css";
import locationData from "../../stores/regs.json";

const PostHomeForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const homeToEdit = location.state?.homeToEdit;

  const locationType = watch("location_type");
  const selectedRegion = watch("armenian_region");
  const selectedContinent = watch("world_region");

  const locationTypes = Object.values(
    locationData.location_hierarchy.LocationType
  );

  useEffect(() => {
    if (homeToEdit) {
      Object.entries(homeToEdit).forEach(([key, value]) => {
        const stringValue =
          typeof value === "boolean" ? value.toString() : value;
        setValue(key, stringValue ?? "");
      });
    }
  }, [homeToEdit]);

  // Utility function to remove undefined/null/empty string values
  const cleanObject = (obj) => {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([, value]) => value !== undefined && value !== null && value !== ""
      )
    );
  };

  const onSubmit = async (data) => {
    try {
      let homeData = {
        adv_code: data.adv_code,
        adv_title: data.adv_title,
        adv_description: data.adv_description,
        price: parseFloat(data.price),
        price_type: data.price_type,
        property_type: data.property_type || "apartment",
        location_type: data.location_type,
        armenian_region: data.armenian_region,
        armenian_city: data.armenian_city,
        world_region: data.world_region,
        foreign_country: data.foreign_country,
        adv_type: data.adv_type,
        address: data.address,
        isHot: data.isHot === "true",
        total_area: parseFloat(data.total_area),
        grace_type: data.grace_type || "",
        rooms: parseInt(data.rooms || "0"),
        pet_policy: data.pet_policy || "",
        bathroom_count: parseInt(data.bathroom_count || "0"),
        ceiling_height: parseFloat(data.ceiling_height || "0"),
        floor: parseInt(data.floor || "0"),
        total_floors: parseInt(data.total_floors || "0"),
        renovation_type: data.renovation_type || "",
        appliances: data.appliances || "",
        hasElevator: data.hasElevator === "true",
        isNewConstruction: data.isNewConstruction === "true",
        hasBalcony: data.hasBalcony === "true",
        hasFurniture: data.hasFurniture === "true",
        includedUtiliies: data.includedUtiliies || "",
        withPrepayment: data.withPrepayment === "true",
      };
      if (data.location_type === "Արտերկիր") {
        delete homeData.armenian_region;
        delete homeData.armenian_city;
      } else if (data.location_type === "Հայաստան") {
        delete homeData.world_region;
        delete homeData.foreign_country;
      }

      // Clean the object from undefined/null/empty strings
      homeData = cleanObject(homeData);

      console.log(homeData);

      if (homeToEdit) {
        await homesStore.getState().editHome(homeToEdit.uuid, homeData);
        navigate(`/admin/upload-images/${homeToEdit.uuid}`, {
          state: { home: homeToEdit },
        });
      } else {
        const createdUuid = await homesStore.getState().createHome(homeData);
        navigate(`/admin/upload-images/${createdUuid}`);
      }
    } catch (err) {
      console.error("Error creating home:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <div className={styles.gridTwo}>
        <div className={styles.inputDiv}>
          <label>Տարածք</label>
          <select
            {...register("location_type", { required: "Տարածքը պարտադիր է" })}
          >
            <option value="">Ընտրել</option>
            {locationTypes.map((lt) => (
              <option key={lt.enum_value} value={lt.enum_value}>
                {lt.display}
              </option>
            ))}
          </select>
          {errors.location_type && (
            <p className={styles.errorText}>{errors.location_type.message}</p>
          )}
        </div>
        {locationType === "Հայաստան" && (
          <div className={styles.inputDiv}>
            <label>Մարզ</label>
            <select
              {...register("armenian_region", { required: "Մարզը պարտադիր է" })}
            >
              <option value="">Ընտրել</option>
              {Object.values(
                locationData.location_hierarchy.LocationType.ARMENIAN.regions
              ).map((region) => (
                <option key={region.enum_value} value={region.enum_value}>
                  {region.display}
                </option>
              ))}
            </select>
            {errors.region && (
              <p className={styles.errorText}>{errors.region.message}</p>
            )}
          </div>
        )}
        {locationType === "Հայաստան" && selectedRegion && (
          <div className={styles.inputDiv}>
            <label>Քաղաք</label>
            <select
              {...register("armenian_city", { required: "Քաղաքը պարտադիր է" })}
            >
              <option value="">Ընտրել</option>
              {locationData.location_hierarchy.LocationType.ARMENIAN.regions[
                selectedRegion
              ]?.cities.map((city) => (
                <option key={city.enum_value} value={city.enum_value}>
                  {city.display}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className={styles.errorText}>{errors.city.message}</p>
            )}
          </div>
        )}

        {locationType === "Արտերկիր" && (
          <div className={styles.inputDiv}>
            <label>Աշխարհամաս</label>
            <select
              {...register("world_region", {
                required: "Աշխարհամասը պարտադիր է",
              })}
            >
              <option value="">Ընտրել</option>
              {Object.values(
                locationData.location_hierarchy.LocationType.FOREIGN
                  .world_regions
              ).map((cont) => (
                <option key={cont.enum_value} value={cont.enum_value}>
                  {cont.display}
                </option>
              ))}
            </select>
            {errors.continent && (
              <p className={styles.errorText}>{errors.continent.message}</p>
            )}
          </div>
        )}

        {/* Country if FOREIGN + Continent selected */}
        {locationType === "Արտերկիր" && selectedContinent && (
          <div className={styles.inputDiv}>
            <label>Երկիր</label>
            <select
              {...register("foreign_country", {
                required: "Երկիրը պարտադիր է",
              })}
            >
              <option value="">Ընտրել</option>
              {locationData.location_hierarchy.LocationType.FOREIGN.world_regions[
                selectedContinent
              ]?.countries.map((country) => (
                <option key={country.enum_value} value={country.enum_value}>
                  {country.display}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className={styles.errorText}>{errors.country.message}</p>
            )}
          </div>
        )}
      </div>

      <div className={styles.gridTwo}>
        <div className={styles.inputDiv}>
          <label>Կոդ</label>
          <input
            {...register("adv_code", { required: "Կոդը պարտադիր է" })}
            placeholder="Կոդ"
          />
          {errors.code && (
            <p className={styles.errorText}>{errors.code.message}</p>
          )}
        </div>

        <div className={styles.inputDiv}>
          <label>Վերնագիր</label>
          <input
            {...register("adv_title", { required: "Վերնագիրը պարտադիր է" })}
            placeholder="Վերնագիր"
          />
          {errors.title && (
            <p className={styles.errorText}>{errors.title.message}</p>
          )}
        </div>

        {/* Adv Type */}
        <div className={styles.inputDiv}>
          <label>Հայտարարության տեսակ</label>
          <select
            {...register("adv_type", {
              required: "Հայտարարության տեսակը պարտադիր է",
            })}
          >
            <option value="">Ընտրել</option>
            <option value="sale">Վաճառք</option>
            <option value="rent">Վարձակալություն</option>
            <option value="long_rent">Երկարաժամկետ վարձակալություն</option>
            <option value="short_rent">Կարճաժամկետ վարձակալություն</option>
          </select>
          {errors.adv_type && (
            <p className={styles.errorText}>{errors.adv_type.message}</p>
          )}
        </div>

        <div className={styles.inputDiv}>
          <label>Տարածքի տեսակ</label>
          <select
            {...register("property_type", {
              required: "Տարածքի տեսակ պարտադիր է",
            })}
          >
            <option value="">Ընտրել</option>
            <option value="commercial">Կոմերցիոն</option>
            <option value="cottage">Ամառանոց</option>
            <option value="apartment">Բնակարան</option>
            <option value="house">Տուն</option>
            <option value="town_house">Թաունհաուս</option>
          </select>
          {errors.adv_type && (
            <p className={styles.errorText}>{errors.adv_type.message}</p>
          )}
        </div>
        <div className={styles.inputDiv}>
          <label>Հասցե</label>
          <input
            {...register("address", { required: "Հասցեն պարտադիր է" })}
            placeholder="Հասցե"
          />
          {errors.address && (
            <p className={styles.errorText}>{errors.address.message}</p>
          )}
        </div>

        {/* Area */}
        <div className={styles.inputDiv}>
          <label>Մակերես (m²)</label>
          <input
            {...register("total_area", { required: "Մակերեսը պարտադիր է" })}
            placeholder="Մակերես (m²)"
            type={"number"}
          />
          {errors.total_area && (
            <p className={styles.errorText}>{errors.total_area.message}</p>
          )}
        </div>

        {/* isHot */}
        <div className={styles.inputDiv}>
          <label>Շտապ</label>
          <select {...register("isHot", { required: "Դաշտը պարտադիր է" })}>
            <option value="">Ընտրել</option>
            <option value="true">Այո</option>
            <option value="false">Ոչ</option>
          </select>
          {errors.isHot && (
            <p className={styles.errorText}>{errors.isHot.message}</p>
          )}
        </div>

        {/* Grace Type */}
        <div className={styles.inputDiv}>
          <label>Շինության տիպ</label>
          <input
            {...register("grace_type", {
              required: "Շինության տիպը պարտադիր է",
            })}
            placeholder="Շինության տիպ"
          />
          {errors.isHot && (
            <p className={styles.errorText}>{errors.grace_type.message}</p>
          )}
        </div>

        {/* New Construction */}
        <div className={styles.inputDiv}>
          <label>Նորակառույց</label>
          <select
            {...register("isNewConstruction", { required: "Դաշտը պարտադիր է" })}
          >
            <option value="">Ընտրել</option>
            <option value="true">Այո</option>
            <option value="false">Ոչ</option>
          </select>
          {errors.isHot && (
            <p className={styles.errorText}>
              {errors.isNewConstruction.message}
            </p>
          )}
        </div>

        {/* Elevator */}
        <div className={styles.inputDiv}>
          <label>Վերելակ</label>
          <select
            {...register("hasElevator", { required: "Դաշտը պարտադիր է" })}
          >
            <option value="">Ընտրել</option>
            <option value="true">Առկա է</option>
            <option value="false">Առկա չէ</option>
          </select>
          {errors.isHot && (
            <p className={styles.errorText}>{errors.hasElevator.message}</p>
          )}
        </div>

        {/* Rooms */}
        <div className={styles.inputDiv}>
          <label>Սենյակներ</label>
          <input
            type="number"
            {...register("rooms", { required: "Դաշտը պարտադիր է" })}
            placeholder="Սենյակների քանակ"
          />
          {errors.isHot && (
            <p className={styles.errorText}>{errors.rooms.message}</p>
          )}
        </div>

        {/* Bathrooms */}
        <div className={styles.inputDiv}>
          <label>Սանհանգույցներ</label>
          <input
            type="number"
            {...register("bathroom_count", { required: "Դաշտը պարտադիր է" })}
            placeholder="Սանհանգույցների քանակ"
          />
          {errors.isHot && (
            <p className={styles.errorText}>{errors.bathroom_count.message}</p>
          )}
        </div>
        <div className={styles.inputDiv}>
          <label>Առաստաղի բարձրություն</label>
          <input
            type="number"
            step="0.01"
            {...register("ceiling_height", { required: "Դաշտը պարտադիր է" })}
            placeholder="Առաստաղի բարձրություն (m)"
          />
          {errors.isHot && (
            <p className={styles.errorText}>{errors.ceiling_height.message}</p>
          )}
        </div>
        <div className={styles.inputDiv}>
          <label>Պատշգամբ</label>
          <select {...register("hasBalcony", { required: "Դաշտը պարտադիր է" })}>
            <option value="">Ընտրել</option>
            <option value="true">Առկա է</option>
            <option value="false">Առկա չէ</option>
          </select>
          {errors.isHot && (
            <p className={styles.errorText}>{errors.hasBalcony.message}</p>
          )}
        </div>
        <div className={styles.inputDiv}>
          <label>Կահույք</label>
          <select
            {...register("hasFurniture", { required: "Դաշտը պարտադիր է" })}
          >
            <option value="">Ընտրել</option>
            <option value="true">Առկա է</option>
            <option value="false">Առկա չէ</option>
          </select>
          {errors.isHot && (
            <p className={styles.errorText}>{errors.hasFurniture.message}</p>
          )}
        </div>
        <div className={styles.inputDiv}>
          <label>Վերանորոգում</label>
          <input
            {...register("renovation_type", { required: "Դաշտը պարտադիր է" })}
            placeholder="Վերանորոգման տեսակը"
          />
          {errors.isHot && (
            <p className={styles.errorText}>{errors.renovation_type.message}</p>
          )}
        </div>
        <div className={styles.inputDiv}>
          <label>Կենցաղային տեխնիկա</label>
          <input
            {...register("appliances", { required: "Դաշտը պարտադիր է" })}
            placeholder="Օրինակ՝ սառնարան, լվացքի մեքենա..."
          />
          {errors.isHot && (
            <p className={styles.errorText}>{errors.appliances.message}</p>
          )}
        </div>
        <div className={styles.inputDiv}>
          <label>Կենդանիների հետ</label>
          <input
            {...register("pet_policy", { required: "Դաշտը պարտադիր է" })}
            placeholder="Օրինակ՝ Այո / Ոչ / Պայմանով"
          />
          {errors.isHot && (
            <p className={styles.errorText}>{errors.pet_policy.message}</p>
          )}
        </div>
        <div className={styles.inputDiv}>
          <label>Կոմունալ հարմարություններ</label>
          <input
            {...register("includedUtiliies", { required: "Դաշտը պարտադիր է" })}
            placeholder="Օրինակ՝ գազ, ջուր, էլեկտրականություն"
          />
          {errors.isHot && (
            <p className={styles.errorText}>
              {errors.includedUtiliies.message}
            </p>
          )}
        </div>
        <div className={styles.inputDiv}>
          <label>Կանխավճար</label>
          <select
            {...register("withPrepayment", { required: "Դաշտը պարտադիր է" })}
          >
            <option value="">Ընտրել</option>
            <option value="true">Այո</option>
            <option value="false">Ոչ</option>
          </select>
          {errors.isHot && (
            <p className={styles.errorText}>{errors.withPrepayment.message}</p>
          )}
        </div>
        <div className={styles.inputDiv}>
          <label>Շենքում հարկերի քանակ</label>
          <input
            {...register("total_floors", { required: "Դաշտը պարտադիր է" })}
            placeholder="Հարկերի քանակ"
            type={"number"}
          />
          {errors.price && (
            <p className={styles.errorText}>{errors.total_floors.message}</p>
          )}
        </div>
        <div className={styles.inputDiv}>
          <label>Հարկ</label>
          <input
            {...register("floor", { required: "Դաշտը պարտադիր է" })}
            placeholder="Հարկ"
            type={"number"}
          />
          {errors.price && (
            <p className={styles.errorText}>{errors.floor.message}</p>
          )}
        </div>
        <div className={styles.inputDiv}>
          <label>Գին</label>
          <input
            {...register("price", { required: "Գինը պարտադիր է" })}
            placeholder="Գին"
            type="number"
          />
          {errors.price && (
            <p className={styles.errorText}>{errors.price.message}</p>
          )}
        </div>

        <div className={styles.inputDiv}>
          <label>Արժույթ</label>
          <select
            {...register("price_type", { required: "Արժույթը պարտադիր է" })}
          >
            <option value="">Ընտրել</option>
            <option value="AMD">AMD</option>
            <option value="USD">USD</option>
            <option value="RUB">RUB</option>
          </select>
          {errors.price_type && (
            <p className={styles.errorText}>{errors.price_type.message}</p>
          )}
        </div>
      </div>

      {/* ✅ ALL OTHER STATIC FIELDS HERE */}
      {/* You can now paste your previous field grid, i.e.:
          - price
          - property_type
          - isHot
          - renovation_type
          - rooms
          - appliances
          - etc.

          ⚠️ Just exclude the previously hardcoded city/region/country fields since now they are dynamic above.
      */}

      <div className={styles.inputDiv}>
        <label>Նկարագրություն</label>
        <textarea
          {...register("adv_description", {
            required: "Նկարագրությունը պարտադիր է",
          })}
          rows={4}
          placeholder="Նկարագրություն"
        />
        {errors.adv_description && (
          <p className={styles.errorText}>{errors.adv_description.message}</p>
        )}
      </div>

      <button type="submit" className={styles.buttonAdd}>
        Հաջորդ քայլ
      </button>
    </form>
  );
};

export default PostHomeForm;
