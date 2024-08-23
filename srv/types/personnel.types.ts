export interface IPersonnels {
    ID: string;
    firstName?: string | null;
    lastName?: string | null;
    country?: string | null;
    teamID?: string | null;
    isActive?: boolean | null;
    email?: string | null;
    userRole?: "A" | "M" | "U" | null;
    sfUser?: string | null;

}

export interface ICurrentUserInfo {
    personnelID: string;
    successFactorsID?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    teamID?: string | null;
    teamName?: string | null;
    userRole?: string | null;
}