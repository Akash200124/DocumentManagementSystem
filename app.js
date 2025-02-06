
import express from "express";



const app =express();


const corsOptions = {
    origin: "https://document-management-system-fe.vercel.app",
}

app.use(cors(corsOptions));

app.use(express.json({ "limit": "16kb" }));


app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


// routes
import userRoutes from "./src/routes/user.route.js";
import fileRoutes from "./src/routes/file.route.js";


app.use("/api/v1/user", userRoutes);
app.use('/api/v1/file',fileRoutes)







export {app}