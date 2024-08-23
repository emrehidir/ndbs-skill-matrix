using SkillMatrix from '../data-provider';

using {
    Personnels     as DBPersonnels,
    PersonnelUsers as DBPersonnelUsers
} from '../../db/cds-models/personnel';

using {SkillMatrix as VHService} from './value-help-list';

extend service SkillMatrix with {


    /********************************************************************************************************/
    /* Main Entities                                                                                        */
    /********************************************************************************************************/

    @cds.redirection.target: true
    entity Personnels     as select from DBPersonnels;

    entity PersonnelUsers as
        select from DBPersonnelUsers {
            *,
            toCountryVH : Association to VHService.VHCountries on toCountryVH.code = $self.country
        };

    /********************************************************************************************************/
    /* Composite or Table Views                                                                             */
    /********************************************************************************************************/

    @Capabilities.Insertable: false
    @Capabilities.Updatable : false
    entity VPersonnels    as
        select from DBPersonnels {
            *,
            case isActive
                when
                    true
                then
                    3
                when
                    false
                then
                    1
                else
                    0
            end                                                                  as isActiveCriticality    : Integer,
            case isDedicated
                when
                    true
                then
                    3
                when
                    false
                then
                    1
                else
                    0
            end                                                                  as isDedicatedCriticality : Integer,
            toTeam.toHeadOfTeam.firstName || ' ' || toTeam.toHeadOfTeam.lastName as headOfTeam             : String(80),
            toTeamVH                                                                                       : Association to VHService.VHTeams on toTeamVH.ID = $self.teamID,
            toCountryVH                                                                                    : Association to VHService.VHCountries on toCountryVH.code = $self.country
        };
};