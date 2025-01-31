import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import styles from "./details.module.css";

export default function Details() {
  const location = useLocation();
  const data = location.state?.data;
  // Отображение подробных данных об открытом фильме
  console.log(data);

  useEffect(() => {
    document.title = `${data.title}`;
  });

  const handleMovieClick = (id) => {
    window.open(`https://www.imdb.com/title/${id}`);
  };

  function releaseDate() {
    const date = data.release_date;
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }

  function runtime() {
    const totalMin = data.runtime;
    const hours = Math.floor(totalMin / 60);
    const minutes = totalMin % 60;
    if (hours == 0) {
      return `${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.sideber}>
        <img
          className={styles.poster}
          src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`}
          alt={data.title || "Movie Poster"}
        />
        <button className={styles["favorites-btn"]}>Add to favorites</button>
      </div>
      <div className={styles["main-content"]}>
        <h1 className={styles.title}>{data.title}</h1>
        <div className={styles.tags}>
          <div className={styles.tag}>{releaseDate()}</div>
          <div className={styles.tag}>
            {data.genres.map((item) => item.name).join(", ")}
          </div>
          <div className={styles.tag}>{runtime()}</div>
          <div
            onClick={() => handleMovieClick(data.imdb_id)}
            className={`${styles.tag} ${styles.trailer}`}
          >
            Play trailer
          </div>
        </div>
        <div
          onClick={() => handleMovieClick(data.imdb_id)}
          className={styles["vote-wrapper"]}
        >
          <img src="../../../src/assets/icons/imdb-icon.svg" />
          <div className={styles.vote}>
            {Math.round(data.vote_average * 10) / 10}/10
          </div>
        </div>
        <div className={styles.overview}>
          <h2 className={styles.headling}>Overview</h2>
          <p className={styles.description}>{data.overview}</p>
          <h2 className={styles.tagline}>{data.tagline}</h2>
        </div>
      </div>
    </div>
  );
}
