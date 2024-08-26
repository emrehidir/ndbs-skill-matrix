import { connect, Service } from "@sap/cds";
import { IPersonnels } from "../types/personnel.types";
import { ApplicationRoles, EventType, RolePrefixes } from "../types/global.types";
import { IApplicationResources, IBackendAuthorizations } from "../types/visibility.types";

export default class AuthHandler {
    public isAuthorized: boolean;
    public errorMessage: string;
    private successFactorsId: string;
    private resourceName: string;
    private eventName: EventType;

    constructor(successFactorsId: string, resourceName: string, event: EventType) {
        this.successFactorsId = successFactorsId;
        this.resourceName = resourceName;
        this.eventName = event;
        this.isAuthorized = false;
        this.errorMessage = "";
    }

    public static async checkAdminAuthorization(successFactorsId: string): Promise<boolean> {
        const db: Service = await connect.to("db");
        const { VHPersonnelInfo } = db.entities("SkillMatrix");
        const userInfo: IPersonnels | undefined = await db.run(SELECT.one.from(VHPersonnelInfo).where({ sfUser: successFactorsId }));
        const userRole = userInfo?.userRole || ApplicationRoles.NONE;

        return userRole === ApplicationRoles.ADMIN;
    }

    public async checkUserAuthorization(): Promise<void> {
        const db: Service = await connect.to("db");
        const { VHBackendAuth, VHPersonnelInfo, VHAppResources } = db.entities("SkillMatrix");
        const authorizations: IBackendAuthorizations | undefined = await db.run(SELECT.one.from(VHBackendAuth).where({ resourceName: this.resourceName }));
        const userInfo: IPersonnels | undefined = await db.run(SELECT.one.from(VHPersonnelInfo).where({ sfUser: this.successFactorsId }));
        const userRole = userInfo?.userRole || ApplicationRoles.NONE;
        const resource: IApplicationResources = await db.run(SELECT.one.from(VHAppResources).where({ resourceName: this.resourceName }));
        let rolePrefix: RolePrefixes = RolePrefixes.NONE;

        if (!authorizations) {
            this.isAuthorized = false;
            this.errorMessage = `You are not authorized to ${this.eventName} ${resource.shortDescription}`;
            return;
        }

        switch (userRole) {
            case ApplicationRoles.ADMIN:
                rolePrefix = RolePrefixes.ADMIN;
                break;
            case ApplicationRoles.MANAGER:
                rolePrefix = RolePrefixes.MANAGER;
                break;
            case ApplicationRoles.USER:
                rolePrefix = RolePrefixes.USER;
                break;
        }

        switch (this.eventName) {
            case "CREATE":
                this.isAuthorized = authorizations[`${rolePrefix}CanCreate`] || false;
                break;
            case "UPDATE":
                this.isAuthorized = authorizations[`${rolePrefix}CanUpdate`] || false;
                break;
            case "DELETE":
                this.isAuthorized = authorizations[`${rolePrefix}CanDelete`] || false;
                break;
            case "READ":
                this.isAuthorized = authorizations[`${rolePrefix}CanRead`] || false;
                break;
        }

        if (!this.isAuthorized) {
            this.errorMessage = `You are not authorized to ${this.eventName} ${resource.shortDescription}`;
        }
    }
}