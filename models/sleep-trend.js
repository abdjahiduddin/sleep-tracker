const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SleepTrendSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    duration: {
      hour: {
        type: Number,
        required: true,
      },
      minute: {
        type: Number,
        required: true,
      },
      seconds: {
        type: Number,
        required: true,
      },
    },
    timezone: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SleepTrend", SleepTrendSchema);
