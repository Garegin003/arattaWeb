import styles from "./login.module.css";
import { useEffect, useState } from "react";
import closeEye from "../../assets/closeEye.svg";
import authStore, { login } from "../../stores/admin_store.js";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);

  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const error = authStore((state) => state.error);
  const loading = authStore((state) => state.loading);

  useEffect(() => {
    if (token) {
      navigate("/admin/homes");
    }
  }, [token, navigate]);

  const handleLogin = async () => {
    if (!userData.username || !userData.password || loading) return;

    const res = await login(userData);

    if (res?.data?.access_token) {
      navigate("/admin/homes");
    }
  };

  return (
    <div className={styles.imagebackground}>
      <div>
        <h1>{t("admin.login.title")}</h1>

        <input
          className={styles.input}
          placeholder={t("admin.login.usernamePlaceholder")}
          type="text"
          value={userData.username}
          onChange={(e) =>
            setUserData({ ...userData, username: e.target.value })
          }
        />

        <div style={{ position: "relative" }}>
          <input
            className={styles.input}
            placeholder={t("admin.login.passwordPlaceholder")}
            type={showPassword ? "text" : "password"}
            value={userData.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
          />

          <div
            onClick={() => setShowPassword(!showPassword)}
            className={styles.passwordIcon}
          >
            <img src={closeEye} alt="Toggle password visibility" />
          </div>
        </div>

        {error && <p className={styles.errorTxt}>{error}</p>}

        <button
          className={styles.loginButton}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? t("admin.login.loading") : t("admin.login.button")}
        </button>
      </div>
    </div>
  );
};

export default Login;