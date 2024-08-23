using {managed} from '@sap/cds/common';

@assert.unique: {uiElement: [uiElement]}
entity ApplicationVisibilities : managed {
    key ID                   : UUID;
        group                : ApplicationGroups:ID;
        uiElement            : ApplicationElements:ID;
        adminCanSee          : Boolean;
        managerCanSee        : Boolean;
        userCanSee           : Boolean;
        noneCanSee           : Boolean;
        toApplicationGroup   : Association to one ApplicationGroups
                                   on toApplicationGroup.ID = $self.group;
        toApplicationElement : Association to one ApplicationElements
                                   on toApplicationElement.ID = $self.uiElement;
        toDependencies       : Association to many ElementDependencies
                                   on toDependencies.toVisibility = $self;
};

entity ApplicationGroups {
    key ID          : String(50);
        description : String(100);
};

entity ApplicationElements {
    key ID             : String(50);
        type           : String(20);
        group          : ApplicationGroups:ID;
        description    : String(255);
        toDependencies : Association to many ElementDependencies
                             on toDependencies.toApplicationElement = $self;
};

entity ElementDependencies {
    key ID                    : ApplicationElements:ID;
    key dependency            : ApplicationResources:resourceName;
        createAuth            : Boolean;
        updateAuth            : Boolean;
        deleteAuth            : Boolean;
        readAuth              : Boolean;
        description           : String(255);
        toVisibility          : Association to one ApplicationVisibilities
                                    on toVisibility.uiElement = $self.ID;
        toApplicationElement  : Association to one ApplicationElements
                                    on toApplicationElement.ID = $self.ID;
        toApplicationResource : Association to one ApplicationResources
                                    on toApplicationResource.resourceName = $self.dependency;
};

@assert.unique: {resourceName: [resourceName]}
entity BackendAuthorizations {
    key ID                    : UUID;
        group                 : ApplicationGroups:ID;
        resourceName          : ApplicationResources:resourceName;
        adminCanCreate        : Boolean;
        adminCanUpdate        : Boolean;
        adminCanDelete        : Boolean;
        adminCanRead          : Boolean;
        managerCanCreate      : Boolean;
        managerCanUpdate      : Boolean;
        managerCanDelete      : Boolean;
        managerCanRead        : Boolean;
        userCanCreate         : Boolean;
        userCanUpdate         : Boolean;
        userCanDelete         : Boolean;
        userCanRead           : Boolean;
        noneCanCreate         : Boolean;
        noneCanUpdate         : Boolean;
        noneCanDelete         : Boolean;
        noneCanRead           : Boolean;
        isCreatable           : Boolean;
        isUpdatable           : Boolean;
        isDeletable           : Boolean;
        isReadable            : Boolean;
        toApplicationGroup    : Association to one ApplicationGroups
                                    on toApplicationGroup.ID = $self.group;
        toApplicationResource : Association to one ApplicationResources
                                    on toApplicationResource.resourceName = $self.resourceName;
};

entity ApplicationResources {
    key resourceName     : String(50);
        type             : String(20);
        group            : ApplicationGroups:ID;
        isCreatable      : Boolean;
        isUpdatable      : Boolean;
        isDeletable      : Boolean;
        isReadable       : Boolean;
        shortDescription : String(50);
        description      : String(255);
};