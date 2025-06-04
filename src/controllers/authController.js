import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import transactionModel from '../models/transactionModel.js'
import jwt from 'jsonwebtoken'

const authController = {
    async signUpAction(req, res) {
        const midtransUrl = process.env.MIDTRANS_URI
        const midtransAuthString = process.env.MIDTRANS_SERVER_KEY

        try {
            const body = req.body

            const hashPassword = bcrypt.hashSync(body.password, 12)

            const user = new userModel({
                name: body.name,
                email: body.email,
                photo: 'default.png',
                password: hashPassword,
                role: 'manager'
            })

            const transaction = await transactionModel({
                user: user._id,
                price: 250000
            })

            const midtrans = await fetch(midtransUrl, {
                method: 'POST',
                body: JSON.stringify({
                    transaction_details: {
                        order_id: transaction._id.toString(),
                        gross_amount: transaction.price
                    },
                    credit_card: {
                        secure: true
                    },
                    customer_details: {
                        email: user.email
                    },
                    callbacks: {
                        finish: 'http://localhost:5173/success-checkout'
                    }
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${midtransAuthString}`
                }
            })

            const resMidtrans = await midtrans.json()

            await user.save()
            await transaction.save()
            return res.status(200).json({
                success: true,
                message: 'Sign up success',
                data: {
                    midtrans_url: resMidtrans.redirect_url
                }
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Internal server error'
            })
        }
    },

    async signInAction(req, res) {
        try {
            const body = req.body

            const exisitingUser = await userModel.findOne().where('email').equals(body.email)

            if(!exisitingUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                })
            }

            const comparePassword = bcrypt.compareSync(
                body.password,
                exisitingUser.password
            )

            if(!comparePassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid / Incorrect password'
                })
            }

            const isValidUser = await transactionModel.findOne({
                user: exisitingUser._id,
                status: 'success'
            })

            if(exisitingUser.role !== 'student' && !isValidUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User not verified'
                })
            }

            const token = jwt.sign(
                {
                    data: {
                        id: exisitingUser._id.toString()
                    }
                },
                process.env.JWT_SECRET,
                {expiresIn: '1 days'}
            )

            return res.status(200).json({
                success: true,
                message: 'Login success',
                data: {
                    name: exisitingUser.name,
                    email: exisitingUser.email,
                    token,
                    role: exisitingUser.role,
                }
            })
        } catch (error) {
              console.log(error)
              return res.status(500).json({
                    message: 'Internal server error'
                })
        }
    }
}

export default authController