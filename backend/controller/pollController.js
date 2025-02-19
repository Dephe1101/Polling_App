const User = require("../models/User");
const Poll = require("../models/Poll");


//! Create Poll
exports.createPoll = async (req, res) => {
    const { question, type, options, creatorId } = req.body

    if (!question || !type || !creatorId) {
        return res
            .status(400)
            .json({ message: "Question, type, and creatorId are required" })
    }


    try {
        let processOptions = []
        switch (type) {
            case "single-choice":
                if (!options || options.length < 2) {
                    return res.status(400).json({
                        message: "Single-choice poll must have at least two options."
                    })
                }

                processOptions = options.map((option) => ({ optionText: option }))
                break;

            case "rating":
                processOptions = [1, 2, 3, 4, 5].map((value) => ({
                    optionText: value.toString()
                }))
                break

            case "yes/no":
                processOptions = ["Yes", "No"].map((option) => ({
                    optionText: option
                }))
                break

            case "image-based":
                if (!options || options.length < 2) {
                    return res.status(401).json({ message: "Image-based poll must have at least two image URLs." })
                }
                processOptions = options.map((url) => ({ optionText: url }))
                break

            case "open-ended":
                processOptions = [] //! No options needed for open-ended
                break

            default:
                return res.status(400).json({ message: "Invalid poll type" });
        }

        const newPoll = await Poll.create({
            question,
            type,
            options: processOptions,
            creator: creatorId
        })

        res.status(201).json(newPoll);

    } catch (error) {
        res
            .status(500)
            .json({ message: "Error registering Poll", error: error.message })
    }
}

//! Get All Polls
exports.getAllPolls = async (req, res) => {
    const { type, creatorId, page = 1, limit = 10 } = req.query
    const filter = {}
    const userId = req.user._id

    if (type) filter.type = type
    if (creatorId) filter.creator = creatorId

    try {
        //! Calculate pagination parameters
        const pageNumber = parseInt(page, 10)
        const pageSize = parseInt(limit, 10)
        const skip = (pageNumber - 1) * pageSize

        //!Fetch poll with pagination
        const polls = await Poll.find(filter)
            .populate("creator", "fullName userName email profileImageUrl")
            .populate({
                path: "responses.voterId",
                select: "userName profileImageUrl fullName"
            })
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 })

        //!Add `userHasVoted` flag for each poll
        const updatedPolls = polls.map((poll) => {
            const userHasVoted = poll.voters.some((voterId) => voterId.equals(userId))
            return {
                ...poll.toObject(),
                userHasVoted
            }
        })


        //! Get total count of polls fot pagination metadata
        const totalPolls = await Poll.countDocuments(filter)

        const stats = await Poll.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    type: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ])

        //! Ensure all type are included in stats, even those with zero counts
        const allTypes = [
            {
                type: "single-choice", label: "Single Choice"
            },
            {
                type: "yes/no", label: "Yes/No"
            },
            {
                type: "rating", label: "Rating"
            },
            {
                type: "image-based", label: "Image Based"
            },
            {
                type: "open-ended", label: "Open Ended"
            },
        ]

        const statsWithDefaults = allTypes
            .map((pollType) => {
                const stat = stats.find((item) => item.type === pollType.type)
                return {
                    label: pollType.label,
                    type: pollType.type,
                    count: stat ? stat.count : 0,

                }
            })
            .sort((a, b) => b.count - a.count)
        res.status(200).json({
            polls: updatedPolls,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalPolls / pageSize),
            totalPolls,
            stats: statsWithDefaults
        })
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error get all Poll", error: error.message })
    }

}

//! Get All Voted Polls
exports.getVotedPolls = async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const userId = req.user._id
    try {
        //!Calculate pagination parameters
        const pageNumber = parseInt(page, 10)
        const pageSize = parseInt(limit, 10)
        const skip = (pageNumber - 1) * pageSize

        //!Fetch poll where the user has voted
        const polls = await Poll.find({ voters: userId })
            .populate("creator", "fullName profileImageUrl userName email")
            .populate({
                path: "responses.voterId",
                select: 'username profileImageUrl fullName'
            })
            .skip(skip)
            .limit(pageSize)


        //!Add `userHasVoted` flag for each poll
        const updatedPolls = polls.map((poll) => {
            const userHasVoted = poll.voters.some((voterId) => voterId.equals(userId))
            return {
                ...poll.toObject(),
                userHasVoted
            }
        })

        //! Ger total count of voted polls for pagination metadata

        const totalVotedPolls = await Poll.countDocuments({ voters: userId })

        res.status(200).json({
            polls: updatedPolls,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalVotedPolls / pageSize),
            totalVotedPolls
        })

    } catch (error) {
        res
            .status(500)
            .json({ message: "Error get all Vote on Poll", error: error.message })
    }
}

