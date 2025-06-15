document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('discussionForm');
    const postsList = document.getElementById('posts-list');
    
    // Load existing posts from localStorage
    loadPosts();
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        
        addPost(title, content);
        form.reset();
    });
    
    function addPost(title, content) {
        const post = {
            title,
            content,
            date: new Date().toLocaleString()
        };
        
        // Save to localStorage
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        posts.unshift(post);
        localStorage.setItem('posts', JSON.stringify(posts));
        
        // Add to DOM
        displayPost(post);
    }
    
    function loadPosts() {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        posts.forEach(post => displayPost(post));
    }
    
    function displayPost(post) {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <h4 class="post-title">${post.title}</h4>
            <p class="post-content">${post.content}</p>
            <p class="post-date">${post.date}</p>
        `;
        
        postsList.insertBefore(postElement, postsList.firstChild);
    }
});