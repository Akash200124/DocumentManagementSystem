import { User } from "../models/user.model.js";


const generateAccessAndRefressTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        const refreshToken = user.generateRefreshToken();
        const acessToken = user.generateAccessToken();

        user.refreshToken = refreshToken;


        await user.save({ validateBeforeSave: false });
        return { acessToken, refreshToken }

    } catch (error) {
       console.log(  "Something went wrong while generating refress ans access token", error.message);
    }
}

const register = async (req, res) => {

    const { name, email, password } = req.body;
    console.log(req.body);

    if (!name || !email || !password) {
        return res.status(400).json({
            "success": false,
            "message": "All fields are required"
        })
    }

    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                "success": false,
                "message": "User already exists"
            })
        }

        const newUser = await User.create({
            name,
            email,
            password
        })


        const Cresteduser = await User.findById(newUser._id).select("-password");

        return res.status(201).json({
            "success": true,
            "message": "User created successfully",
            "data": Cresteduser
        })

    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Something went wrong creating user",
            "error": error.message
        })
    }
}

const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            "success": false,
            "message": "All fields are required"
        })
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                "success": false,
                "message": "User not found"
            })
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                "success": false,
                "message": "Invalid credentials"
            })
        }

        const tokens = await generateAccessAndRefressTokens(user._id);
        const { acessToken, refreshToken } = tokens;
        

        return res.status(200).json({
            "success": true,
            "message": "User logged in successfully",
            "data": {
                "acessToken": acessToken,
                "refreshToken": refreshToken
            }
        })

    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": "Something went wrong logging in user",
            "error": error.message
        })

    }

}


export {
    register,
    login
}