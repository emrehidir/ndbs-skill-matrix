using SkillMatrix from '../data-provider';

using {
    Teams              as DBTeams,
} from '../../db/cds-models/teams';

using Personnels as DBPersonnels from '../../db/cds-models/personnel';
using {SkillMatrix as VHService} from './value-help-list';

extend service SkillMatrix with {

    /********************************************************************************************************/
    /* Main Entities                                                                                        */
    /********************************************************************************************************/

    @cds.redirection.target: true
    entity Teams              as select from DBTeams;

   
    /********************************************************************************************************/
    /* Composite or Table Views                                                                             */
    /********************************************************************************************************/

    @Capabilities.Insertable: false
    @Capabilities.Updatable : false
    entity VTeams             as
        select from DBTeams as team
        left outer join (
            select
                teamID,
                count(teamID) as numberOfPersonnels
            from DBPersonnels
            where
                isActive = true
            group by
                teamID
        ) as personnel
            on personnel.teamID = team.ID
        {
            key team.ID,
                team.name,          
                headOfTeam,
                team.toHeadOfTeam.firstName || ' ' || team.toHeadOfTeam.lastName as headOfTeamName     : String(80),
                case
                    when
                        personnel.numberOfPersonnels is null
                    then
                        0
                    else
                        personnel.numberOfPersonnels
                end                                                              as numberOfPersonnels : Integer,
                toTeamHeadVH                                                                           : Association to VHService.VHHeadOfTeams on toTeamHeadVH.personnelID = $self.headOfTeam
        };

  
};