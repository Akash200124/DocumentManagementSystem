import mongoose from "mongoose";


const connecttoDB = async () => {
    try {
        const dbURL = process.env.MONGODB_URI;
        console.log(dbURL);
        const connection = await mongoose.connect(`${dbURL}`);
        console.log("Connected to DB")
        console.log(connection.connection.host);

    } catch (error) {
        console.log('error in db connection', error.message);
        process.exit(1);
    }
}

export default connecttoDB