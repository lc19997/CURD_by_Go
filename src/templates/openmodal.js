
const openModalButton = document.getElementById("openModalButton");
const closeModalButton = document.getElementById("closeModalButton");
const modal = document.getElementById("myModal");
const blogForm = document.getElementById("blogForm");

openModalButton.addEventListener("click", function() {
    modal.style.display = "block";
});

closeModalButton.addEventListener("click", function() {
    modal.style.display = "none";
});

blogForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const formData = new FormData(blogForm);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    const formJSON = JSON.stringify(formObject);


    // Send the JSON data to the server.
    fetch('http://localhost:8080/api/create', {
        method: "POST",
        body: formJSON,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        if (response.ok) {
            // Handle the successful response as needed.
            console.log("Form submitted successfully");
            location.reload();
        } else {
            // Handle errors.
            console.error("Form submission failed");
        }
    });
    modal.style.display = "none";
 
});

