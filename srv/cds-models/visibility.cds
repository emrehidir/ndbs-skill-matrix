using SkillMatrix from '../data-provider';

using {
    ApplicationVisibilities as DBApplicationVisibilities,
    ApplicationElements     as DBApplicationElements,
    ApplicationResources    as DBApplicationResources,
    BackendAuthorizations   as DBBackendAuthorizations,
    ElementDependencies     as DBElementDependencies
} from '../../db/cds-models/visibility';

extend service SkillMatrix with {

    /********************************************************************************************************/
    /* Action - Function Imports                                                                            */
    /********************************************************************************************************/

    action updateBackendVisibilities(visibilityID : UUID) returns Boolean;

    /********************************************************************************************************/
    /* Main Entities                                                                                        */
    /********************************************************************************************************/

    entity BackendAuthorizations    as select from DBBackendAuthorizations;

    @readonly
    entity ElementDependencies      as select from DBElementDependencies;

    @cds.redirection.target: true
    entity ApplicationVisibilities  as select from DBApplicationVisibilities;

    @readonly
    @cds.redirection.target: true
    entity ApplicationResources     as select from DBApplicationResources;

    @readonly
    @cds.redirection.target: true
    entity ApplicationElements      as
        select from DBApplicationElements
        order by
            group;

    /********************************************************************************************************/
    /* Composite or Table Views                                                                             */
    /********************************************************************************************************/

    entity VApplicationVisibilities as
        select from DBApplicationVisibilities {
            key ID,
                group,
                uiElement,
                adminCanSee,
                managerCanSee,
                userCanSee,
                noneCanSee,
                case uiElement
                    when
                        'btnAddNewPersonnel'
                    then
                        1
                    when
                        'btnDeletePersonnel'
                    then
                        1
                    when
                        'btnUpdatePersonnel'
                    then
                        1
                    else
                        3
                end as visibilityEditible : Integer,
                toApplicationGroup,
                toApplicationElement
        }
        order by
            group;

    entity VBackendAuthorizations   as
        select from DBBackendAuthorizations {
            key ID,
                group,
                resourceName,
                adminCanCreate,
                adminCanUpdate,
                adminCanDelete,
                adminCanRead,
                managerCanCreate,
                managerCanUpdate,
                managerCanDelete,
                managerCanRead,
                userCanCreate,
                userCanUpdate,
                userCanDelete,
                userCanRead,
                noneCanCreate,
                noneCanUpdate,
                noneCanDelete,
                noneCanRead,
                isCreatable,
                isUpdatable,
                isDeletable,
                isReadable,
                case resourceName
                    when
                        'Personnels'
                    then
                        1
                    else
                        case isCreatable
                            when
                                true
                            then
                                3
                            else
                                1
                        end
                end as createEditible : Integer,
                case resourceName
                    when
                        'Personnels'
                    then
                        1
                    else
                        case isUpdatable
                            when
                                true
                            then
                                3
                            else
                                1
                        end
                end as updateEditible : Integer,
                case resourceName
                    when
                        'Personnels'
                    then
                        1
                    when
                        'VPersonnels'
                    then
                        1
                    else
                        case isDeletable
                            when
                                true
                            then
                                3
                            else
                                1
                        end
                end as deleteEditible : Integer,
                case isReadable
                    when
                        true
                    then
                        3
                    else
                        1
                end as readEditible   : Integer,
                toApplicationGroup,
                toApplicationResource
        }
        order by
            group;
};