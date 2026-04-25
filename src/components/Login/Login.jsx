import styles from "./login.module.css";
import { useEffect, useState } from "react";
import closeEye from "../../assets/closeEye.svg";
import authStore, { login } from "../../stores/admin_store.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
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
  }, [token]);

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
        <h1>Մուտք</h1>

        <input
          className={styles.input}
          placeholder="Մուտքագրեք էլ. հասցե կամ օգտանուն"
          type="text"
          value={userData.username}
          onChange={(e) =>
            setUserData({ ...userData, username: e.target.value })
          }
        />
        <div style={{ position: "relative" }}>
          <input
            className={styles.input}
            placeholder="Մուտքագրեք գաղտնաբառ"
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
            <img src={closeEye} alt="Toggle visibility" />
          </div>
        </div>

        {error && <p className={styles.errorTxt}>{error}</p>}

        <button
          className={styles.loginButton}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Բեռնում..." : "Մուտք"}
        </button>
      </div>
    </div>
  );
};

export default Login;
