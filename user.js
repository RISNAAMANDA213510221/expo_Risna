const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
      {
        nama: String,
        email: { type: String, unique: true },
        npm: String,
        password: String
      },
      {
            collection: "user"
      }
);

mongoose.model("user", UserSchema);


const ScheduleSchema = new mongoose.Schema(
      {
        
       newTask: String,
      },
      {
        collection: "Home",
      }
    );

mongoose.model("Home", ScheduleSchema);