const mongoose = require('mongoose')
const { Schema } = mongoose;

const FileSchema = new Schema(
  {
    name: { type: Schema.Types.String, required: true },
    path: { type: Schema.Types.String, required: true },
    size: { type: Schema.Types.Number, required: true },
    type: { type: Schema.Types.String, required: true },
    permittedUsers: [
      new Schema(
        {
          userEmail: {
            type: String,
            required: true,
          },
        },
      ),
    ],
  },
);

module.exports = mongoose.model("file", FileSchema);
