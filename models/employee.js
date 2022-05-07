const mongoose = require("mongoose");
// const uuidv4 = require("uuid/v4");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 32,
    },
    age: {
      type: Number,
      required: true,
    },
    department: {
      type: String,
      required: true,
      maxlength: 32,
    },
    salt: String,
    encry_password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

employeeSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    // this.salt = Math.random().toString(36).substring(7);
    this.salt = uuidv4();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

employeeSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function (plainpassword) {
    if (!plainpassword) {
      return "";
    }
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("Employee", employeeSchema);
