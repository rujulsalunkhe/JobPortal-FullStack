import { User } from "../models/user.model";
import bcrypt from 'bcryptjs';
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
    } catch (error) {

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

        const user = await User.findOne({ email });
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

        // const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

    } catch (error) {

    }

}

