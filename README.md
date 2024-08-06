# E-Commerce Project

Welcome to our E-Commerce project! This README file provides an overview of the project structure, functionalities related to reviews and favourites, setup instructions, and other important information.

##Overview

This repository contains the backend implementation of an E-Commerce platform, focusing on functionalities such as product reviews, favourite products management, and related stored procedures. This README provides an overview of the project structure, functionalities, and usage instructions.

##Features Implemented
Product Reviews

    Create Review: Allows members to add reviews for products they have purchased.
    Update Review: Enables members to update their existing reviews.
    Delete Review: Provides functionality to delete reviews.
    Retrieve Reviews: Retrieves all reviews posted by a member.

##Favourite Products Management

    Add Favourite: Allows members to add products to their favourites list.
    Retrieve Favourites: Retrieves all favourite products for a member.

Stored Procedures

    create_review: Validates and inserts a new review into the database.
    update_review: Updates an existing review if the member has permission.
    delete_review: Deletes a review from the database.
    get_all_reviews: Retrieves all reviews posted by a member.
    add_favourite: Adds a product to a member's favourites list, with validation to prevent duplicates.
    remove_favourite: Removes a product from a member's favourites list.
    get_favourite_by_id: Retrieves details of a favourite product by its ID.
    get_all_favourites: Retrieves all favourite products for a member.
    

API Endpoints

    Reviews
        POST /reviews: Create a new review.
        PUT /reviews/:reviewId: Update an existing review.
        DELETE /reviews/:reviewId: Delete a review.
        GET /reviews/member/:memberId: Retrieve all reviews posted by a member.

    Favourites
        POST /favourites: Add a product to favourites.
        GET /favourites/member/:memberId: Retrieve all favourite products for a member.
        GET /favourites/:favouriteId: Retrieve details of a favourite product by ID.

Error Handling

    The backend handles errors gracefully, providing meaningful error messages in case of validation failures, database errors, or other exceptions.
    Frontend applications should handle HTTP error codes and display appropriate messages to users.

    ## Setup

1. repository link> https://github.com/MoeMyatThweMT/dbs-assignment-MoeMyatThweMT


2. Create a .env file with the following content

    ```
    DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_HOST=your-db-host
DB_DATABASE=your-db-name
DB_CONNECTION_LIMIT=1
PORT=3000
    ```

3. Update the .env content with your database credentials accordingly.

4. Install dependencies by running `npm install`

5. Start the app by running `npm start`. Alternatively to use hot reload, start the app by running `npm run dev`.

6. You should see `App listening on port 3000`

8. (Optional) install the plugins recommended in `.vscode/extensions.json`

## Instructions

Open the page, `http://localhost:3000`, replace the port number accordingly if you app is not listening to port 3000
