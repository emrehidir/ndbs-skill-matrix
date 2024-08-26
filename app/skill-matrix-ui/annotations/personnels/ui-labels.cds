using SkillMatrix as service from '../../../../srv/data-provider';

annotate service.Personnels with {
    ID @Common.Label: '{i18n>personnelID}';
    firstName @Common.Label: '{i18n>personnelName}';
    country @Common.Label: '{i18n>country}';
} ;
