using SkillMatrix from '../data-provider';

using { SkillGroup as DBSkillGroup,
SkillSet as DBSkillSet} from '../../db/cds-models/skill-matrix';

extend service SkillMatrix with {

    @cds.redirection.target: true
    entity SkillSet   as select from DBSkillSet;

    @cds.redirection.target: true
    entity SkillGroup as select from DBSkillGroup;

}
