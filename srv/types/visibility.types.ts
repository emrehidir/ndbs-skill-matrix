export interface IApplicationResources {
    resourceName: string;
    type: string;
    group: string;
    isCreatable: boolean;
    isUpdatable: boolean;
    isDeletable: boolean;
    isReadable: boolean;
    shortDescription: string;
    description: string;
}

export interface IBackendAuthUpdate {
    ID: string;
    managerCanCreate?: boolean;
    userCanCreate?: boolean;
    noneCanCreate?: boolean;
    managerCanUpdate?: boolean;
    userCanUpdate?: boolean;
    noneCanUpdate?: boolean;
    managerCanDelete?: boolean;
    userCanDelete?: boolean;
    noneCanDelete?: boolean;
    managerCanRead?: boolean;
    userCanRead?: boolean;
    noneCanRead?: boolean;
}

export interface IBackendAuthInsert {
    group?: string | null;
    resourceName?: string | null;
    adminCanCreate?: boolean | null;
    adminCanUpdate?: boolean | null;
    adminCanDelete?: boolean | null;
    adminCanRead?: boolean | null;
    managerCanCreate?: boolean | null;
    managerCanUpdate?: boolean | null;
    managerCanDelete?: boolean | null;
    managerCanRead?: boolean | null;
    userCanCreate?: boolean | null;
    userCanUpdate?: boolean | null;
    userCanDelete?: boolean | null;
    userCanRead?: boolean | null;
    noneCanCreate?: boolean | null;
    noneCanUpdate?: boolean | null;
    noneCanDelete?: boolean | null;
    noneCanRead?: boolean | null;
    isCreatable?: boolean | null;
    isUpdatable?: boolean | null;
    isDeletable?: boolean | null;
    isReadable?: boolean | null;
}

export interface IBackendAuthorizations extends IBackendAuthInsert{
    ID: string;
}

export interface IApplicationVisibilities {
    ID: string;
    group?: string | null;
    uiElement?: string | null;
    adminCanSee?: boolean | null;
    managerCanSee?: boolean | null;
    userCanSee?: boolean | null;
    noneCanSee?: boolean | null;
    toDependencies: Array<IElementDependencies>
}

export interface IElementDependencies {
    ID: string;
    dependency: string;
    createAuth: boolean;
    updateAuth: boolean;
    deleteAuth: boolean;
    readAuth: boolean;
    toApplicationResource: IApplicationResources;
}