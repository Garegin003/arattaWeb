import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import homesStore from "../../stores/homes_store.js";
import styles from "./addHomeStyles.module.css";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const CITIES = [
  "Երևան",
  "Արագածոտն",
  "Արարատ",
  "Արմավիր",
  "Գեղարքունիք",
  "Կոտայք",
  "Լոռի",
  "Շիրակ",
  "Սյունիք",
  "Վայոց ձոր",
  "Տավուշ",
];
const bigCities = [
  // Ասիա
  "Տոկիո",
  "Շանհայ",
  "Սեուլ",
  "Մումբայ",
  "Պեկին",
  "Բանգկոկ",
  "Ջակարտա",
  "Մանիլա",
  "Էր-Ռիյադ",
  "Կուալա Լումպուր",
  "Դուբայ",

  // Եվրոպա
  "Լոնդոն",
  "Փարիզ",
  "Բեռլին",
  "Մադրիդ",
  "Հռոմ",
  "Ամստերդամ",
  "Վիեննա",
  "Վարշավա",
  "Մոսկվա",
  "Բարսելոնա",

  // Հյուսիսային Ամերիկա
  "Նյու Յորք",
  "Լոս Անջելես",
  "Չիկագո",
  "Տորոնտո",
  "Մեխիկո",
  "Հյուստոն",
  "Մայամի",
  "Դալաս",
  "Վանկուվեր",
  "Ֆիլադելֆիա",
];

const CONTINENTS = ["Եվրոպա", "Ասիա", "Հյուսիսային Ամերիկա"];

const PostHomeForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const location_type = watch("location_type");
  const editHome = homesStore((state) => state.editHome);
  const loading = homesStore((state) => state.loading);

  const location = useLocation();
  const homeToEdit = location.state?.homeToEdit;

  useEffect(() => {
    if (homeToEdit) {
      // Convert boolean & numeric fields to string if needed
      Object.entries(homeToEdit).forEach(([key, value]) => {
        const stringValue =
          typeof value === "boolean" ? value.toString() : value;
        setValue(key, stringValue ?? "");
      });
    }
  }, [homeToEdit]);

  const onSubmit = async (data) => {
    try {
      const homeData = {
        adv_code: data.adv_code,
        adv_title: data.adv_title,
        adv_description: data.adv_description,
        price: parseFloat(data.price),
        price_type: data.price_type,
        property_type: data.property_type || "apartment",
        word_region_type: data.word_region_type || "",
        location_type: data.location_type,
        adv_type: data.adv_type,
        city: data.city || "",
        region: location_type === "Հայաստան" ? data.city : "Արտերկիր",
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
      if (homeToEdit) {
        await homesStore.getState().editHome(homeToEdit.uuid, homeData);
        console.log("Updated home:", homeToEdit.uuid);
        navigate(`/admin/upload-images/${homeToEdit.uuid}`, {
          state: { home: homeToEdit },
        });
      } else {
        const createdUuid = await homesStore.getState().createHome(homeData);
        console.log("Created UUID:", createdUuid);
        navigate(`/admin/upload-images/${createdUuid}`);
      }
    } catch (err) {
      console.error("Error creating home:", err);
    } finally {
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
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
        <div className={styles.inputDiv}>
          <label>Գին</label>
          <input
            {...register("price", { required: "Գինը պարտադիր է" })}
            placeholder="Գին"
            type={"number"}
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
        {/* Location Type */}
        <div className={styles.inputDiv}>
          <label>Տարածք</label>
          <select
            {...register("location_type", {
              required: "Տարացաշրջանը պարտադիր է",
            })}
          >
            <option value="">Ընտրել</option>
            <option value="Հայաստան">Հայաստան</option>
            <option value="Արտերկիր">Արտերկիր</option>
          </select>
          {errors.location_type && (
            <p className={styles.errorText}>{errors.location_type.message}</p>
          )}
        </div>

        <div className={styles.inputDiv}>
          <label>Քաղաք/Մարզ</label>
          <select {...register("city", { required: "Քաղաքը պարտադիր է" })}>
            <option value="">Ընտրել</option>
            {location_type === "Հայաստան"
              ? CITIES.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))
              : bigCities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
          </select>
          {errors.city && (
            <p className={styles.errorText}>{errors.city.message}</p>
          )}
        </div>

        <div className={styles.inputDiv}>
          <label>Աշխարհամաս</label>
          <select
            {...register("word_region_type", {
              required: "Աշխարհամասը պարտադիր է",
            })}
          >
            <option value="">Ընտրել</option>
            {CONTINENTS.map((c, index) => (
              <option key={index} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.word_region_type && (
            <p className={styles.errorText}>
              {errors.word_region_type.message}
            </p>
          )}
        </div>
        {/* Address */}
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
      </div>

      <div className={styles.inputDiv}>
        <label>Նկարագրություն</label>
        <textarea
          {...register("adv_description", {
            required: "Նկարագրությունը  պարտադիր է",
          })}
          rows={4}
          placeholder="Description"
        />
        {errors.description && (
          <p className={styles.errorText}>{errors.description.message}</p>
        )}
      </div>

      <button type="submit" className={styles.buttonAdd}>
        Հաջորդ քայլ
      </button>
    </form>
  );
};

export default PostHomeForm;