//! Get Polls ID
exports.getPollById = async (req, res) => {
    const { id } = req.params
    try {

        const poll = await Poll.findById(id)
            .populate("creator", "username email")
            .populate({
                path: "responses.voterId",
                select: "userName profileImageUrl fullName"
            })
        if (!poll) {
            return res.stats(400).json({ message: "Poll not found" })
        }
        res.status(200).json(poll)
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error get PollId", error: error.message })
    }
}

//! Vote On Polls
exports.voteOnPoll = async (req, res) => {
    const { id } = req.params;
    const { optionIndex, voterId, responseText } = req.body
    try {
        const poll = await Poll.findById(id)

        if (!poll) {
            return res.status(400).json({ message: "Poll not found" })
        }

        if (poll.closed) {
            return res.status(400).json({ message: "Poll is close" })
        }

        if (poll.voters.includes(voterId)) {
            return res.status(400).json({ message: "User has already voted on this poll" })
        }

        if (poll.type === "open-ended") {
            if (!responseText) {
                return res
                    .status(400)
                    .json({ message: "Response text is required for open-ended-polls." })
            }
            poll.responses.push({ voterId, responseText })
        } else {
            if (optionIndex === undefined || optionIndex < 0 || optionIndex >= poll.options.length) {
                return res.status(400).json({ message: "Invalid option index." })
            }
            poll.options[optionIndex].votes += 1
        }
        poll.voters.push(voterId)
        await poll.save()
        res.status(200).json(poll)
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error vote on Poll", error: error.message })
    }
}

//! Close Polls
exports.closePoll = async (req, res) => {
    const { id } = req.params
    const userId = req.user._id
    try {

        const poll = await Poll.findById(id)
        if (!poll) {
            return res.status(400).json({ message: "Poll not found" })
        }

        if (poll.creator.toString() != userId) {
            return res.status(403).json({ message: "You are not authorized to close this poll" })
        }

        poll.closed = true
        await poll.save()

        res.status(200).json({ message: "Poll closed successfully" })
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error close Poll", error: error.message })
    }
}

//! Bookmark Polls
exports.bookmarkPoll = async (req, res) => {
    const { id } = req.params
    const userId = req.user._id

    try {

        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        //! Check if poll is already bookmarked
        const isBookmarked = user.bookmarkedPolls.includes(id)

        if (isBookmarked) {
            //! Remove poll form bookmarks

            user.bookmarkedPolls = user.bookmarkedPolls.filter(
                (pollId) => pollId.toString() != id
            )
            await user.save()
            return res.status(200).json({ message: "Poll removed form bookmarks", bookmarkPoll: user.bookmarkedPolls })
        }

        //! Add poll to bookmark
        user.bookmarkedPolls.push(id)
        await user.save()
        res.status(200).json({ message: "Poll bookmarked successfully", bookmarkPoll: user.bookmarkedPolls })

    } catch (error) {
        res
            .status(500)
            .json({ message: "Error change Poll bookmarked ", error: error.message })
    }
}

//! Get All Bookmarked Polls
exports.getBookmarkedPoll = async (req, res) => {

    const userId = req.user._id

    try {

        const user = await User.findById(userId)
            .populate({
                path: "bookmarkedPolls",
                populate: {
                    path: "creator",
                    select: "fullName userName profileImageUrl"
                }
            })
            .populate({
                path: "bookmarkedPolls",
                populate: {
                    path: "responses.voterId",
                    select: "userName profileImageUrl fullName"
                }
            })


        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const bookmarkedPolls = user.bookmarkedPolls
        //! Add `userHasVoted` flag for each poll
        const updatedPolls = bookmarkedPolls.map((poll) => {
            const userHasVoted = poll.voters.some((voterId) => { voterId.equals(userId) })

            return {
                ...poll.toObject(),
                userHasVoted
            }
        })

        res.status(200).json({ bookmarkedPolls: updatedPolls })

    } catch (error) {
        res
            .status(500)
            .json({ message: "Error get all bookmarked Poll", error: error.message })
    }
}

//! Delete Polls
exports.deletePoll = async (req, res) => {
    const { id } = req.params
    const userId = req.user._id
    try {

        const poll = await Poll.findById(id)
        console.log(poll);
        if (!poll) {
            return res.status(400).json({ message: "Poll not found" })
        }

        if (poll.creator.toString() != userId) {
            return res
                .status(403)
                .json({ message: "You are not authorized to delete this poll" })
        }
        await Poll.findByIdAndDelete(id)
        res.status(200).json({ message: "Poll delete successfully" })

    } catch (error) {
        res
            .status(500)
            .json({ message: "Error delete Poll", error: error.message })
    }
}
