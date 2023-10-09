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

router.get("/grafik/:city2/:time1/:time2/:date/",(req,res)=>{
  Flight.find({city2:req.params.city2,flightTime:req.params.time1+" "+req.params.time2,date:req.params.date}).lean().then(flight=>{
    res.render("site/grafik",{flights:flight})
  })
})

router.post("/grafikTest",(req,res)=>{
  res.redirect(req.body.date)
})

module.exports = router;
