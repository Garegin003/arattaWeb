import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { FaHome, FaMapMarkedAlt, FaHandshake } from "react-icons/fa";
import styles from "./fifthContainer.module.css";

export const FifthContainer = () => {
  const stats = [
    { number: 10000, suffix: "+", label: "Բնակարան", icon: <FaHome /> },
    {
      number: 15,
      suffix: "+",
      label: "Պետություններ",
      icon: <FaMapMarkedAlt />,
    },
    { number: 1000, suffix: "+", label: "Գործարքներ", icon: <FaHandshake /> },
  ];

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <div className={styles.fifthContainer} ref={ref}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className={styles.statItem}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: index * 0.2 }}
        >
          <div className={styles.icon}>{stat.icon}</div>
          <p className={styles.statNumber}>
            {inView && (
              <CountUp
                start={0}
                end={stat.number}
                duration={2}
                separator=","
                suffix={stat.suffix}
              />
            )}
          </p>
          <p className={styles.statLabel}>{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};
