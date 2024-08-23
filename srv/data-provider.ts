import { ApplicationService, connect, Service, Request, TypedRequest, utils } from "@sap/cds";
import { IApplicationResources } from "./types/visibility.types";
import AuthHandler from "./lib/auth-handler";
import Visibility from "./lib/visibility";
import { ICurrentUserInfo, IPersonnels } from "./types/personnel.types";
import { ITeams } from "./types/teams.types";
import { CustomError } from "./types/global.types";

export default class SkillMatrix extends ApplicationService {
    async init(): Promise<void> {
        const db: Service = await connect.to("db");
        const { ApplicationResources } = db.entities("SkillMatrix");
        const appResources: Array<IApplicationResources> = await db.run(SELECT.from(ApplicationResources).where({ type: "Entity" }));
        const appEntities: string[] = appResources.map(src => src.resourceName);

        const adminEntities = [
            "ApplicationElements",
            "ApplicationResources",
            "ApplicationVisibilities",
            "BackendAuthorizations",
            "ElementDependencies",
            "VApplicationVisibilities",
            "VBackendAuthorizations",
            "VHApplicationElements",
            "VHApplicationGroups",
            "VHApplicationResources"
        ];

      

        this.on("getCurrentUser", (req: Request, next: Function): string => {
            return req.user.id;
        });

        this.on("getCurrentUserInfo", async (req: Request, next: Function): Promise<null | ICurrentUserInfo> => {
            const db = await connect.to("db");
            const { Personnels, Teams } = db.entities;
            const user: IPersonnels | null = await db.run(SELECT.one.from(Personnels).where({ sfUser: req.user.id }));
            let teamName: string | null = null;

            if (!user) {
                return user;
            }

            if (user.teamID) {
                const team = await db.run(SELECT.one.from(Teams).where({ ID: user.teamID })) as ITeams;
                teamName = team.name as string;
            }

            return {
                personnelID: user.ID,
                firstName: user.firstName,
                lastName: user.lastName,
                teamID: user.teamID,
                teamName: teamName,
                successFactorsID: user.sfUser,
                userRole: user.userRole
            };
        });

  
       


        return super.init();
    }
}