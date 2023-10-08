const express = require("express");
const router = express.Router();
const Flight = require("../models/Flight.js");
const axios = require("axios");
const cheerio = require("cheerio");




https://www.ucuzabilet.com/dis-hat-arama-sonuc?from=IST&to=LHR&ddate=27.12.2023&adult=1

router.get('/', (req, res) => {
  Flight.aggregate([
    {
      $group: {
        _id: {
          currentDate: '$currentDate',
          city1: '$city1',
          city2: '$city2'
        },
        flights: { $push: '$$ROOT' },
      },
    },
    {
      $unwind: '$flights'
    },
    {
      $sort: {
        'flights.date': 1,'flights.flightTime':1, // date alanına göre artan sıralama
      }
    },
    {
      $group: {
        _id: '$_id',
        flights: { $push: '$flights' }
      }
    }
  ])
    .then((result) => {
      res.render('site/page', { flights: result });
    })
    .catch((err) => {
      console.error(err);
    });
});


module.exports = router;
