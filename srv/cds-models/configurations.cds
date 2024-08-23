using SkillMatrix from '../data-provider';

using {
    Countries          as DBCountries,

} from '../../db/cds-models/configurations';

extend service SkillMatrix with {

    /********************************************************************************************************/
    /* Main Entities                                                                                        */
    /********************************************************************************************************/

    entity Countries          as select from DBCountries;

};