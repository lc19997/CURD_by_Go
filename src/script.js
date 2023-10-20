// Assuming you have an HTML element with id "blogList" where you want to display the blogs

document.addEventListener('DOMContentLoaded', function () {

    // Retrieve all blogs
    fetch('http://localhost:8080/blogs') // Replace with the URL of your backend API endpoint
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const blogListElem = document.getElementById('blogList');

            // Loop through each blog and create an HTML element to display it
            data.forEach(blog => {
                const blogElem = document.createElement('div');
                blogElem.innerHTML = `
                    <h3>${blog.title}</h3>
                    <p>${blog.content}</p>
                `;
                blogListElem.appendChild(blogElem);
            });

        })
        .catch(error => {
            console.error(error);
        });

    /*
    // Create a new blog
    const newBlogData = {
                        <form method="post" action="/update/{{ .ID }}">
                    <input type="submit" value="Edit">
                </form>
                <form method="post" action="/delete/{{ .ID }}">
                    <input type="submit" value="Delete">
                </form>
        title: "New Blog",
        content: "Lorem ipsum...",
        owner_user_id: 123
    };

    fetch("http://localhost:8080/blogs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newBlogData)
    })
        .then(response => response.json())
        .then(data => {
            // Handle the newly created blog data
            console.log(data); // Example: Log to the console
        })
        .catch(error => {
            // Handle any errors
            console.error(error); // Example: Log to the console
        });

    // Update an existing blog
    const updatedBlogData = {
        title: "Updated Blog",
        content: "Updated content..."
    };

    fetch(`http://localhost:8080/blogs/{blog_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedBlogData)
    })
        .then(response => response.json())
        .then(data => {
            // Handle the updated blog data
            console.log(data); // Example: Log to the console
        })
        .catch(error => {
            // Handle any errors
            console.error(error); // Example: Log to the console
        });

    // Delete a blog
    fetch(`http://localhost:8080/blogs/{blog_id}`, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(data => {
            // Handle the success message
            console.log(data); // Example: Log to the console
        })
        .catch(error => {
            // Handle any errors
            console.error(error); // Example: Log to the console
        });
    */
})
