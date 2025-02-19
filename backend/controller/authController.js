const User = require("../models/User");
const Poll = require("../models/Poll");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

//! Generate JWT token 

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" })
}

//! Register User 

exports.registerUser = async (req, res) => {
	const { fullName, userName, email, password, profileImageUrl } = req.body;

	//! Validation : Check miss fields

	if (!fullName || !userName || !email || !password) {
		return res.status(400).json({ message: "All fields are required" })
	}

	//! Validation : Check username format
	//! Allows alphanumeric charters and hyphens only

	const usernameRegex = /^[a-zA-Z0-9-]+$/
	if (!usernameRegex.test(userName)) {
		return res.status(400).json({
			message:
				"Invalid username. Only alphanumeric characters and hyphens are allowed. No space are permitted"
		})
	}

	try {

		//! Check if email already exists 
		const existingUser = await User.findOne({ email })
		if (existingUser) {
			return res.status(400).json({ message: "Email already in use" })
		}

		//! Check if username already exists
		const existingUserName = await User.findOne({ userName })
		if (existingUserName) {
			return res.status(400).json({ message: "Username not available. Try another one." })
		}

		//! Create the user
		const user = await User.create({
			fullName,
			userName,
			email,
			password,
			profileImageUrl,
		});

		res.status(201).json({
			id: user._id,
			user,
			token: generateToken(user._id),
		})

	} catch (error) {
		res.status(500).json({ message: "Error Registering User", error: error.message })
	}

}

//! Login User 

exports.loginUser = async (req, res) => {
	const { email, password } = req.body;

	//! Validation : Check miss fields

	if (!email || !password) {
		return res.status(400).json({ message: "All fields are required" })
	}

	try {
		const user = await User.findOne({ email })
		if (!user || !(await user.comparePassword(password))) {
			return res.status(400).json({ message: "Invalid credentials" })
		}

		//! Count polls created by the user
		const totalPollsCreated = await Poll.countDocuments({ creator: user._id })

		//! Count polls the user has voted in 
		const totalPollsVotes = await Poll.countDocuments({ voters: user._id })

		//! Count polls the user has bookmarked
		const totalPollsBookmarked = await user.bookmarkedPolls.length

		res
			.status(200)
			.json({
				id: user._id,
				user: {
					...user.toObject(),
					totalPollsCreated: totalPollsCreated,
					totalPollVotes: totalPollsVotes,
					totalPollsBookmarked: totalPollsBookmarked,
				},
				token: generateToken(user._id)
			})

	} catch (error) {
		res.status(500).json({ message: "Error Login User", error: error.message })
	}
}

//! Get User Info

exports.getUserInfo = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password")

		if (!user) {
			return res.status(404).json({ message: "User not found" })
		}
		//! Count polls created by the user
		const totalPollsCreated = await Poll.countDocuments({ creator: user._id })

		//! Count polls the user has voted in 
		const totalPollsVotes = await Poll.countDocuments({ voters: user._id })

		//! Count polls the user has bookmarked
		const totalPollsBookmarked = await user.bookmarkedPolls.length

		//! Add the new attributes to the response

		const userInfo = {
			...user.toObject(),
			totalPollsCreated: totalPollsCreated,
			totalPollVotes: totalPollsVotes,
			totalPollsBookmarked: totalPollsBookmarked,
		}

		res.status(200).json(userInfo)

	} catch (error) {
		res.status(500).json({ message: "Error Get User Info", error: error.message })
	}
}