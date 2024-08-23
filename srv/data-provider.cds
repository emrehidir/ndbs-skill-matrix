using from './cds-models/configurations';
using Teams as DBTeams from '../db/cds-models/teams';
using from './cds-models/visibility';
using from './cds-models/personnel';
using from './cds-models/teams';
using from './cds-models/skill-matrix';
using Personnels as DBPersonnels from '../db/cds-models/personnel';

@(requires: 'authenticated-user')
service SkillMatrix {
    entity VHPersonnelInfo2 as projection on DBPersonnels;
    
}