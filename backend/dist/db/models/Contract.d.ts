import { Schema, Types } from "mongoose";
export declare const contractSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {
    id: string;
}, {}, {
    timestamps: true;
    virtuals: {
        id: {
            get(): string;
            set(value: string): void;
        };
    };
    toJSON: {
        virtuals: true;
        transform: (doc: import("mongoose").Document<unknown, {}, {
            position: string;
            startDate: NativeDate;
            employeeId: Types.ObjectId;
            contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
            workdayType: "Completa" | "Parcial";
            salaryType: "Bruto" | "Neto";
            salaryAmount: number;
            department: string;
            category: string;
            status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
            endDate?: NativeDate | null;
            temporaryType?: string | null;
        }, {
            id: string;
        }, import("mongoose").DefaultSchemaOptions> & Omit<{
            position: string;
            startDate: NativeDate;
            employeeId: Types.ObjectId;
            contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
            workdayType: "Completa" | "Parcial";
            salaryType: "Bruto" | "Neto";
            salaryAmount: number;
            department: string;
            category: string;
            status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
            endDate?: NativeDate | null;
            temporaryType?: string | null;
        } & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }, ret: import("mongoose").FlatRecord<{
            position: string;
            startDate: NativeDate;
            employeeId: Types.ObjectId;
            contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
            workdayType: "Completa" | "Parcial";
            salaryType: "Bruto" | "Neto";
            salaryAmount: number;
            department: string;
            category: string;
            status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
            endDate?: NativeDate | null;
            temporaryType?: string | null;
        }> & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }) => void;
    };
    toObject: {
        virtuals: true;
        transform: (doc: import("mongoose").Document<unknown, {}, {
            position: string;
            startDate: NativeDate;
            employeeId: Types.ObjectId;
            contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
            workdayType: "Completa" | "Parcial";
            salaryType: "Bruto" | "Neto";
            salaryAmount: number;
            department: string;
            category: string;
            status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
            endDate?: NativeDate | null;
            temporaryType?: string | null;
        }, {
            id: string;
        }, import("mongoose").DefaultSchemaOptions> & Omit<{
            position: string;
            startDate: NativeDate;
            employeeId: Types.ObjectId;
            contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
            workdayType: "Completa" | "Parcial";
            salaryType: "Bruto" | "Neto";
            salaryAmount: number;
            department: string;
            category: string;
            status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
            endDate?: NativeDate | null;
            temporaryType?: string | null;
        } & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }, ret: import("mongoose").FlatRecord<{
            position: string;
            startDate: NativeDate;
            employeeId: Types.ObjectId;
            contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
            workdayType: "Completa" | "Parcial";
            salaryType: "Bruto" | "Neto";
            salaryAmount: number;
            department: string;
            category: string;
            status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
            endDate?: NativeDate | null;
            temporaryType?: string | null;
        }> & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }) => void;
    };
}, {
    position: string;
    startDate: NativeDate;
    employeeId: Types.ObjectId;
    contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
    workdayType: "Completa" | "Parcial";
    salaryType: "Bruto" | "Neto";
    salaryAmount: number;
    department: string;
    category: string;
    status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
    endDate?: NativeDate | null;
    temporaryType?: string | null;
}, import("mongoose").Document<unknown, {}, {
    position: string;
    startDate: NativeDate;
    employeeId: Types.ObjectId;
    contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
    workdayType: "Completa" | "Parcial";
    salaryType: "Bruto" | "Neto";
    salaryAmount: number;
    department: string;
    category: string;
    status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
    endDate?: NativeDate | null;
    temporaryType?: string | null;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    position: string;
    startDate: NativeDate;
    employeeId: Types.ObjectId;
    contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
    workdayType: "Completa" | "Parcial";
    salaryType: "Bruto" | "Neto";
    salaryAmount: number;
    department: string;
    category: string;
    status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
    endDate?: NativeDate | null;
    temporaryType?: string | null;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
        position: string;
        startDate: NativeDate;
        employeeId: Types.ObjectId;
        contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
        workdayType: "Completa" | "Parcial";
        salaryType: "Bruto" | "Neto";
        salaryAmount: number;
        department: string;
        category: string;
        status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
        endDate?: NativeDate | null;
        temporaryType?: string | null;
    }, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<{
        position: string;
        startDate: NativeDate;
        employeeId: Types.ObjectId;
        contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
        workdayType: "Completa" | "Parcial";
        salaryType: "Bruto" | "Neto";
        salaryAmount: number;
        department: string;
        category: string;
        status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
        endDate?: NativeDate | null;
        temporaryType?: string | null;
    } & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    position: string;
    startDate: NativeDate;
    employeeId: Types.ObjectId;
    contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
    workdayType: "Completa" | "Parcial";
    salaryType: "Bruto" | "Neto";
    salaryAmount: number;
    department: string;
    category: string;
    status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
    endDate?: NativeDate | null;
    temporaryType?: string | null;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare const Contract: import("mongoose").Model<{
    position?: unknown;
    startDate?: {
        toJSON?: {} | null;
        [Symbol.toPrimitive]?: {} | null;
        toString?: {} | null;
        toLocaleString?: {} | null;
        valueOf?: {} | null;
        toDateString?: {} | null;
        toTimeString?: {} | null;
        toLocaleDateString?: {} | null;
        toLocaleTimeString?: {} | null;
        getTime?: {} | null;
        getFullYear?: {} | null;
        getUTCFullYear?: {} | null;
        getMonth?: {} | null;
        getUTCMonth?: {} | null;
        getDate?: {} | null;
        getUTCDate?: {} | null;
        getDay?: {} | null;
        getUTCDay?: {} | null;
        getHours?: {} | null;
        getUTCHours?: {} | null;
        getMinutes?: {} | null;
        getUTCMinutes?: {} | null;
        getSeconds?: {} | null;
        getUTCSeconds?: {} | null;
        getMilliseconds?: {} | null;
        getUTCMilliseconds?: {} | null;
        getTimezoneOffset?: {} | null;
        setTime?: {} | null;
        setMilliseconds?: {} | null;
        setUTCMilliseconds?: {} | null;
        setSeconds?: {} | null;
        setUTCSeconds?: {} | null;
        setMinutes?: {} | null;
        setUTCMinutes?: {} | null;
        setHours?: {} | null;
        setUTCHours?: {} | null;
        setDate?: {} | null;
        setUTCDate?: {} | null;
        setMonth?: {} | null;
        setUTCMonth?: {} | null;
        setFullYear?: {} | null;
        setUTCFullYear?: {} | null;
        toUTCString?: {} | null;
        toISOString?: {} | null;
        getVarDate?: {} | null;
    } | null;
    endDate?: unknown;
    employeeId?: Types.ObjectId | null;
    contractType?: unknown;
    temporaryType?: unknown;
    workdayType?: unknown;
    salaryType?: unknown;
    salaryAmount?: unknown;
    department?: unknown;
    category?: unknown;
    status?: unknown;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
} & {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    position?: unknown;
    startDate?: {
        toJSON?: {} | null;
        [Symbol.toPrimitive]?: {} | null;
        toString?: {} | null;
        toLocaleString?: {} | null;
        valueOf?: {} | null;
        toDateString?: {} | null;
        toTimeString?: {} | null;
        toLocaleDateString?: {} | null;
        toLocaleTimeString?: {} | null;
        getTime?: {} | null;
        getFullYear?: {} | null;
        getUTCFullYear?: {} | null;
        getMonth?: {} | null;
        getUTCMonth?: {} | null;
        getDate?: {} | null;
        getUTCDate?: {} | null;
        getDay?: {} | null;
        getUTCDay?: {} | null;
        getHours?: {} | null;
        getUTCHours?: {} | null;
        getMinutes?: {} | null;
        getUTCMinutes?: {} | null;
        getSeconds?: {} | null;
        getUTCSeconds?: {} | null;
        getMilliseconds?: {} | null;
        getUTCMilliseconds?: {} | null;
        getTimezoneOffset?: {} | null;
        setTime?: {} | null;
        setMilliseconds?: {} | null;
        setUTCMilliseconds?: {} | null;
        setSeconds?: {} | null;
        setUTCSeconds?: {} | null;
        setMinutes?: {} | null;
        setUTCMinutes?: {} | null;
        setHours?: {} | null;
        setUTCHours?: {} | null;
        setDate?: {} | null;
        setUTCDate?: {} | null;
        setMonth?: {} | null;
        setUTCMonth?: {} | null;
        setFullYear?: {} | null;
        setUTCFullYear?: {} | null;
        toUTCString?: {} | null;
        toISOString?: {} | null;
        getVarDate?: {} | null;
    } | null;
    endDate?: unknown;
    employeeId?: Types.ObjectId | null;
    contractType?: unknown;
    temporaryType?: unknown;
    workdayType?: unknown;
    salaryType?: unknown;
    salaryAmount?: unknown;
    department?: unknown;
    category?: unknown;
    status?: unknown;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
} & {
    id: string;
}, {
    timestamps: true;
    virtuals: {
        id: {
            get(): string;
            set(value: string): void;
        };
    };
    toJSON: {
        virtuals: true;
        transform: (doc: import("mongoose").Document<unknown, {}, {
            position: string;
            startDate: NativeDate;
            employeeId: Types.ObjectId;
            contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
            workdayType: "Completa" | "Parcial";
            salaryType: "Bruto" | "Neto";
            salaryAmount: number;
            department: string;
            category: string;
            status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
            endDate?: NativeDate | null;
            temporaryType?: string | null;
        }, {
            id: string;
        }, import("mongoose").DefaultSchemaOptions> & Omit<{
            position: string;
            startDate: NativeDate;
            employeeId: Types.ObjectId;
            contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
            workdayType: "Completa" | "Parcial";
            salaryType: "Bruto" | "Neto";
            salaryAmount: number;
            department: string;
            category: string;
            status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
            endDate?: NativeDate | null;
            temporaryType?: string | null;
        } & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }, ret: import("mongoose").FlatRecord<{
            position: string;
            startDate: NativeDate;
            employeeId: Types.ObjectId;
            contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
            workdayType: "Completa" | "Parcial";
            salaryType: "Bruto" | "Neto";
            salaryAmount: number;
            department: string;
            category: string;
            status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
            endDate?: NativeDate | null;
            temporaryType?: string | null;
        }> & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }) => void;
    };
    toObject: {
        virtuals: true;
        transform: (doc: import("mongoose").Document<unknown, {}, {
            position: string;
            startDate: NativeDate;
            employeeId: Types.ObjectId;
            contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
            workdayType: "Completa" | "Parcial";
            salaryType: "Bruto" | "Neto";
            salaryAmount: number;
            department: string;
            category: string;
            status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
            endDate?: NativeDate | null;
            temporaryType?: string | null;
        }, {
            id: string;
        }, import("mongoose").DefaultSchemaOptions> & Omit<{
            position: string;
            startDate: NativeDate;
            employeeId: Types.ObjectId;
            contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
            workdayType: "Completa" | "Parcial";
            salaryType: "Bruto" | "Neto";
            salaryAmount: number;
            department: string;
            category: string;
            status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
            endDate?: NativeDate | null;
            temporaryType?: string | null;
        } & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }, ret: import("mongoose").FlatRecord<{
            position: string;
            startDate: NativeDate;
            employeeId: Types.ObjectId;
            contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
            workdayType: "Completa" | "Parcial";
            salaryType: "Bruto" | "Neto";
            salaryAmount: number;
            department: string;
            category: string;
            status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
            endDate?: NativeDate | null;
            temporaryType?: string | null;
        }> & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }) => void;
    };
}> & Omit<{
    position?: unknown;
    startDate?: {
        toJSON?: {} | null;
        [Symbol.toPrimitive]?: {} | null;
        toString?: {} | null;
        toLocaleString?: {} | null;
        valueOf?: {} | null;
        toDateString?: {} | null;
        toTimeString?: {} | null;
        toLocaleDateString?: {} | null;
        toLocaleTimeString?: {} | null;
        getTime?: {} | null;
        getFullYear?: {} | null;
        getUTCFullYear?: {} | null;
        getMonth?: {} | null;
        getUTCMonth?: {} | null;
        getDate?: {} | null;
        getUTCDate?: {} | null;
        getDay?: {} | null;
        getUTCDay?: {} | null;
        getHours?: {} | null;
        getUTCHours?: {} | null;
        getMinutes?: {} | null;
        getUTCMinutes?: {} | null;
        getSeconds?: {} | null;
        getUTCSeconds?: {} | null;
        getMilliseconds?: {} | null;
        getUTCMilliseconds?: {} | null;
        getTimezoneOffset?: {} | null;
        setTime?: {} | null;
        setMilliseconds?: {} | null;
        setUTCMilliseconds?: {} | null;
        setSeconds?: {} | null;
        setUTCSeconds?: {} | null;
        setMinutes?: {} | null;
        setUTCMinutes?: {} | null;
        setHours?: {} | null;
        setUTCHours?: {} | null;
        setDate?: {} | null;
        setUTCDate?: {} | null;
        setMonth?: {} | null;
        setUTCMonth?: {} | null;
        setFullYear?: {} | null;
        setUTCFullYear?: {} | null;
        toUTCString?: {} | null;
        toISOString?: {} | null;
        getVarDate?: {} | null;
    } | null;
    endDate?: unknown;
    employeeId?: Types.ObjectId | null;
    contractType?: unknown;
    temporaryType?: unknown;
    workdayType?: unknown;
    salaryType?: unknown;
    salaryAmount?: unknown;
    department?: unknown;
    category?: unknown;
    status?: unknown;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
} & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {
    id: string;
}, {}, {
    timestamps: true;
    virtuals: {
        id: {
            get(): string;
            set(value: string): void;
        };
    };
    toJSON: {
        virtuals: true;
        transform: (doc: import("mongoose").Document<unknown, {}, {
            position: string;
            startDate: NativeDate;
            employeeId: Types.ObjectId;
            contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
            workdayType: "Completa" | "Parcial";
            salaryType: "Bruto" | "Neto";
            salaryAmount: number;
            department: string;
            category: string;
            status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
            endDate?: NativeDate | null;
            temporaryType?: string | null;
        }, {
            id: string;
        }, import("mongoose").DefaultSchemaOptions> & Omit<{
            position: string;
            startDate: NativeDate;
            employeeId: Types.ObjectId;
            contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
            workdayType: "Completa" | "Parcial";
            salaryType: "Bruto" | "Neto";
            salaryAmount: number;
            department: string;
            category: string;
            status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
            endDate?: NativeDate | null;
            temporaryType?: string | null;
        } & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }, ret: import("mongoose").FlatRecord<{
            position: string;
            startDate: NativeDate;
            employeeId: Types.ObjectId;
            contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
            workdayType: "Completa" | "Parcial";
            salaryType: "Bruto" | "Neto";
            salaryAmount: number;
            department: string;
            category: string;
            status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
            endDate?: NativeDate | null;
            temporaryType?: string | null;
        }> & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }) => void;
    };
    toObject: {
        virtuals: true;
        transform: (doc: import("mongoose").Document<unknown, {}, {
            position: string;
            startDate: NativeDate;
            employeeId: Types.ObjectId;
            contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
            workdayType: "Completa" | "Parcial";
            salaryType: "Bruto" | "Neto";
            salaryAmount: number;
            department: string;
            category: string;
            status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
            endDate?: NativeDate | null;
            temporaryType?: string | null;
        }, {
            id: string;
        }, import("mongoose").DefaultSchemaOptions> & Omit<{
            position: string;
            startDate: NativeDate;
            employeeId: Types.ObjectId;
            contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
            workdayType: "Completa" | "Parcial";
            salaryType: "Bruto" | "Neto";
            salaryAmount: number;
            department: string;
            category: string;
            status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
            endDate?: NativeDate | null;
            temporaryType?: string | null;
        } & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }, ret: import("mongoose").FlatRecord<{
            position: string;
            startDate: NativeDate;
            employeeId: Types.ObjectId;
            contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
            workdayType: "Completa" | "Parcial";
            salaryType: "Bruto" | "Neto";
            salaryAmount: number;
            department: string;
            category: string;
            status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
            endDate?: NativeDate | null;
            temporaryType?: string | null;
        }> & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }) => void;
    };
}, {
    position: string;
    startDate: NativeDate;
    employeeId: Types.ObjectId;
    contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
    workdayType: "Completa" | "Parcial";
    salaryType: "Bruto" | "Neto";
    salaryAmount: number;
    department: string;
    category: string;
    status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
    endDate?: NativeDate | null;
    temporaryType?: string | null;
}, import("mongoose").Document<unknown, {}, {
    position: string;
    startDate: NativeDate;
    employeeId: Types.ObjectId;
    contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
    workdayType: "Completa" | "Parcial";
    salaryType: "Bruto" | "Neto";
    salaryAmount: number;
    department: string;
    category: string;
    status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
    endDate?: NativeDate | null;
    temporaryType?: string | null;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    position: string;
    startDate: NativeDate;
    employeeId: Types.ObjectId;
    contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
    workdayType: "Completa" | "Parcial";
    salaryType: "Bruto" | "Neto";
    salaryAmount: number;
    department: string;
    category: string;
    status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
    endDate?: NativeDate | null;
    temporaryType?: string | null;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
        position: string;
        startDate: NativeDate;
        employeeId: Types.ObjectId;
        contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
        workdayType: "Completa" | "Parcial";
        salaryType: "Bruto" | "Neto";
        salaryAmount: number;
        department: string;
        category: string;
        status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
        endDate?: NativeDate | null;
        temporaryType?: string | null;
    }, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<{
        position: string;
        startDate: NativeDate;
        employeeId: Types.ObjectId;
        contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
        workdayType: "Completa" | "Parcial";
        salaryType: "Bruto" | "Neto";
        salaryAmount: number;
        department: string;
        category: string;
        status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
        endDate?: NativeDate | null;
        temporaryType?: string | null;
    } & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    position: string;
    startDate: NativeDate;
    employeeId: Types.ObjectId;
    contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
    workdayType: "Completa" | "Parcial";
    salaryType: "Bruto" | "Neto";
    salaryAmount: number;
    department: string;
    category: string;
    status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
    endDate?: NativeDate | null;
    temporaryType?: string | null;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {
    position: string;
    startDate: NativeDate;
    employeeId: Types.ObjectId;
    contractType: "Indefinido" | "Prácticas" | "Formación" | "Eventual";
    workdayType: "Completa" | "Parcial";
    salaryType: "Bruto" | "Neto";
    salaryAmount: number;
    department: string;
    category: string;
    status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "FINALIZADO";
    endDate?: NativeDate | null;
    temporaryType?: string | null;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Contract.d.ts.map