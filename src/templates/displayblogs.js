document.addEventListener('DOMContentLoaded', function (){
const blogTable = document.getElementById('blog-table');

// Fetch blog data from the server
fetch('http://localhost:8080/api/blogs') // Replace '/api/blogs' with your actual API endpoint
  .then(response => response.json())
  .then(data => {
    console.log(data);
    console.log("kdfjdksf");
    const tbody = blogTable.querySelector('tbody');
    id = 0;
    data.reverse();
    console.log(data);

    // Iterate through the blog data and create rows in the table
    data.forEach(Posts => {
      const postElement = document.createElement("tr");
      postElement.className = "blog-container";
      postElement.dataset.newdata=Posts.id;
      id++;
      postElement.innerHTML = `
        <td class="blogid"><strong>${id}</strong></td> 
        <td class="blog-title" contenteditable="true"><strong>${Posts.title}</strong></td>
        <td class="blog-content" contenteditable="true">${Posts.content}</td>
        <td><button class="edit-btn" onclick="fneditmodal(this)">edit</button></td>      
        <td><button class="del-btn" onclick="deleteBlog(this)">delete</button></td>
        `;
      tbody.appendChild(postElement);
    });

    // editButton = document.querySelector(".edit-btn");
    // editButton.addEventListener("click", function(event) {
    //   console.log('clicked!');

    //location.reload();
   })
  .catch(error => {
    console.error('Error fetching blog data:', error);
  });
});

