import { model, Schema } from "mongoose";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export const userSchema = new Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true, select: false },
        role: { type: String, enum: ["ADMIN", "HR_MANAGER", "MANAGER", "EMPLOYEE"], default: "EMPLOYEE", required: true },
        isActive: { type: Boolean, default: true },
        name: { type: String },
    },
    {
        virtuals: {
            id: {
                get() {
                    return this._id.toString();
                },
                set(value: string) {
                    this._id = new ObjectId(value);
                },
            },
        },

        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete (ret as Partial<typeof ret>)._id;
                delete (ret as Partial<typeof ret>).__v;
            }
        },
        toObject: {
            virtuals: true,
            transform: (doc, ret) => {
                delete (ret as Partial<typeof ret>)._id;
                delete (ret as Partial<typeof ret>).__v;
            }
        }
    }
);

userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

export const User = model("User", userSchema, "users");