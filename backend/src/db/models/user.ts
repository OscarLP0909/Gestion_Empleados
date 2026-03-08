import { model, Schema } from "mongoose";
import { ObjectId } from "mongodb";

export const userSchema = new Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true, select: false },
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

export const User = model("User", userSchema, "users");