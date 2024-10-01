import { User } from "../models/user.model";
import bcrypt from 'bcryptjs';
import { json } from "express";
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: 'something is missing',
                sucess: false
            })
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'user already exist with this email',
                sucess: false
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role
        })

        return res.status(201), json({
            message: 'Account Created Sucessfully',
            sucess: true
        })
    } catch (error) {
        console.log(error);

    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body
        if (!email || !password || !role) {
            return res.status(400).json({
                message: 'something is missing',
                sucess: false
            })
        };

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'Incorrect email or Password',
                sucess: false
            })
        };

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                message: 'Incorrect email or Password',
                sucess: false
            })
        };

        if (role !== user.role) {
            return res.status(400).json({
                message: `Account doesn't exist with Current Role`,
                sucess: false
            })
        };

        const tokenData = {
            userId: user._id
        };

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        }

        return res.status(200).cookie('token', token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `welcome back ${user.fullname}`,
            user,
            sucess: true
        })

    } catch (error) {
        console.log(error);
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie('token', '', { maxAge: 0 }), json({
            message: 'Logout Sucessfully',
            sucess: true
        })
    } catch (error) {
        console.log(error);

    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        if (!fullname || !email || !phoneNumber || !bio || !skills) {
            return res.status(400).json({
                message: 'something is missing',
                sucess: false
            })
        }

        const skillsArray = skills.split(',');
        const userId = req.id;
        let user = await User.findOne(userId);

        if (!user) {
            return res.status(400).json({
                message: 'User Not Found',
                sucess: false
            })
        }

        user.fullname = fullname,
            user.email = email,
            user.phoneNumber = phoneNumber,
            user.profile.bio = bio,
            user.profile.skills = skillsArray

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        }

        return res.status(200).json({
            message: 'Profile Ubdated Sucessfully',
            user,
            sucess: true
        })
    } catch (error) {
        console.log(error);

    }
}
