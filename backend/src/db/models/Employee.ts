import { ObjectId } from "mongodb";
import { model, Schema } from "mongoose";

export const employeeSchema = new Schema(
    {
        name: { type: String, trim: true },
        surname: { type: String, trim: true },
        nif: { type: String, trim: true },
        city: String,
        province: String,
        country: String,
        email: { type: String, trim: true, unique: true, lowercase: true },
        phone: { type: String, trim: true },
    },
    {
        timestamps: true,
        virtuals: {
            id: {
                get() {
                    return (this as any)._id.toString();
                },
                set(_value: string) {
                    (this as any)._id = new ObjectId()
                }
            }
        },
        toJSON: {
            virtuals: true,
            transform: (_doc: any, ret: any) => {
                delete (ret as Partial<typeof ret>)._id;
                delete (ret as Partial<typeof ret>).__v;
            }
        },
        toObject: {
            virtuals: true,
            transform: (_doc: any, ret: any) => {
                delete (ret as Partial<typeof ret>)._id;
                delete (ret as Partial<typeof ret>).__v;
            }
        }
    }
);

export const Employee = model("Employee", employeeSchema, "employees");