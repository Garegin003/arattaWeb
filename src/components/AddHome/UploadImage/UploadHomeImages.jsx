import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./uploadHomeImages.module.css";
import homesStore from "../../../stores/homes_store.js";
import homes_store from "../../../stores/homes_store.js";

const UploadHomeImages = () => {
  const uuid = homesStore((state) => state.createdHomeUuid); // home_uuid from route
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const uploadHomeImages = homes_store((state) => state.uploadHomeImages);
  const createdHomeUuid = homesStore((state) => state.createdHomeUuid);
  const activateHome = homes_store((state) => state.activateHome);
  const deleteExistingImages = homes_store(
    (state) => state.deleteExistingImages
  );
  const { id } = useParams();
  const [deletedImages, setDeletedImages] = useState([]);
  const location = useLocation();
  const home = location.state?.home;
  const loading = homes_store((state) => state.loading);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  useEffect(() => {
    console.log(images);
  }, [images]);

  useEffect(() => {
    if (home?.img_uris) {
      const existingImageUrls = home.img_uris
        .split(";")
        .filter(Boolean)
        .map((url) => ({
          preview: `https://api.arattarealestate.com${url.trim()}`,
          isExisting: true,
        }));
      setImages(existingImageUrls);
    }
  }, [home]);

  const handleRemoveImage = (index) => {
    setImages((prev) => {
      const removed = prev[index];
      const uuid = removed.preview.split("/").pop();
      // console.log(uuid)
      if (removed.isExisting && uuid) {
        setDeletedImages((prevDeleted) =>
          prevDeleted.includes(uuid) ? prevDeleted : [...prevDeleted, uuid]
        );
      }
      console.log(prev.filter((_, i) => i !== index));
      return prev.filter((_, i) => i !== index);
    });
  };

  useEffect(() => {
    console.log(deletedImages);
  }, [deletedImages]);

  const handleUpload = async () => {
    if (images.length === 0) {
      setError("Խնդրում ենք ընտրել առնվազն մեկ նկար:");
      return;
    }
    if (home) {
      if (deletedImages.length > 0) {
        deletedImages.map((img) => {
          deleteExistingImages(id, img);
        });
      }
      const newImagesOnly = images.filter((img) => !img.isExisting);
      if (newImagesOnly.length > 0) {
        await uploadHomeImages(newImagesOnly, home.uuid).then(() => {
          activateHome();
        });
      }

      navigate("/admin/homes");
    } else {
      await uploadHomeImages(images, createdHomeUuid).then(() => {
        activateHome();
        navigate("/admin/homes");
      });
    }
  };

  return (
    <div className={styles.imagebackground}>
      <div className={styles.container}>
        <h2>Ներբեռնեք նկարներ</h2>

        {error && <p className={styles.error}>{error}</p>}

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />

        <div className={styles.previewGrid}>
          {images.map((img, index) => (
            <div key={index} className={styles.previewItem}>
              <img src={img.preview} alt={`preview-${index}`} />
              <button type="button" onClick={() => handleRemoveImage(index)}>
                x
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className={styles.uploadButton}
        >
          {loading ? "Ներբեռնվում է..." : "Ներբեռնել և հրապարակել"}
        </button>
      </div>
    </div>
  );
};

export default UploadHomeImages;
