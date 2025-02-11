import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./details.module.css";
import sendMoviesData from "../../common/services/add_movie";
import runtime from "../../common/services/runtime";
import getData from "../../common/services/get_user_data_from_localstorage";

export default function Details() {
  const [isFavorite, setIsFavorite] = useState(false);
  const location = useLocation();
  const data = location.state?.data;

  useEffect(() => {
    document.title = `${data.title}`;
  }, [data.title]);
  useEffect(() => {
    async function initializeFavorites() {
      const moviesFetched = await getData();
      const isAdded = moviesFetched.find((movie) => movie.id == data.id);
      setIsFavorite(!!isAdded);
    }
    initializeFavorites();
  }, [data.id]);

  const handleMovieClick = (id) => {
    window.open(`https://www.imdb.com/title/${id}`);
  };

  function releaseDate() {
    const date = data.release_date;
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }

  function toggleFavorites() {
    /* server request */
    const obj = {
      id: data.id,
      title: data.title,
      poster_path: data.poster_path,
      isAdded: !isFavorite,
    };

    const userStr = localStorage.getItem("userData");
    const userStr2 = JSON.parse(userStr);
    const userJSON = JSON.parse(userStr2);
    const user = {
      username: userJSON.username,
      password: userJSON.password,
    };
    sendMoviesData(obj, user).then((updatedMovies) => {
      if (updatedMovies) {
        console.log("Favorites updated:", updatedMovies);
      }
    });
    /* 
    Написать if, если updatedMovies возвращает объект, в котором есть фильм, 
    на который я нажал, то он отправляет другой запрос, который удаляет этот фильм из БД пользователя
    */

    /* css toggle */
    const btn = document.getElementById("favorites-btn-id");
    if (btn.textContent == "Add to favorites") {
      btn.classList.add(`${styles.active}`);
      btn.textContent = "Remove from favorites";
    } else {
      btn.classList.remove(`${styles.active}`);
      btn.textContent = "Add to favorites";
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.sideber}>
        <img
          className={styles.poster}
          src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`}
          alt={data.title || "Movie Poster"}
        />
        {isFavorite ? (
          <button
            onClick={() => toggleFavorites()}
            className={[`${styles["favorites-btn"]} ${styles.active}`]}
            id="favorites-btn-id"
          >
            Remove from favorites
          </button>
        ) : (
          <button
            onClick={() => toggleFavorites()}
            className={styles["favorites-btn"]}
            id="favorites-btn-id"
          >
            Add to favorites
          </button>
        )}
      </div>
      <div className={styles["main-content"]}>
        <h1 className={styles.title}>{data.title}</h1>
        <div className={styles.tags}>
          <div className={styles.tag}>{releaseDate()}</div>
          <div className={styles.tag}>
            {data.genres.map((item) => item.name).join(", ")}
          </div>
          <div className={styles.tag}>{runtime(data)}</div>
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
