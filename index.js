// Import necessary modules
import express from "express"; // Import Express.js framework
import bodyParser from "body-parser"; // Import body-parser middleware

// Create an Express app instance
const app = express();
const port = 3000; // Define the port number for the server

// Middleware Setup
app.use(express.static("public")); // Serve static files from the "public" directory
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Data Management
let posts = []; // Array to store blog posts
let postId = 1; // Variable to track the ID for the next post

// Function to generate a random date
function getRandomDate() {
    const year = Math.floor(Math.random() * (2023 - 1960 + 1)) + 1960;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return new Date(year, month - 1, day);
}

// Middleware for Processing Data
function processData(req, res, next) {
    // Generate a random date
    const randomNumber = getRandomDate();
    // Extract data from the request body and attach additional data
    req.postData = {
        id: postId++, // Assign a unique ID to the post
        title: req.body["blog-name"], // Extract title from the request body
        author: req.body["author"], // Extract author from the request body
        content: req.body["text"], // Extract content from the request body
        date: randomNumber.toLocaleDateString("en-US") // Assign a random date to the post
    };
    next(); // Call the next middleware function
}

// Use the processData middleware
app.use(processData);

// Routes

// Homepage route
app.get("/", (req, res) => {
    res.render("index.ejs"); // Render the homepage
});

// Route to render the form for creating a new post
app.get("/create", (req, res) => {
    res.render("create.ejs"); // Render the form for creating a new post
});

// Route to handle the submission of the new post form
app.post("/create", (req, res) => {
    const newPost = req.postData; // Extract post data from the request
    posts.push(newPost); // Add the new post to the array of posts
    res.redirect("/all"); // Redirect to the page displaying all posts
});

// Route to render a page displaying all posts
app.get("/all", (req, res) => {
    res.render("all.ejs", { posts }); // Render the page displaying all posts
});

// Route to render the page for editing posts
app.get("/edit", (req, res) => {
    res.render("edit.ejs", { posts }); // Render the page for editing posts
});

// Route to render the edit page for a specific post
app.get("/edit/:id", (req, res) => {
    const postId = parseInt(req.params.id); // Extract post ID from the request parameters
    const post = posts.find(post => post.id === postId); // Find the post with the specified ID
    if (post) {
        res.render("edit.ejs", { post }); // Render the edit page for the specified post
    } else {
        res.status(404).send("Post not found"); // Send a 404 error if the post is not found
    }
});

// Route to handle the submission of edits for a specific post
app.post("/edit/:id", (req, res) => {
    const postId = parseInt(req.params.id); // Extract post ID from the request parameters
    const { title, author, content, date } = req.body; // Extract updated post data from the request body
    const postIndex = posts.findIndex(post => post.id === postId); // Find the index of the post with the specified ID
    if (postIndex !== -1) {
        // Update the post with the new data
        posts[postIndex] = {
            ...posts[postIndex],
            title,
            author,
            content,
            date
        };
        res.redirect("/all"); // Redirect to the page displaying all posts
    } else {
        res.status(404).send("Post not found"); // Send a 404 error if the post is not found
    }
});

// Route to handle the deletion of a specific post
app.get("/delete/:id", (req, res) => {
    const postId = parseInt(req.params.id); // Extract post ID from the request parameters
    const postIndex = posts.findIndex(post => post.id === postId); // Find the index of the post with the specified ID
    if (postIndex !== -1) {
        // Remove the post from the array
        posts.splice(postIndex, 1);
        res.redirect("/all"); // Redirect to the page displaying all posts
    } else {
        res.status(404).send("Post not found"); // Send a 404 error if the post is not found
    }
});

// Route to handle the deletion of a specific post
app.delete("/delete/:id", (req, res) => {
    const postId = parseInt(req.params.id); // Extract post ID from the request parameters
    const postIndex = posts.findIndex(post => post.id === postId); // Find the index of the post with the specified ID
    if (postIndex !== -1) {
        // Remove the post from the array
        posts.splice(postIndex, 1);
        res.redirect("/all"); // Redirect to the page displaying all posts
    } else {
        res.status(404).send("Post not found"); // Send a 404 error if the post is not found
    }
});

// Start the server and make it listen on the specified port
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});