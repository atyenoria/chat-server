import bcrypt from 'bcrypt-nodejs';

import mongoose from 'mongoose';

export const User1 = mongoose.Schema({
    local: {
        username: {
            type: String,
            unique: true
        },
        password: String,
        email: String,
        socketid: String
    },
    facebook: {
        id: String,
        username: String,
        token: String,
        email: String
    }
});
User1.pre('save', next => {
    const currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    next();
});
// stashed async methods
// UserSchema.methods.generateHash = function generateHash(password, callback) {
//   bcrypt.genSalt(8, function(err, salt) {
//     bcrypt.hash(password, salt, null, function saveHashedPassword(err, hash) {
//       if (err) throw err;
//       callback(hash);
//     });
//   });
// };
//
// UserSchema.methods.checkPassword = function(password, cb) {
// 	bcrypt.compare(password, this.password, function(err, response) {
// 		if (err) {
// 			return cb(err);
// 		}
// 		cb(null, response);
// 	});
// };
User1.methods.generateHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
// checking if password is valid
User1.methods.validPassword = password => {
    return bcrypt.compareSync(password, this.local.password);
};



export const User2 = mongoose.Schema({
    name: String,
    password: String,
    admin: Boolean
});