const Post = require("../models/Post");

// CREATE DONATION POST
const createPost = async (req, res) => {
    try {
        const {
            donationType,
            quantity,
            description
        } = req.body;

        if (!donationType || !quantity || !description) {
            return res.status(400).json({
                message: "Donation type, quantity, and description are required"
            });
        }

        const post = await Post.create({
            donor: req.user.id,
            donationType,
            quantity,
            remainingQty: quantity,
            description
        });

        res.status(201).json({
            message: "Donation post created successfully",
            post
        });

    } catch (error) {
        console.error("Create post error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET ALL DONATION POSTS
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("donor", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: posts.length,
            posts
        });

    } catch (error) {
        console.error("Get posts error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET ONE DONATION POST
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("donor", "name email");

        if (!post) {
            return res.status(404).json({
                message: "Donation post not found"
            });
        }

        res.status(200).json({
            post
        });

    } catch (error) {
        console.error("Get post error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// UPDATE DONATION POST
const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Donation post not found"
            });
        }

        // Check ownership
        if (post.donor.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only update your own donation"
            });
        }

        const {
            donationType,
            quantity,
            description,
            status
        } = req.body;

        if (donationType !== undefined) {
            post.donationType = donationType;
        }

        if (quantity !== undefined) {
            post.quantity = quantity;
            post.remainingQty = quantity;
        }

        if (description !== undefined) {
            post.description = description;
        }

        if (status !== undefined) {
            post.status = status;
        }

        await post.save();

        res.status(200).json({
            message: "Donation updated successfully",
            post
        });

    } catch (error) {
        console.error("Update post error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// DELETE DONATION POST
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Donation post not found"
            });
        }

        // Check ownership
        if (post.donor.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only delete your own donation"
            });
        }

        await post.deleteOne();

        res.status(200).json({
            message: "Donation deleted successfully"
        });

    } catch (error) {
        console.error("Delete post error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// EXPORT CONTROLLERS
module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost
};