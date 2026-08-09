const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        donor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        donationType: {
            type: String,
            enum: ["money", "food", "clothes", "medicine", "other"],
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        remainingQty: {
            type: Number,
            required: true,
            min: 0
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "completed"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Post", postSchema);