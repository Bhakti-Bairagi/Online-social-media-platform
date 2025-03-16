// Load posts when the page is opened
document.addEventListener("DOMContentLoaded", loadPosts);


// Toggle mobile menu
const mobileMenu = document.getElementById('mobile-menu');
const navbarMenu = document.querySelector('.navbar-menu');

mobileMenu.addEventListener('click', () => {
  navbarMenu.classList.toggle('active');
});


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



document.addEventListener("DOMContentLoaded", loadSidebarPosts);

function loadSidebarPosts() {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    let likedPostsList = document.getElementById("likedPostsList");
    let unlikedPostsList = document.getElementById("unlikedPostsList");

    likedPostsList.innerHTML = "";
    unlikedPostsList.innerHTML = "";

    posts.forEach(post => {
        let listItem = document.createElement("li");
        listItem.textContent = post.content;

        if (post.liked) {
            likedPostsList.appendChild(listItem);
        } else {
            unlikedPostsList.appendChild(listItem);
        }
    });
}


// Function to delete a post (Removes it from the feed & sidebar)
function deletePost(postId) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    let updatedPosts = posts.filter(post => post.id !== postId);

    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    loadPosts();
    loadSidebarPosts();
}

// Function to load liked & unliked posts in the sidebar (Only shows existing posts)
function loadSidebarPosts() {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    let likedPostsList = document.getElementById("likedPostsList");
    let unlikedPostsList = document.getElementById("unlikedPostsList");

    likedPostsList.innerHTML = "";
    unlikedPostsList.innerHTML = "";

    posts.forEach(post => {
        let listItem = document.createElement("li");
        listItem.textContent = post.content;

        if (post.liked) {
            likedPostsList.appendChild(listItem);
        } else {
            unlikedPostsList.appendChild(listItem);
        }
    });
}
