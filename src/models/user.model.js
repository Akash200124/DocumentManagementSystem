import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    }
    

}, {
    timestamps: true
});

// middle ware to encrypt password 
userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// method to compre password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// generate jwt tokens 
userSchema.methods.generateRefreshToken = function () {
    const token = jwt.sign(
        {
            _id: this._id,

        },
        
        process.env.REFRESH_TOKEN_SECRET,

        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )

    return token;
}

userSchema.methods.generateAccessToken = function () {
    
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,

        },
          process.env.ACCESS_TOKEN_SECRET,

        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )   

}


export const User = mongoose.model('User', userSchema); 