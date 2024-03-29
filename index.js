const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const taskModel = require("./models/gantt_tasks");
const mongoose = require("mongoose");
const moment = require("moment");
const cors = require("cors");
const e = require("express");
const { send } = require("process");
require("date-format-lite");
require("dotenv").config();
var port = 1337;
var app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.listen(process.env.PORT || 1337, "0.0.0.0", () => {
  console.log("Server is running.");
});
const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@bme-booking.iht5j.mongodb.net/bookings?retryWrites=true&w=majority`
    );
    console.log("Mongoose connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectDB();

app.get("/data", async (req, res) => {
  try {
    const data = await taskModel.find({}).then((response) => {
      response.forEach((element) => {
        const start_date = moment(element.start_date).format(
          "YYYY-MM-DD hh:mm:ss"
        );
        // console.log(element.id);
        element.start_date = start_date;
      });

      res.send({
        data: response,
        collections: { links: [] },
      });
    });
    return data;
  } catch (error) {
    console.log(error);
  }
});

// get task by id
app.get("/data/task/:id", async (req, res) => {
  let id = req.params.id;
  const entity = await taskModel
    .findOne({ id: id })
    .then((response) => {
      sendResponse(res, "find", response);
    })
    .catch((error) => console.log(error));
  return entity;
});

app.post("/data/task", async (req, res) => {
  console.log(req.body);
  var task = getTask(req.body);
  // let id = 0;
  // const tasks = await taskModel.find({}).then((response) => {
  //   id = response.length + 1;
  //   task.id = id;
  // });

  // console.log("task: ", task);

  const newTask = new taskModel(task);
  try {
    newTask.save().then((result) => {
      sendResponse(res, "inserted", result);
    });
  } catch (error) {
    sendResponse(res, "error", null, error);
  }
});

// update task
app.put("/data/task/:id", async (req, res) => {
  const sid = req.params.id;
  const newTask = getTask(req.body);
  console.log(newTask);
  try {
    const q = await taskModel
      .updateOne({ id: sid }, newTask)
      .then((response) => {
        sendResponse(res, "updated", response);
      });
  } catch (error) {
    sendResponse(error, "error", null, error);
  }
});

// delete all
app.delete("/data/task/delete", async function (req, res) {
  const response = await taskModel
    .deleteMany({})
    .then(() => {
      sendResponse(res, "deleted all");
    })
    .catch(function (error) {
      sendResponse(res, "error", null, error);
    });
});

// delete a task
app.delete("/data/task/:id", function (req, res) {
  var sid = req.params.id;
  console.log(sid);
  const response = taskModel
    .findOneAndDelete({ id: sid })
    .then(() => {
      sendResponse(res, "deleted");
    })
    .catch(function (error) {
      sendResponse(res, "error", null, error);
    });
});

// find all childrens
app.get("/data/task/child/:id", async (req, res) => {
  let id = req.params.id;
  const childrens = await taskModel
    .find({ parent: id })
    .then((response) => {
      sendResponse(res, "find childrens", response);
    })
    .catch((error) => {
      sendResponse(res, "find childrens error", error);
    });
});

function getTask(data) {
  return {
    id: data.id,
    text: data.text,
    start_date: data.start_date.date("YYYY-MM-DD hh:mm"),
    duration: data.duration,
    progress: data.progress || 0,
    parent: data.parent,
    phone: data.phone,
  };
}

function sendResponse(res, action, tid, error) {
  if (action == "error") console.log(error);

  var result = {
    action: action,
  };
  if (tid !== undefined && tid !== null) {
    result.tid = tid;
    result.success = true;
  }

  res.send(result);
}
