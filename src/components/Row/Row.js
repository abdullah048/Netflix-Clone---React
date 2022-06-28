import axios from "../../axios";
import "./Row.css";
import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

function Row(props) {
	const base_url = "https://image.tmdb.org/t/p/original/";
	const [movies, setMovies] = useState([]);
	const [trailerUrl, setTrailerUrl] = useState("");
	useEffect(() => {
		async function fetchData() {
			const request = await axios.get(props.fetchURL);
			setMovies(request.data.results);
			// console.log(request);
			return request;
		}
		fetchData();
	}, [props.fetchURL]);
	// console.log(movies);
	const opts = {
		height: "390",
		width: "100%",
		playerVars: { autoplay: 1 },
	};
	const showTrailer = (movie) => {
		if (trailerUrl) {
			setTrailerUrl("");
		} else {
			movieTrailer(movie?.name || "")
				.then((url) => {
					const urlParams = new URLSearchParams(new URL(url).search);
					setTrailerUrl(urlParams.get("v"));
				})
				.catch((Error) => alert(Error.message));
		}
	};
	return (
		<div className="row">
			<h2>{props.title}</h2>
			<div className="row__posters">
				{movies?.map((movie) => {
					return (
						<img
							key={movie.id}
							onClick={() => showTrailer(movie)}
							className={`row__poster ${props.isLargeRow && "row__posterLarge"
								}`}
							src={`${base_url}${props.isLargeRow ? movie.poster_path : movie.backdrop_path
								}`}
							alt={movie.name}
						/>
					);
				})}
			</div>
			{trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
		</div>
	);
}

export default Row;
