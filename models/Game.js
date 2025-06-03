const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1/chessLogin`);

const gameSchema = mongoose.Schema({
    username: String,
    password: String,
});

module.exports = mongoose.model("Game", gameSchema);