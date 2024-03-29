/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Chirag Garg Student ID: 143180214 Date: 18 May 2023
*  Cyclic: https://shy-rose-wasp-vest.cyclic.app
*
********************************************************************************/ 


// importing and using as a middleware function
const cors = require('cors');
const express = require('express');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
require('dotenv').config();
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
app.use(cors());
app.use(express.json());

// adding a single GET route which returns the JSON object
app.get('/', (req, res) => 
{
    res.json({message: 'API Listening'})
})

// add a new movie to the collection
// return the object or message to the client
app.post("/api/movies", (req, res) => 
{
    const newMovieAdded = req.body;
    db.addNewMovie(newMovieAdded)
    .then((movie) => 
    {
        res.status(201).json(movie);
    })
    .catch((err) => 
    {
        res.status(500).json({error: err});
    });
})

// accept the query to return all the movies
app.get("/api/movies", (req, res) => 
{
    const { page, perPage, title} = req.query;
    db.getAllMovies(page, perPage, title)
    .then((movie) => {
        res.status(201).json(movie);
    })
    .catch((err) => {
        res.status(500).json({error : err});
    });
})

// accept the route parameter that represents the _id
// accept the  numeric query parameter / string
app.get('/api/movies/:id', (req, res) => 
{
    const id = req.params;
    db.getMovieById(id)
    .then((movie) => {
        res.status(201).json(movie);
    })
    .catch((err) => {
          res.status(500).json({ error: err });
    });
})

// accept the route parameter
// use id to update the movie and return the message
app.put('api/movies/:id', (req, res) => 
{
    const { id } = req.params;
    const updatedMovie = req.body;
    
    db.updateMovieById(updatedMovie,id)
    .then(() => {
        res.status(201).json({message: 'Movie ID has been updated successfully'});
    })
    .catch((err) => {
        res.status(500).json({error : err});
    });
})

// accept the route parameter 
// use the id value to delete the movie document from collection
app.delete('api/movies/:id', (req, res) => 
{
    const id  = req.params.id;
    db.deleteMovieById(id)
    .then(() => {
        res.status(201).json({message: 'Movie has been deleted successfully'});
    })
    .catch((err) => {
        res.status(500).json({error : err});
    });
})

app.use((req, res) => {
    res.status(204).json({message: "Resource not found"});
});


// invoking the string method 
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});



