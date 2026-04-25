import { useState } from "react";
import styles from "./findHome.module.css";
import { Checkbox } from "../icons";

export const FilterItem = ({ title, options, selectedIndexes, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.filterBox}>
      {/* Title bar with arrow */}
      <div
        className={styles.filterTitle}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{title}</span>
        <span
          className={`${styles.filterArrow} ${
            isOpen ? styles.filterArrowOpen : ""
          }`}
        >
          ▼
        </span>
      </div>

      {/* Options container */}
      <div
        className={`${styles.filterOptions} ${
          isOpen ? styles.filterOptionsOpen : ""
        }`}
      >
        {options.map((item, index) => (
          <div
            key={index}
            className={styles.filterItemContainer}
            onClick={() => onSelect(index)}
          >
            <div
              className={
                selectedIndexes.includes(index)
                  ? styles.checkboxChecked
                  : styles.checkbox
              }
            >
              {selectedIndexes.includes(index) && <Checkbox />}
            </div>
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
