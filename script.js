// Load posts when the page is opened
document.addEventListener("DOMContentLoaded", loadPosts);

function toggleDarkMode() {
    let body = document.body;
    body.classList.toggle("dark-mode");

    // Save preference to local storage
    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
}

// Apply saved dark mode preference on page load
window.onload = function () {
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }
};


// Function to add a new post
function addPost() {
    let postInput = document.getElementById("post-input");
    let imageInput = document.getElementById("image-input");

    if (postInput.value.trim() === "" && !imageInput.files.length) return;

    let imageUrl = "";

    if (imageInput.files.length) {
        let reader = new FileReader();
        reader.onload = function (event) {
            imageUrl = event.target.result;
            savePost(postInput.value, imageUrl);
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        savePost(postInput.value, imageUrl);
    }

    postInput.value = "";
    imageInput.value = "";
}



// Function to save a post in localStorage
function savePost(text, image) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    let newPost = {
        id: Date.now(),
        content: text,
        image: image,
        likes: 0,
        comments: []
    };

    posts.unshift(newPost); // Add new post at the top
    localStorage.setItem("posts", JSON.stringify(posts));
    displayPosts(posts);
}

// Function to display all posts
function displayPosts(posts) {
    let feed = document.getElementById("feed");
    feed.innerHTML = "";

    posts.forEach(post => {
        let postDiv = document.createElement("div");
        postDiv.classList.add("post");

        postDiv.innerHTML = `
            <p id="post-content-${post.id}">${post.content}</p>
            ${post.image ? `<img src="${post.image}" alt="Post Image">` : ""}
            <div class="post-actions">
                <button onclick="likePost(${post.id})">❤️ ${post.likes} Likes</button>
                <button onclick="editPost(${post.id})">✏️ Edit</button>
                <button onclick="deletePost(${post.id})">🗑️ Delete</button>
            </div>
            <div class="comment-box">
                <input type="text" id="comment-${post.id}" placeholder="Write a comment...">
                <button onclick="addComment(${post.id})">Comment</button>
            </div>
            <div id="comments-${post.id}" class="comments">
                ${post.comments.map(comment => `<p>${comment}</p>`).join("")}
            </div>
        `;
        feed.appendChild(postDiv);
    });
}

// Function to load posts from localStorage
function loadPosts() {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    displayPosts(posts);
}

// Function to like a post
function likePost(postId) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    posts = posts.map(post => {
        if (post.id === postId && post.likes < 1) { // Allow only one like
            post.likes++;
        }
        return post;
    });

    localStorage.setItem("posts", JSON.stringify(posts));
    displayPosts(posts);
}


// Function to delete a post with confirmation
function deletePost(postId) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    posts = posts.filter(post => post.id !== postId);

    localStorage.setItem("posts", JSON.stringify(posts));
    displayPosts(posts);
}

// Function to edit a post
function editPost(postId) {
    let postTextElement = document.getElementById(`post-content-${postId}`);
    let newText = prompt("Edit your post:", postTextElement.innerText);

    if (newText === null || newText.trim() === "") return;

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    posts = posts.map(post => {
        if (post.id === postId) {
            post.content = newText;
        }
        return post;
    });

    localStorage.setItem("posts", JSON.stringify(posts));
    displayPosts(posts);
}

// Function to add a comment
function addComment(postId) {
    let commentInput = document.getElementById(`comment-${postId}`);
    if (!commentInput.value.trim()) return;

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    posts = posts.map(post => {
        if (post.id === postId) {
            post.comments.push(commentInput.value);
        }
        return post;
    });

    localStorage.setItem("posts", JSON.stringify(posts));
    displayPosts(posts);
    commentInput.value = "";
}

// Function to search posts
function searchPosts() {
    let query = document.getElementById("search-bar").value.toLowerCase();
    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    let filteredPosts = posts.filter(post => post.content.toLowerCase().includes(query));
    displayPosts(filteredPosts);
}



document.addEventListener("DOMContentLoaded", function () {
    loadGenres();
});

// Predefined genres
let predefinedGenres = ["Fiction", "Non-Fiction", "Sci-Fi", "Romance"];

function loadGenres() {
    let genres = JSON.parse(localStorage.getItem("genres")) || predefinedGenres;
    let genreList = document.getElementById("genres-list");
    let genreFilter = document.getElementById("genre-filter");

    genreList.innerHTML = "";
    genreFilter.innerHTML = '<option value="all">All Genres</option>';

    genres.forEach(genre => {
        addGenreToDOM(genre);
    });
}

function addGenreToDOM(genre) {
    let genreList = document.getElementById("genres-list");
    let genreFilter = document.getElementById("genre-filter");

    let li = document.createElement("li");
    li.innerHTML = `${genre} <button onclick="deleteGenre('${genre}')">🗑️</button>`;
    genreList.appendChild(li);

    let option = document.createElement("option");
    option.value = genre;
    option.innerText = genre;
    genreFilter.appendChild(option);
}

function addGenre() {
    let newGenre = document.getElementById("new-genre").value.trim();
    if (!newGenre) {
        alert("Genre cannot be empty!");
        return;
    }

    let genres = JSON.parse(localStorage.getItem("genres")) || predefinedGenres;
    if (genres.includes(newGenre)) {
        alert("Genre already exists!");
        return;
    }

    genres.push(newGenre);
    localStorage.setItem("genres", JSON.stringify(genres));

    addGenreToDOM(newGenre);
    document.getElementById("new-genre").value = ""; // Clear input
}

function deleteGenre(genre) {
    if (!confirm(`Are you sure you want to delete "${genre}"?`)) return;

    let genres = JSON.parse(localStorage.getItem("genres")) || predefinedGenres;
    genres = genres.filter(g => g !== genre);
    localStorage.setItem("genres", JSON.stringify(genres));

    loadGenres(); // Reload UI
}

function renderPost(post) {
    let postElement = document.createElement("div");
    postElement.className = "post";
    postElement.setAttribute("data-genre", post.genre);
    postElement.setAttribute("data-id", post.id);
    postElement.innerHTML = `
        <p>${post.content}</p>
        <span><strong>Genre:</strong> ${post.genre}</span><br>
        <button class="like-btn" onclick="toggleLike('${post.id}')" id="like-btn-${post.id}">
            ❤️ Like (<span id="like-count-${post.id}">${post.likes}</span>)
        </button>
    `;

    document.getElementById("posts-section").prepend(postElement);
}

function filterPosts() {
    let selectedGenre = document.getElementById("genre-filter").value;
    let posts = document.querySelectorAll(".post");

    posts.forEach(post => {
        let postGenre = post.getAttribute("data-genre");
        post.style.display = (selectedGenre === "all" || postGenre === selectedGenre) ? "block" : "none";
    });
}

