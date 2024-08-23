using Teams from './teams';

entity SkillGroup {
    key ID     : String(10);
        name   : String(80);
        teamID : Teams:ID;
        toTeam : Association to one Teams
                     on toTeam.ID = $self.teamID;
};

entity SkillSet {
    key ID           : String(10);
        name         : String(80);
        groupID      : SkillGroup:ID;
        level        : String(1);
        toSkillGroup : Association to one SkillGroup
                           on toSkillGroup.ID = $self.groupID;
}
