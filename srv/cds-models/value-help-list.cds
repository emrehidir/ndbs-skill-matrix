using SkillMatrix from '../data-provider';

using {
    ApplicationVisibilities as DBApplicationVisibilities,
    ApplicationGroups       as DBApplicationGroups,
    ApplicationElements     as DBApplicationElements,
    ApplicationResources    as DBApplicationResources,
    BackendAuthorizations   as DBBackendAuthorizations
} from '../../db/cds-models/visibility';

using {

    Countries          as DBCountries,
  
} from '../../db/cds-models/configurations';




using {
    Personnels     as DBPersonnels,
    PersonnelUsers as DBPersonnelUsers
} from '../../db/cds-models/personnel';
using Teams as DBTeams from '../../db/cds-models/teams';

using {PersonnelUsers} from './personnel';
using {ApplicationResources} from './visibility';

extend service SkillMatrix with {
    @readonly
    entity VHCountries                  as projection on DBCountries;

    @readonly
    @cds.search: {fullName}
    entity VHPersonnels                 as
        projection on DBPersonnels {
            key ID,
                firstName || ' ' || lastName as fullName : String(80)
        };

    @readonly
    @cds.search: {name}
    entity VHTeams                      as
        projection on DBTeams {
            key ID,
                name,
                toHeadOfTeam.firstName || ' ' || toHeadOfTeam.lastName as headOfTeamName : String(80)
        };

    @readonly
    @cds.search: {fullName}
    entity VHHeadOfTeams                as
        select from DBTeams as team
        inner join DBPersonnels as personnel
            on personnel.ID = team.headOfTeam
        {
            key personnel.ID                                     as personnelID,
                personnel.firstName || ' ' || personnel.lastName as fullName : String(80),
                team.name
        };



    @readonly
    entity VHApplicationGroups          as select from DBApplicationGroups;

    @readonly
    entity VHApplicationElements        as
        select from DBApplicationElements as appElement
        where
            appElement.ID not in (
                select uiElement from DBApplicationVisibilities
            )
        order by
            group;

    @readonly
    entity VHApplicationResources       as
        select from DBApplicationResources as appResource
        where
            appResource.resourceName not in (
                select resourceName from DBBackendAuthorizations
            )
        order by
            group;

    @readonly
    entity VHBackendAuth                as select from DBBackendAuthorizations;

    @readonly
    entity VHAppVisibilities            as select from DBApplicationVisibilities;

    @readonly
    entity VHPersonnelInfo              as select from DBPersonnels;

    @readonly
    entity VHAppResources               as
        select from DBApplicationResources {
            key resourceName,
                shortDescription
        };

  
  
};