require('dotenv').config()

const PORT = process.env.PORT
const DATABASE_CONNECTION_URL = process.env.DATABASE_CONNECTION_URL

module.exports = {
    DATABASE_CONNECTION_URL,
    PORT
}