using SkillMatrix as service from '../../../../srv/data-provider';

annotate service.SkillSet with {
    ID                 @Common.Label: '{i18n>skillID}';
    name               @Common.Label: '{i18n>skillName}';
 
};