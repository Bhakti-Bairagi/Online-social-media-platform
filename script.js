// Load posts when the page is opened
document.addEventListener("DOMContentLoaded", loadPosts);

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
        if (post.id === postId) {
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

// Function to save a post with genre selection
function savePost(text, image, genre) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    let newPost = {
        id: Date.now(),
        content: text,
        image: image,
        genre: genre,
        likes: 0,
        comments: [],
        userId: localStorage.getItem("loggedInUser") || "Guest"
    };

    posts.unshift(newPost); // Add new post at the top
    localStorage.setItem("posts", JSON.stringify(posts));
    displayPosts(posts);
}



// Add click event listeners to genre buttons
document.querySelectorAll(".genre-btn").forEach(button => {
    button.addEventListener("click", function () {
        let selectedGenre = this.getAttribute("data-genre");
        
        // Remove active class from all buttons
        document.querySelectorAll(".genre-btn").forEach(btn => btn.classList.remove("active"));
        
        // Add active class to clicked button
        this.classList.add("active");

        // Apply filtering
        filterPosts(selectedGenre);
    });
});

