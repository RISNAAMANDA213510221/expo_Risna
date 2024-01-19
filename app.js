const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());

app.use(express.json());

const mongoUrl = "mongodb://localhost:27017/prak_DPM";

const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";

mongoose.connect(mongoUrl).then(() => {
      console.log("Database Terhubung")
}).catch((e) => {
      console.log(e)
});

require('./user')

const User = mongoose.model("user")

app.get("/", (req, res) => {
      res.send({ status: "mulai" })
})

// REGISTER
app.post('/register', async (req, res) => {
      const { nama, email, npm, password } = req.body;

      const oldUser = await User.find({ email: email });

      if (oldUser.length > 0) {
            return res.send({ data: "user sudah ada!!" })
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      try {
            await User.create({
                  nama: nama,
                  email: email,
                  npm,
                  password: encryptedPassword,
            });
            res.send({ status: 'ok', data: 'user dibuat' })
      } catch (error) {
            res.send({ status: 'error', data: error })
      }
});

//LOGIN
app.post("/login", async (req, res) => {
      const { email, password } = req.body;
      const oldUser = await User.findOne({ email: email })

      if (!oldUser) {
            return res.send({ data: "user tidak di temukan !!" })
      }

      if (await bcrypt.compare(password, oldUser.password)) {
            const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);

            if (res.status(201)) {
                  return res.send({ status: "ok", data: token })
            } else {
                  return res.send({ error: "error" })
            }
      }
})

//READ USER DATA
app.post("/userdata", async (req, res) => {
      const { token } = req.body;
      try {
            const user = jwt.verify(token, JWT_SECRET)
            const useremail = user.email
            User.findOne({ email: useremail }).then(data => {
                  return res.send({ status: "ok", data: data })
            })
      } catch (error) {
            return res.send({ error: "error" })

      }
})



// CREATE SCHEDULES
app.post("/createHome", async (req, res) => {
      const { newTask} = req.body;

      try {
            const newSchedule = await mongoose.model("Home").create({
                  newTask,
            });

            res.send({ status: 'ok', data: newSchedule });
      } catch (error) {
            res.send({ status: 'error', data: error.message });
      }
});


// WRITE SCHEDULES
app.get("/getHome", async (req, res) => {
      try {
            const schedules = await mongoose.model("Home").find();
            res.send({ status: 'ok', data: schedules });
      } catch (error) {
            res.send({ status: 'error', data: error.message });
      }
});

// UPDATE SCHEDULES
app.post("/updateHome", async (req, res) => {
    const { HomeId, newTask } = req.body;

    try {
          const updatedTask = await mongoose.model("Home").findOneAndUpdate(
                { _id: HomeId },
                { $set: { newTask} },
                { new: true }
          );

          if (!updatedTask) {
                return res.status(404).send({ status: 'error', data: 'Schedule not found' });
          }

          res.send({ status: 'ok', data: updatedTask });
    } catch (error) {
          res.send({ status: 'error', data: error.message });
    }
});


// DELETE SCHEDULES
app.delete("/deleteHome/:HomeId", async (req, res) => {
      const HomeId = req.params.HomeId;

      try {
            const deletedHome = await mongoose.model("Home").findByIdAndDelete(HomeId);

            if (!deletedHome) {
                  return res.status(404).send({ status: 'error', data: 'Schedule not found' });
            }

            res.send({ status: 'ok', data: deletedHome });
      } catch (error) {
            res.send({ status: 'error', data: error.message });
      }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
      console.log(`Server Berjalan di port ${PORT}`)
})