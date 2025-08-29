import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { encodeFullName } from '../utilis/fullName';

const prisma = new PrismaClient();

export const registerUser = async (req, res) => {
    try {
        const {firstName, secondName, thirdName, phone, email, password } = req.body;

        //checking for two names
        const providedNames =  [firstName, secondName, thirdName ].filter(Boolean);
        if (providedNames.length < 2) {
            return res.status(400).json({ error: "Ypu must provide at least two names."});
        }

        if (!password || password.length < 6){
            return res.status(400).json({ error: "Password must be at least 6 characters long."});
        }

        if(password !== confirmPassword){
            return res.status(400).json({ error: "Passwords do not match."});
        }

        const emailExists = await prisma.user.findUnique({ where: { email } });
        if(emailExists) {
            return res.status(400).json({ error: "Email is already registered."});
        }

        const phoneExists = await prisma.user.findUnique({ where: { phone } });
        if(phoneExists){
            return res.status(400).json({ error: "Phone number is already registered."});
        }

        const hashedPassword = await bcrypt.hash(password, 6);

        const newUser = await prisma.user.create({
            data: {
                firstName,
                secondName,
                thirdName,
                phone,
                email,
                password: hashedPassword,
            }
        });

        const fullName = encodeFullName(newUser.firstName, newUser.secondName, newUser.thirdName);

        res.status(201).json({
            message: "User registered successfully.",
            user: {
                id: newUser.id,
                fullName,
                firstName: newUser.firstName,
                secondName: newUser.secondName,
                thirdName: newUser.thirdName,
                phone: newUser.phone,
                email: newUser.email,
            }
        });

    }catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "An error occurred while registering the user."});
    }
};