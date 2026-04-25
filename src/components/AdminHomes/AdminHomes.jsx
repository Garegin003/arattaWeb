import styles from "./adminHomes.module.css";
import React, { useEffect, useState } from "react";
import homesStore from "../../stores/homes_store";
import { AdminHomeCard } from "./AdminHomeCard.jsx";
import { useNavigate } from "react-router-dom";

const AdminHomes = () => {
  const { admin_homes, getAdminHomes, hasMore, loading } = homesStore();
  const deleteHome = homesStore((state) => state.deleteHome);
  const deactivateHome = homesStore((state) => state.deactivateHome);
  const navigate = useNavigate();
  const [homeToDelete, setHomeToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getAdminHomes(true);
  }, []);

  useEffect(() => {
    console.log(admin_homes, "homes");
  }, [admin_homes]);

  const handleEdit = (home) => {
    navigate("/admin/add_home", { state: { homeToEdit: home } });
  };

  const confirmDelete = async () => {
    if (homeToDelete) {
      await deleteHome(homeToDelete.uuid);
      setShowModal(false);
      setHomeToDelete(null);
    }
  };

  const deactivateActivate = async (isActive, uuid) => {
    if (isActive) {
      await deactivateHome(false, uuid);
    } else {
      await deactivateHome(true, uuid);
    }
  };

  const handleDelete = (home) => {
    setHomeToDelete(home);
    setShowModal(true);
  };

  return (
    <div className={styles.imagebackground}>
      <div className={styles.buttonView}>
        <button
          className={styles.deleteBtn}
          onClick={() => navigate("/admin/add_home")}
        >
          Ավելացնել տուն
        </button>
      </div>
      {Array.isArray(admin_homes) && admin_homes.length > 0 ? (
        admin_homes.map((home) => (
          <AdminHomeCard
            key={home.id}
            home={home}
            onEdit={handleEdit}
            onDelete={() => handleDelete(home)}
            onDeactivate={deactivateActivate}
          />
        ))
      ) : (
        <p>No homes found.</p>
      )}

      {hasMore && (
        <button onClick={() => getAdminHomes(false)} disabled={loading}>
          {loading ? "Loading..." : "Load More"}
        </button>
      )}

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Հաստատե՞լ ջնջումը</h3>
            <p>
              Ցանկանու՞մ եք հեռացնել հայտարարությունը{" "}
              <b>{homeToDelete?.title}</b>:
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowModal(false)}
              >
                Ոչ
              </button>
              <button className={styles.confirmBtn} onClick={confirmDelete}>
                Այո, ջնջել
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHomes;
