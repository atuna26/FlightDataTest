const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const helpers = require("handlebars-helpers");
const moment = require("moment");
const Flight = require("./models/Flight");
const router = express.Router();

mongoose.set("strictQuery", false);

mongoose.connect(
  "mongodb+srv://alperentuna26:ormVStovLdVRQyUk@atuna.uqlxl3k.mongodb.net/FlightDataTrack",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(
  expressSession({
    secret: "testotesto",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://alperentuna26:ormVStovLdVRQyUk@atuna.uqlxl3k.mongodb.net/learningManagement",
    }),
  })
);

app.use(express.static("public"));
app.use(methodOverride("_method"));

const hbs = exphbs.create({
  helpers: {
    trim: function(e){
      let newText = e.slice(0,5)+e.slice(6)
      return newText.slice(0,5)+"/"+newText.slice(5)
    },
    any: function () {
      let options = arguments[arguments.length - 1];
      let args = Array.prototype.slice.call(arguments, 0, -1);
      for (let i = 0; i < args.length; i++) {
        if (args[i]) {
          if (options.fn) {
            return options.fn(this);
          } else {
            return args[i];
          }
        }
      }
      if (options.inverse) {
        return options.inverse(this);
      }
    },

    concat: function (str1, str2) {
      return str1 + str2;
    },
    times: function (n, block) {
      let accum = "";
      for (let i = 1; i <= n; ++i) accum += block.fn(i);
      return accum;
    },
    eqIds: function (id1, id2) {
      return id1.equals(id2);
    },
    eq: function (a, b) {
      return a === b;
    },
    add: function (value, addition) {
      return parseInt(value) + parseInt(addition);
    },
    moment: function (date) {
      return moment(date).format("YYYY-MM-DD");
    },
  },
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function getFlightData(url, day, month, year, city1, city2) {
  axios
    .get(url + day + month + year)
    .then((response) => {
      if (response.status === 200) {
        console.log(url + day + month + year);
        const html = response.data;
        const $ = cheerio.load(html);
        const divsWithClass = $("#flights-table>tbody>tr");
        // const otherDay = $(".alternative-day");

        const dataSameDay = [];
        const dataOtherDay = [];
        // console.log('------------------------');
        // console.log('| Gün       | Fiyat  | Kur       ');
        // console.log('------------------------');

        divsWithClass.each((i, div) => {
          let a = $(div).find(".flight-number").text().trim();
          let b = $(div).find(".integers ").first().text().trim();
          let c = $(div).find(".currency ").first().text().trim();
          let d = $(div).find(".airline").text().trim();
          let e = $(div)
            .find(".flight-time")
            .text()
            .trim()
          e = e.slice(0,5)+" " + e.slice(5)

          if (a) {
            dataSameDay.push({
              flightNo: a,
              flightTime: e,
              price: b,
              currency: c,
              airline: d,
            });
            Flight.create({
              flightNo: a,
              flightTime: e,
              price: b,
              currency: c,
              airline: d,
              date: year + "." + month + day,
              city1: city1,
              city2: city2,
            });
          }

          //  console.log(`| ${a} | ${b} | ${c} |`);
        });
        let sehir1 = city1;
        let sehir2 = city2;
        // otherDay.each((i, div) => {
        //   let a = $(div).find(".dayHeader").text().trim();
        //   let b = $(div).find(".integers ").first().text().trim();
        //   let c = $(div).find(".currency ").first().text().trim();

        //   const parts = a.split(" ");
        //   const day = parseInt(parts[0], 10);
        //   const month = parts[1].substring(0, 3); // Ayın ilk üç harfi
        //   const year = new Date().getFullYear(); // Yılı şu anki yıl olarak varsayalım
        //   const dayString = day < 10 ? `0${day}` : day.toString();
        //   const monthMap = {
        //     Eki: "10", // Ocak
        //     Kas: "11", // Şubat
        //     Ara: "12", // Mart
        //     // Diğer ayları da ekleyin
        //   };

        //   const monthNumber = monthMap[month];
        //   if (!monthNumber) {
        //     console.error("Geçersiz ay:", month);
        //     return;
        //   }

        //   const formattedDate = `${year}-${monthNumber}-${dayString}`;

        //   dataOtherDay.push({
        //     date: a,
        //     price: b,
        //     currency: c,
        //     city1: city1,
        //     city2: city2,
        //   });
        //   // Flight.create({
        //   //   date: formattedDate,
        //   //   price: b,
        //   //   currency: c,
        //   //   city1: sehir1,
        //   //   city2: sehir2,
        //   // });
        // });
        // console.table(dataOtherDay)
        console.log(
          `------------------------${new Date().getDate()}.${
            new Date().getMonth() + 1
          }.${new Date().getFullYear()}------------------------`
        );
        // console.table(dataSameDay)
        // console.log('------------------------');
      } else {
        console.error("HTTP isteği başarısız oldu");
      }
    })
    .catch((error) => {
      console.error("Hata:", error);
    });
}
function konsolaYaz() {
  console.log("kayıt");
}

function formatDay(day) {
  if (day < 10) {
    return `0${day}`;
  }
  return day.toString();
}

const days = [...Array(31).keys()].map((day) => formatDay(day + 1));
const months = [10, 11, 12]; // 10, 11 ve 12 ayları
const fromCity = "İstanbul";
const toCity = "İzmir";
const baseUrl =
  "https://www.ucuzabilet.com/ic-hat-arama-sonuc?from=IST&to=ADB&ddate=";
  const anotherUrl =
  "https://www.ucuzabilet.com/dis-hat-arama-sonuc?from=IST&to=LHR&ddate=";
let currentIndex = 0; // İndeks takibi için

function runInterval() {
  for(let months=10; months <= 12; months ++) {
    for (let day =1 ; day<=30; day++)  {
      if(day<10){
        day=`0${day}`;
      }
      setTimeout(() => {
        getFlightData(`${anotherUrl}`,`${day}.`,`${months}.`,`2023`, "İstanbul", "Londra");
        console.log(`${day}.`,`${months}.`,`2023`,)
        getFlightData(`${baseUrl}`,`${day}.`,`${months}.`,`2023`, fromCity, toCity);
        console.log(`${day}.`,`${months}.`,`2023`,)
      }, (months - 10) * 30 * 1000 + (day - 1) * 5000);
    }
  }
}

runInterval();
setInterval(runInterval, 43200000);

// // Tüm kombinasyonları oluştur
/* for (const day of days) {
   for (const month of months) {
      //Her bir kombinasyon için bir setInterval oluştur
     setInterval(() => {
       getFlightData(`${baseUrl}`,`${day}.`,`${month}.`,`2023`, fromCity, toCity);
     }, 60000);
   }
 }*/

// setInterval(() => {
//    getFlightData("https://www.ucuzabilet.com/ic-hat-arama-sonuc?from=IST&to=ADB&ddate=05.11.2023","İstanbul","İzmir");
// }, 10000);

// setInterval(() => {
//   getFlightData("https://www.ucuzabilet.com/ic-hat-arama-sonuc?from=IST&to=ADB&ddate=10.10.2023","İstanbul","İzmir");
//  }, 10000);

// setInterval(() => {
//   getFlightData("https://www.ucuzabilet.com/dis-hat-arama-sonuc?from=IST&to=LHR&ddate=05.12.2023&adult=1","İstanbul","Londra");
// }, 10000);

// setInterval(() => {
//   getFlightData("https://www.ucuzabilet.com/dis-hat-arama-sonuc?from=IST&to=LHR&ddate=05.11.2023&adult=1","İstanbul","Londra");
// }, 25000);

// setInterval(() => {
//   getFlightData("https://www.ucuzabilet.com/dis-hat-arama-sonuc?from=IST&to=LHR&ddate=10.10.2023&adult=1","İstanbul","Londra");
// }, 32000);

app.use((req, res, next) => {
  const main = require("./routes/main");
  app.use("/", main);
  next();
});

app.listen(process.env.PORT || 3000);
