import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        unique: true, 
        required: true 
    },
    amount: { 
        type: Number, 
        default: 0, 
        min: 0 
    },
}, { timestamps: true });

const Subscription = mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);
export default Subscription;