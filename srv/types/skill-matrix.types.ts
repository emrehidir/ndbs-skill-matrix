export interface ISkillGroup {
    ID: string
    name?: string | null;
    teamID?: string | null;
    toTeam?: string;
}
export interface ISkillSet {
    ID: string
    name?: string | null;
    groupID?: string | null;
    level?: string | null;
    toSkillGroup?: string
}