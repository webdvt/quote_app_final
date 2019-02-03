const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');

const app = express();

const db = require('./config/keys').mongoURI;

// Connecting to MongoDB database
mongoose
   .connect(db)
   .then(() => console.log('MongoDB Connected'))
   .catch(err => console.log(err));

// Body parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Handlebars Middleware
app.engine('handlebars', exphbs({
   defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Method Override Middleware
app.use(methodOverride('_method'));

const port = 3000;

// Listening
app.listen(3000,  () => {
   console.log(`Server running on port ${port}...`)
});

// Quote model
const Quote = require('./models/Quote');

// Get all quotes
app.get('/', (req, res) => {
   Quote.find({})
      .then(quotes => {
         res.render('index', {quotes: quotes})
      })
});

// Get edit form
app.get('/edit/:id', (req, res) => {
   Quote.findOne({
      _id: req.params.id
   })
      .then(quote => {
         res.render('edit', {
            quote: quote
         })
      })
});

// Add a quote
app.post('/quotes', (req, res) => {
   //Creating new quote
   const newQuote = new Quote({
      name: req.body.name,
      quote: req.body.quote
   });

   // Save quote
   new Quote(newQuote).save()
      .then(res.redirect('/'));

});

// Edit a quote
app.put('/quotes/:id', (req, res) => {
   Quote.findOne({
      _id: req.params.id
   })
      .then(quote => {
         // new values
         quote.name = req.body.name;
         quote.quote = req.body.quote;

         quote.save()
            .then(() => {
               res.redirect('/');
            })
      });
});

// Delete a quote
app.delete('/quotes/:id', (req, res) => {
   Quote.remove({_id: req.params.id})
      .then(() => {
         res.redirect('/');
      });
});