# MEDP33100 - Final Project, Public Archive

## Live Demo

-https://final-project-1-pfs6.onrender.com 

## Project Overview

- My project is a live, interactive website where users are prompted with reflective questions and invited to write anonymous letters to their future selves. Each letter is stored and displayed in a public archive that other users can browse and filter by emotional category. 
## Endpoints

The project includes the following API endpoints:

GET /entries
Returns all letter entries from the database.
Supports optional filtering by tag using query parameters.

GET /entries?tag=:tag
Returns only entries that match a specific emotional tag (e.g. hopeful, reflective).

GET /entries/:id
Returns a single letter entry by its unique ID.
Used when opening a letter in the modal view.

POST /entries
Creates a new letter entry.
Accepts a JSON body containing the message, prompt, tag, and timeframe.
## Technologies Used

- List the technologies and tools used in the project:
    Languages

HTML

CSS

JavaScript

Frameworks & Libraries

Node.js

Express.js

Mongoose (MongoDB ODM)

Database

MongoDB Atlas

Templating

Handlebars (HBS)

## Credits

- google fonts 
## Future Enhancements

- more animations for the envelopes 
- an option to change the theme of the site (in terms of color schemes)
- finding different fonts to use 
