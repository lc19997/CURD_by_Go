
// Add a click event listener to all edit buttons

// const blogContainer = event.target.closest(".blog-container");

// console.log(editButtons);

Array.from(editButtons).forEach(function(button) {
    button.addEventListener("click", function(event) {
        console.log("you are a fool")
        // Find the closest .blog-container element
        const blogContainer = event.target.closest(".blog-container");

        if (blogContainer) {
            console.log("Clicked on edit button inside a blog container.");
        } else {
            console.log("No .blog-container found.");
        }
    });
});


