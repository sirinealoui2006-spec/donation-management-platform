const Claim = require("../models/Claim");
const Post = require("../models/Post");

// CREATE A CLAIM
const createClaim = async (req, res) => {
    try {
        const { postId, quantity } = req.body;

        // Check required fields
        if (!postId || !quantity) {
            return res.status(400).json({
                message: "Post ID and quantity are required"
            });
        }

        // Find the donation
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Donation post not found"
            });
        }

        // Make sure the donation is available
        if (post.status === "completed") {
            return res.status(400).json({
                message: "This donation is already completed"
            });
        }

        // Donor cannot claim their own donation
        if (post.donor.toString() === req.user.id) {
            return res.status(403).json({
                message: "You cannot claim your own donation"
            });
        }

        // Check requested quantity
        if (quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than 0"
            });
        }

        // Check available quantity
        if (quantity > post.remainingQty) {
            return res.status(400).json({
                message: `Only ${post.remainingQty} items are available`
            });
        }

        // Create claim
        const claim = await Claim.create({
            post: postId,
            claimant: req.user.id,
            quantity
        });

        // Reduce remaining quantity
        post.remainingQty -= quantity;

        // If nothing remains, mark donation as completed
        if (post.remainingQty === 0) {
            post.status = "completed";
        }

        await post.save();

        res.status(201).json({
            message: "Claim created successfully",
            claim,
            remainingQty: post.remainingQty
        });

    } catch (error) {
        console.error("Create claim error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createClaim
};