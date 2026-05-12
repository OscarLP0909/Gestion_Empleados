import { Schema } from "mongoose";
export declare const employeeSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {
    id: any;
}, {}, {
    timestamps: true;
    virtuals: {
        id: {
            get(): any;
            set(_value: string): void;
        };
    };
    toJSON: {
        virtuals: true;
        transform: (_doc: any, ret: any) => void;
    };
    toObject: {
        virtuals: true;
        transform: (_doc: any, ret: any) => void;
    };
}, {
    email?: string | null;
    name?: string | null;
    city?: string | null;
    province?: string | null;
    country?: string | null;
    surname?: string | null;
    nif?: string | null;
    phone?: string | null;
} & import("mongoose").DefaultTimestampProps, any, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, any> | undefined;
}, {
    email?: string | null;
    name?: string | null;
    city?: string | null;
    province?: string | null;
    country?: string | null;
    surname?: string | null;
    nif?: string | null;
    phone?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const Employee: import("mongoose").Model<{
    email?: string | null;
    name?: string | null;
    city?: string | null;
    province?: string | null;
    country?: string | null;
    surname?: string | null;
    nif?: string | null;
    phone?: string | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: any;
} & {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    email?: string | null;
    name?: string | null;
    city?: string | null;
    province?: string | null;
    country?: string | null;
    surname?: string | null;
    nif?: string | null;
    phone?: string | null;
} & import("mongoose").DefaultTimestampProps, {
    id: any;
} & {
    id: string;
}, {
    timestamps: true;
    virtuals: {
        id: {
            get(): any;
            set(_value: string): void;
        };
    };
    toJSON: {
        virtuals: true;
        transform: (_doc: any, ret: any) => void;
    };
    toObject: {
        virtuals: true;
        transform: (_doc: any, ret: any) => void;
    };
}> & Omit<{
    email?: string | null;
    name?: string | null;
    city?: string | null;
    province?: string | null;
    country?: string | null;
    surname?: string | null;
    nif?: string | null;
    phone?: string | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: any;
} & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {
    id: any;
}, {}, {
    timestamps: true;
    virtuals: {
        id: {
            get(): any;
            set(_value: string): void;
        };
    };
    toJSON: {
        virtuals: true;
        transform: (_doc: any, ret: any) => void;
    };
    toObject: {
        virtuals: true;
        transform: (_doc: any, ret: any) => void;
    };
}, {
    email?: string | null;
    name?: string | null;
    city?: string | null;
    province?: string | null;
    country?: string | null;
    surname?: string | null;
    nif?: string | null;
    phone?: string | null;
} & import("mongoose").DefaultTimestampProps, any, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, any> | undefined;
}, {
    email?: string | null;
    name?: string | null;
    city?: string | null;
    province?: string | null;
    country?: string | null;
    surname?: string | null;
    nif?: string | null;
    phone?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {
    email?: string | null;
    name?: string | null;
    city?: string | null;
    province?: string | null;
    country?: string | null;
    surname?: string | null;
    nif?: string | null;
    phone?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Employee.d.ts.map