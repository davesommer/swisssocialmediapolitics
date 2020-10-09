const mongoose = require('mongoose');

const { Schema } = mongoose;

const partySchema = new Schema({
  shortNmae: {
    type: String,
    required: true,
  },
  longName: {
    type: String,
    required: true,
  },
  pictureUrl: {
    type: String,
    required: true,
  },
  politicians: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Politician',
    },
  ],
});

const Party = mongoose.model('Party', partySchema);

module.exports = Party;
