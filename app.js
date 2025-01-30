
import express from "express";



const app =express();

app.use(express.json({ "limit": "16kb" }));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


// routes
import userRoutes from "./src/routes/user.route.js";
import fileRoutes from "./src/routes/file.route.js";


app.use("/api/v1/user", userRoutes);
app.use('/api/v1/file',fileRoutes)







export {app}