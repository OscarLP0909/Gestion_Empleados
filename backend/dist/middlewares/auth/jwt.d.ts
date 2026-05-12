import { Strategy } from "passport-jwt";
type JSONObject = {
    [key: string]: any;
};
export declare const withToken: (data: JSONObject) => JSONObject;
export declare const jwtStrategy: {
    name: string;
    strategy: Strategy;
};
export declare const ensureAuthenticated: any;
export {};
//# sourceMappingURL=jwt.d.ts.map