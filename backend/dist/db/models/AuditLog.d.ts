import mongoose from "mongoose";
export declare const AuditLog: mongoose.Model<{
    createdAt: NativeDate;
    userId: mongoose.Types.ObjectId;
    action: "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE" | "ROLE_CHANGE";
    entityType: "EMPLOYEE" | "CONTRACT" | "USER";
    description?: string | null;
    userName?: string | null;
    entityId?: mongoose.Types.ObjectId | null;
    entityName?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    changes?: {
        before?: any;
        after?: any;
    } | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    userId: mongoose.Types.ObjectId;
    action: "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE" | "ROLE_CHANGE";
    entityType: "EMPLOYEE" | "CONTRACT" | "USER";
    description?: string | null;
    userName?: string | null;
    entityId?: mongoose.Types.ObjectId | null;
    entityName?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    changes?: {
        before?: any;
        after?: any;
    } | null;
}, {
    id: string;
}, {
    timestamps: false;
}> & Omit<{
    createdAt: NativeDate;
    userId: mongoose.Types.ObjectId;
    action: "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE" | "ROLE_CHANGE";
    entityType: "EMPLOYEE" | "CONTRACT" | "USER";
    description?: string | null;
    userName?: string | null;
    entityId?: mongoose.Types.ObjectId | null;
    entityName?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    changes?: {
        before?: any;
        after?: any;
    } | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: false;
}, {
    createdAt: NativeDate;
    userId: mongoose.Types.ObjectId;
    action: "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE" | "ROLE_CHANGE";
    entityType: "EMPLOYEE" | "CONTRACT" | "USER";
    description?: string | null;
    userName?: string | null;
    entityId?: mongoose.Types.ObjectId | null;
    entityName?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    changes?: {
        before?: any;
        after?: any;
    } | null;
}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    userId: mongoose.Types.ObjectId;
    action: "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE" | "ROLE_CHANGE";
    entityType: "EMPLOYEE" | "CONTRACT" | "USER";
    description?: string | null;
    userName?: string | null;
    entityId?: mongoose.Types.ObjectId | null;
    entityName?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    changes?: {
        before?: any;
        after?: any;
    } | null;
}, {
    id: string;
}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: false;
}>> & Omit<{
    createdAt: NativeDate;
    userId: mongoose.Types.ObjectId;
    action: "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE" | "ROLE_CHANGE";
    entityType: "EMPLOYEE" | "CONTRACT" | "USER";
    description?: string | null;
    userName?: string | null;
    entityId?: mongoose.Types.ObjectId | null;
    entityName?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    changes?: {
        before?: any;
        after?: any;
    } | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        createdAt: NativeDate;
        userId: mongoose.Types.ObjectId;
        action: "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE" | "ROLE_CHANGE";
        entityType: "EMPLOYEE" | "CONTRACT" | "USER";
        description?: string | null;
        userName?: string | null;
        entityId?: mongoose.Types.ObjectId | null;
        entityName?: string | null;
        ipAddress?: string | null;
        userAgent?: string | null;
        changes?: {
            before?: any;
            after?: any;
        } | null;
    }, {
        id: string;
    }, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
        timestamps: false;
    }>> & Omit<{
        createdAt: NativeDate;
        userId: mongoose.Types.ObjectId;
        action: "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE" | "ROLE_CHANGE";
        entityType: "EMPLOYEE" | "CONTRACT" | "USER";
        description?: string | null;
        userName?: string | null;
        entityId?: mongoose.Types.ObjectId | null;
        entityName?: string | null;
        ipAddress?: string | null;
        userAgent?: string | null;
        changes?: {
            before?: any;
            after?: any;
        } | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    createdAt: NativeDate;
    userId: mongoose.Types.ObjectId;
    action: "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE" | "ROLE_CHANGE";
    entityType: "EMPLOYEE" | "CONTRACT" | "USER";
    description?: string | null;
    userName?: string | null;
    entityId?: mongoose.Types.ObjectId | null;
    entityName?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    changes?: {
        before?: any;
        after?: any;
    } | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    userId: mongoose.Types.ObjectId;
    action: "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE" | "ROLE_CHANGE";
    entityType: "EMPLOYEE" | "CONTRACT" | "USER";
    description?: string | null;
    userName?: string | null;
    entityId?: mongoose.Types.ObjectId | null;
    entityName?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    changes?: {
        before?: any;
        after?: any;
    } | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=AuditLog.d.ts.map