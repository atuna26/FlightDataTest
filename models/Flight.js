const mongoose = require("mongoose")

const FlightSchema = new mongoose.Schema({
    flightNo:{type:String},
    flightTime:{type:String},
    price:{type:String},
    currency:{type:String},
    airline:{type:String},
    date:{type:String},
    city1:{type:String},
    city2:{type:String},

    currentDate: { 
        type: Date, 
        default: () => {
          const now = new Date();
          return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:00`;
        } 
      },
})

module.exports = mongoose.model("Flight", FlightSchema)