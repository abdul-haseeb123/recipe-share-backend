import { Schema } from "mongoose";

const imageSchema = new Schema({
  asset_id: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
  resource_type: {
    type: String,
  },
  tags: [
    {
      type: String,
    },
  ],
  url: {
    type: String,
    required: true,
  },
  secure_url: {
    type: String,
    required: true,
  },
});
export default imageSchema;
