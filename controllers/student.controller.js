const Student = require("../models/student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/mail");


const Register = async (req, res) => {
    try {
        const { username, firstname, lastname, email, age, phone, address, password } = req.body;



        if (!username || !email || !password) {
            return res.status(400).json({ msg: "Either email, password, or name is missing" });
        }


        const photoPath = req.file?.path || null;
        const salt = await bcrypt.genSalt(10);
        const hashedPw = await bcrypt.hash(password, salt);

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        const newStudent = new Student({
            username,
            firstname,
            lastname,
            age,
            email,
            phone,
            address,
            photo: photoPath,
            password: hashedPw,
            otp,
            isVerified: false
        });

        await newStudent.save();
        await sendEmail({ userEmail: email, otp });
        return res.status(201).json({ msg: "OTP is sent for verification" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error" });
    }
}

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Student.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "Email or password is incorrect" });
        }

        if (!user.isVerified) {
            return res.status(400).json({ msg: "Please verify your email before logging in" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json({ msg: "Wrong password" });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                user: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: isProduction,
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ msg: "User is logged in", token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error" });
    }
}


const VerifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await Student.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ msg: "Invalid OTP" });
        }

        // OTP is correct, mark user as verified
        user.isVerified = true;
        user.otp = null; // Remove OTP after verification
        await user.save();

        return res.status(200).json({ msg: "User verified successfully, you can now log in" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error" });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { firstname, lastname, age, phone, address, photo } = req.body;
        const User = req.user.username;
        const isVerified = req.user.isVerified;
        if (!isVerified) {
            return res.status(400).json({ msg: "Please verify your email before update" });
        }
        const photoPath = req.file?.path || null;


        const userUpdate = await Student.findOneAndUpdate({ username: User },
            {
                firstname,
                lastname,
                age,
                phone,
                address,
                photo: photoPath,
            },
            {
                new: true, runValidators: true
            }
        )

        res.status(200).json({ msg: userUpdate });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "internal server error" })
    }
}

const getMyProfile = async (req, res) => {
    try {
        const User = req.user.username;
        const user = await Student.find({ username: User });


        if (!user) {
            res.status(400).json({ msg: "no user found" })
        }
        res.status(200).json({ msg: user });
    } catch (error) {
        console.log(error);

    }
}

// const follow = async (req, res) => {
//     try {
//         const { username } = req.body;
//         const mySelf = req.user.username;

//         if (!username) {
//             res.status(400).json({ msg: "user is required to get followed" });
//         }
//         const user = await Student.findOneAndUpdate({ username }, {
//             $addToSet: { follower: mySelf }
//         }, { new: true });


//         const myself = await Student.findOneAndUpdate({ username: mySelf }, {
//             $addToSet: {
//                 following: username
//             }
//         }, { new: true });


//         res.status(200).json({
//             usermsg: user,
//             myuser: myself,
//         });

//     } catch (error) {
//         res.status(500).json({
//             msg: error.message
//         });
//     }
// }


const follow = async (req, res) => {
    try {
        const { username } = req.body;
        const mySelf = req.user.username;

        if (!username) {
            return res.status(400).json({ msg: "Username is required." });
        }

        if (username === mySelf) {
            return res.status(400).json({ msg: "You cannot follow/unfollow yourself." });
        }

        const targetUser = await Student.findOne({ username });
        const currentUser = await Student.findOne({ username: mySelf });

        if (!targetUser || !currentUser) {
            return res.status(404).json({ msg: "User not found." });
        }

        const isFollowing = currentUser.following.includes(username);

        let updatedTarget, updatedCurrent;

        if (isFollowing) {
            // Unfollow
            updatedTarget = await Student.findOneAndUpdate(
                { username },
                { $pull: { follower: mySelf } },
                { new: true }
            );

            updatedCurrent = await Student.findOneAndUpdate(
                { username: mySelf },
                { $pull: { following: username } },
                { new: true }
            );

            return res.status(200).json({
                msg: `Unfollowed ${username}`,
                usermsg: updatedTarget,
                myuser: updatedCurrent
            });
        } else {
            // Follow
            updatedTarget = await Student.findOneAndUpdate(
                { username },
                { $addToSet: { follower: mySelf } },
                { new: true }
            );

            updatedCurrent = await Student.findOneAndUpdate(
                { username: mySelf },
                { $addToSet: { following: username } },
                { new: true }
            );

            return res.status(200).json({
                msg: `Followed ${username}`,
                usermsg: updatedTarget,
                myuser: updatedCurrent
            });
        }

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};



module.exports = { Register, Login, VerifyOtp, updateProfile, getMyProfile, follow }