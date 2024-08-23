import { Request } from "@sap/cds";

export enum ApplicationRoles {
    ADMIN = "A",
    MANAGER = "M",
    USER = "U",
    NONE = "N"
}

export enum RolePrefixes {
    ADMIN = "admin",
    MANAGER = "manager",
    USER = "user",
    NONE = "none"
}
export enum StatusCodes {
    UNAUTHORIZED = 401,
    UNPROCESSABLE_CONTENT = 422,
    INTERNAL_SERVER_ERROR = 500
}
export enum FilterOperator {
    EQ,
    NE,
    LT,
    LE,
    GT,
    GE,
    BT,
    LIKE,
    IN
}
export type EventType = "CREATE" | "UPDATE" | "DELETE" | "READ";

export interface IGeneratedID {
    GENERATED_ID: number;
}

export interface IEntityKey {
    fieldName: string;
    fieldType: "String" | "Boolean" | "Number" | "Date";
    fieldValue: string | boolean | number;
}

export interface FilterExpression extends Omit<IEntityKey, "fieldValue"> {
    operator: FilterOperator;
    value1?: string;
    value2?: string;
    values?: string[];
}

export class CustomError extends Error {
    public status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}