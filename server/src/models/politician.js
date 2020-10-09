const mongoose = require('mongoose');

const { Schema } = mongoose;

const cantons = [
  'AG',
  'AI',
  'AR',
  'BE',
  'BL',
  'BS',
  'FR',
  'GE',
  'GL',
  'GR',
  'JU',
  'LU',
  'NE',
  'NW',
  'OW',
  'SG',
  'SH',
  'SO',
  'SZ',
  'TG',
  'TI',
  'UR',
  'VD',
  'VS',
  'ZG',
  'ZH',
];

const platforms = ['Facebook', 'Twitter', 'Instagram'];

const imageDataSchema = new Schema({
  text: String,
  objects: [String],
});

const postSchema = new Schema({
  platform: {
    type: String,
    enum: platforms,
    required: true,
  },
  text: String,
  hastags: [String],
  mentions: [String],
  imageData: imageDataSchema,
});

const socialMediaSchema = new Schema({
  facebookUsername: String,
  twitterUsername: String,
  instagramUsername: String,
  posts: [postSchema],
});

const periodSchema = new Schema({
  start: Date,
  end: Date,
});

const politicianSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  parties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Party',
    },
  ],
  pictureUrl: {
    type: String,
    required: true,
  },
  canton: {
    type: String,
    enum: cantons,
    required: true,
  },
  socialMedia: socialMediaSchema,
  periods: [periodSchema],
});

const Politician = mongoose.model('Politician', politicianSchema);

module.exports = Politician;
