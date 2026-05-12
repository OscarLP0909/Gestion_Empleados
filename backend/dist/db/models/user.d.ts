import { Schema } from "mongoose";
export declare const userSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {
    id: string;
}, {}, {
    virtuals: {
        id: {
            get(): string;
            set(value: string): void;
        };
    };
    toJSON: {
        virtuals: true;
        transform: (doc: import("mongoose").Document<unknown, {}, {
            email: string;
            password: string;
            role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
            isActive: boolean;
            name?: string | null;
        }, {
            id: string;
        }, import("mongoose").DefaultSchemaOptions> & Omit<{
            email: string;
            password: string;
            role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
            isActive: boolean;
            name?: string | null;
        } & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }, ret: import("mongoose").FlatRecord<{
            email: string;
            password: string;
            role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
            isActive: boolean;
            name?: string | null;
        }> & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) => void;
    };
    toObject: {
        virtuals: true;
        transform: (doc: import("mongoose").Document<unknown, {}, {
            email: string;
            password: string;
            role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
            isActive: boolean;
            name?: string | null;
        }, {
            id: string;
        }, import("mongoose").DefaultSchemaOptions> & Omit<{
            email: string;
            password: string;
            role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
            isActive: boolean;
            name?: string | null;
        } & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }, ret: import("mongoose").FlatRecord<{
            email: string;
            password: string;
            role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
            isActive: boolean;
            name?: string | null;
        }> & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) => void;
    };
}, {
    email: string;
    password: string;
    role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
    isActive: boolean;
    name?: string | null;
}, import("mongoose").Document<unknown, {}, {
    email: string;
    password: string;
    role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
    isActive: boolean;
    name?: string | null;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    email: string;
    password: string;
    role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
    isActive: boolean;
    name?: string | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
        isActive: boolean;
        name?: string | null;
    }, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<{
        email: string;
        password: string;
        role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
        isActive: boolean;
        name?: string | null;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    email: string;
    password: string;
    role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
    isActive: boolean;
    name?: string | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const User: import("mongoose").Model<{
    email: string;
    password: string;
    role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
    isActive: boolean;
    name?: string | null;
}, {}, {}, {
    id: string;
} & {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    email: string;
    password: string;
    role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
    isActive: boolean;
    name?: string | null;
}, {
    id: string;
} & {
    id: string;
}, {
    virtuals: {
        id: {
            get(): string;
            set(value: string): void;
        };
    };
    toJSON: {
        virtuals: true;
        transform: (doc: import("mongoose").Document<unknown, {}, {
            email: string;
            password: string;
            role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
            isActive: boolean;
            name?: string | null;
        }, {
            id: string;
        }, import("mongoose").DefaultSchemaOptions> & Omit<{
            email: string;
            password: string;
            role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
            isActive: boolean;
            name?: string | null;
        } & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }, ret: import("mongoose").FlatRecord<{
            email: string;
            password: string;
            role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
            isActive: boolean;
            name?: string | null;
        }> & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) => void;
    };
    toObject: {
        virtuals: true;
        transform: (doc: import("mongoose").Document<unknown, {}, {
            email: string;
            password: string;
            role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
            isActive: boolean;
            name?: string | null;
        }, {
            id: string;
        }, import("mongoose").DefaultSchemaOptions> & Omit<{
            email: string;
            password: string;
            role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
            isActive: boolean;
            name?: string | null;
        } & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }, ret: import("mongoose").FlatRecord<{
            email: string;
            password: string;
            role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
            isActive: boolean;
            name?: string | null;
        }> & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) => void;
    };
}> & Omit<{
    email: string;
    password: string;
    role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
    isActive: boolean;
    name?: string | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
} & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {
    id: string;
}, {}, {
    virtuals: {
        id: {
            get(): string;
            set(value: string): void;
        };
    };
    toJSON: {
        virtuals: true;
        transform: (doc: import("mongoose").Document<unknown, {}, {
            email: string;
            password: string;
            role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
            isActive: boolean;
            name?: string | null;
        }, {
            id: string;
        }, import("mongoose").DefaultSchemaOptions> & Omit<{
            email: string;
            password: string;
            role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
            isActive: boolean;
            name?: string | null;
        } & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }, ret: import("mongoose").FlatRecord<{
            email: string;
            password: string;
            role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
            isActive: boolean;
            name?: string | null;
        }> & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) => void;
    };
    toObject: {
        virtuals: true;
        transform: (doc: import("mongoose").Document<unknown, {}, {
            email: string;
            password: string;
            role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
            isActive: boolean;
            name?: string | null;
        }, {
            id: string;
        }, import("mongoose").DefaultSchemaOptions> & Omit<{
            email: string;
            password: string;
            role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
            isActive: boolean;
            name?: string | null;
        } & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }, ret: import("mongoose").FlatRecord<{
            email: string;
            password: string;
            role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
            isActive: boolean;
            name?: string | null;
        }> & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) => void;
    };
}, {
    email: string;
    password: string;
    role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
    isActive: boolean;
    name?: string | null;
}, import("mongoose").Document<unknown, {}, {
    email: string;
    password: string;
    role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
    isActive: boolean;
    name?: string | null;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    email: string;
    password: string;
    role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
    isActive: boolean;
    name?: string | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
        isActive: boolean;
        name?: string | null;
    }, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<{
        email: string;
        password: string;
        role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
        isActive: boolean;
        name?: string | null;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    email: string;
    password: string;
    role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
    isActive: boolean;
    name?: string | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {
    email: string;
    password: string;
    role: "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
    isActive: boolean;
    name?: string | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=user.d.ts.map