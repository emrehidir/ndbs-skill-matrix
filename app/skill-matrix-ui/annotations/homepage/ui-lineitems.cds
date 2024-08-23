using SkillMatrix as service from '../../../../srv/data-provider';

annotate service.SkillSet with @(UI: {LineItem: [
    {
        $Type: 'UI.DataField',
        Value: ID
    },
    {
        $Type: 'UI.DataField',
        Value: name,
    }
]});