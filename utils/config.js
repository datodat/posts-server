require('dotenv').config();

const PORT = process.env.PORT || 3001;
const MONGOURL = process.env.MONGOURL;

module.exports = {
  PORT,
  MONGOURL
}