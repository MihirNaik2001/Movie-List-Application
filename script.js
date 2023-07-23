const API_KEY = '59fbb41f';
const BASE_URL = 'https://www.omdbapi.com/';

const movieListElement = document.getElementById('movieList');
const movieDetailsElement = document.getElementById('movieDetails');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const paginationElement = document.getElementById('pagination');
const content = document.getElementById('content');

let currentPage = 1;
let currentSearchTerm = '';
let currentSearchType = 's';

let storedData = [];

function fetchMovies(page) {
    let url = `${BASE_URL}?apikey=${API_KEY}&${currentSearchType}=${currentSearchTerm}&page=${page}`;

    fetch(url)
        .then(response => response.json())
        .then(data => displayMovies(data))
        .catch(error => console.error('Error fetching movies:', error));
}

function displayMovies(data) {
    
    movieListElement.innerHTML = '';
    movieDetailsElement.innerHTML = '';
    if (data.Response === 'True') {


        data.Search.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');
            movieElement.innerHTML = `
                <img src="${movie.Poster}" alt="${movie.Title}">
                <h3>${movie.Title}</h3>
            `;
            movieElement.addEventListener('click', () => showMovieDetails(movie.imdbID));
            movieListElement.appendChild(movieElement);
        });

        if (data.totalResults > 10) {
            paginationElement.style.display = 'block';
        } else {
            paginationElement.style.display = 'none';
        }
    } else {
        movieListElement.innerHTML = '<p>No movies found.</p>';
        paginationElement.style.display = 'none';
    }
}

function showMovieDetails(movieId) {
    let url = `${BASE_URL}?apikey=${API_KEY}&i=${movieId}`;

    fetch(url)
        .then(response => response.json())
        .then(data => displayMovieDetails(data))
        .catch(error => console.error('Error fetching movie details:', error));

    movieListElement.innerHTML = '';
    paginationElement.style.display = "none";
}

function displayMovieDetails(data) {

    let tempRat = "";
    let tempCom = "";
    let flag = false;
    if(JSON.parse(localStorage.getItem('key')) == null){
        localStorage.setItem('key','[]');
        flag = true;
    }
    if(!flag){
        storedData = JSON.parse(localStorage.getItem('key'));
        for(let index = 0;index < storedData.length;index++){
            if(storedData[index].id === data.imdbID){
                tempRat = storedData[index].rating;
                tempCom = storedData[index].comment;
                break;
            }
        }
    }
    
    movieDetailsElement.innerHTML = `
    <div class="info">
        <img src="${data.Poster}" alt="${data.Title}">
        <h2>${data.Title}</h2>
        <p><strong>Year:</strong> ${data.Year}</p>
        <p><strong>Rated for:</strong>${data.Rated}</p>
        <p><strong>Director:</strong> ${data.Director}</p>
        <p><strong>Plot:</strong> ${data.Plot}</p>
        <p><strong>Genre:</strong>${data.Genre}</p>
        <p><strong>Actors:</strong>${data.Actors}</p>
        <p><strong>Language:</strong>${data.Language}</p>
        <p><strong>Awards won:</strong>${data.Awards}</p>
        <p><strong>IMDB rating:</strong> ${data.imdbRating}</p>
    </div>
    <div class="input-info">
        <div>
            <label for="rating">My Rating: </label>
            <input type="number" id="rating" min="1" max="5" placeholder=${tempRat}>
            <button onclick="submitRating('${data.imdbID}')">Submit Rating</button>
        </div>
        <div>
            <label for="comment">Comment: </label>
            <textarea id="comment" placeholder=${tempCom}></textarea>
            <button onclick="submitComment('${data.imdbID}')">Submit Comment</button>
        </div>
    </div>
    `;

    movieDetailsElement.style.display = 'block';
}

function submitRating(movieId) {
    const ratingInput = document.getElementById('rating');
    let temp = (ratingInput.value <= 0)?1:ratingInput.value;
    const ratingValue = (temp > 5)?5:temp;
    ratingInput.value = '';

    let flag = false;
    let flag2 = false;
    storedData = [];
    if(JSON.parse(localStorage.getItem('key')) == null){
        localStorage.setItem('key','[]');
        storedData.push({id : movieId,rating : ratingValue,comment:''})
        flag2 = true;
    }
    if(!flag2){
        storedData = JSON.parse(localStorage.getItem('key'));
        for(let index = 0;index < storedData.length;index++){
            if(storedData[index].id === movieId){
                flag = true;
                storedData[index].rating = ratingValue;
                break;
            }
        }
        if(!flag)storedData.push({id : movieId,rating : ratingValue,comment:''});
    }
    
    localStorage.setItem('key',JSON.stringify(storedData));

    alert(`Rating ${ratingValue} stars submitted for movie ${movieId}.`);
}

function submitComment(movieId) {
    const commentInput = document.getElementById('comment');
    const commentValue = commentInput.value;

    let flag = false;
    let flag2 = false;
    storedData = [];
    if(JSON.parse(localStorage.getItem('key')) == null){
        localStorage.setItem('key','[]');
        storedData.push({id : movieId,rating : 0,comment:commentValue});
        flag2 = true;
    }
    if(!flag2){
        storedData = JSON.parse(localStorage.getItem('key'));
        for(let index = 0;index < storedData.length;index++){
            if(storedData[index].id === movieId){
                flag = true;
                storedData[index].comment = commentValue;
                break;
            }
        }
        if(!flag)storedData.push({id : movieId,rating : 0,comment:commentValue});
    }
    
    localStorage.setItem('key',JSON.stringify(storedData));

    alert(`Comment submitted for movie ${movieId}: ${commentValue}`);
}

function setSearchType() {
    const searchTypeSelect = document.getElementById('searchType');
    currentSearchType = searchTypeSelect.value;
    searchInput.placeholder = `Search movies by ${currentSearchType}`;
}

searchBtn.addEventListener('click', () => {
    currentPage = 1;
    movieListElement.innerHTML = '';
    currentSearchTerm = searchInput.value.trim();
    fetchMovies(currentPage);
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchMovies(currentPage);
    }
});

nextBtn.addEventListener('click', () => {
    currentPage++;
    fetchMovies(currentPage);
});

fetchMovies(currentPage);
