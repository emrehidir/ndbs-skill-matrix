import { connect, Service, QLExtensions } from "@sap/cds";
import { IApplicationVisibilities, IBackendAuthInsert, IBackendAuthorizations, IBackendAuthUpdate, IElementDependencies } from "../types/visibility.types";

export default class Visibility {
    private visibilityID: string;
    private db: Service;
    private readonly restrictedEntities = ["Personnels", "VPersonnels"];

    constructor(visibilityID: string) {
        this.visibilityID = visibilityID;
    }

    public async updateBackendAuthorizations(): Promise<boolean> {
        this.db = await connect.to("db");
        const { BackendAuthorizations } = this.db.entities;
        const elementVisibility = await this.getElementVisibility();

        if (!elementVisibility) {
            return true;
        }

        const insertEntries: Array<IBackendAuthInsert> = [];
        const updateEntries: Array<IBackendAuthUpdate> = [];

        for (const dependency of elementVisibility.toDependencies) {
            const resourceAuth: IBackendAuthorizations | null | undefined = await this.db.run(
                SELECT.one.from(BackendAuthorizations).where({ resourceName: dependency.dependency })
            );

            if (resourceAuth) {
                let backendAuthUpdate: IBackendAuthUpdate = this.getAuthUpdateData(dependency, resourceAuth, elementVisibility);
                updateEntries.push(backendAuthUpdate);
            } else {
                const backendAuthInsert: IBackendAuthInsert = this.getAuthInsertData(dependency, elementVisibility);
                insertEntries.push(backendAuthInsert);
            }
        }

        if (insertEntries.length) {
            await this.db.run(INSERT.into(BackendAuthorizations).entries(insertEntries));
        }

        for (const entry of updateEntries) {
            await this.db.run(UPDATE(BackendAuthorizations).with(entry).where({ ID: entry.ID }));
        }

        return true;
    }

    private async getElementVisibility(): Promise<IApplicationVisibilities | void> {
        const { ApplicationVisibilities } = this.db.entities;

        const selectQuery = SELECT.one.from(ApplicationVisibilities).columns((visibility: QLExtensions<IApplicationVisibilities>) => {
            visibility.ID,
                visibility.group,
                visibility.uiElement,
                visibility.adminCanSee,
                visibility.managerCanSee,
                visibility.userCanSee,
                visibility.noneCanSee,
                visibility.toDependencies(dependency => {
                    dependency.ID, dependency.dependency, dependency.createAuth, dependency.updateAuth, dependency.deleteAuth, dependency.readAuth,
                        dependency.toApplicationResource(resource => {
                            resource.isCreatable, resource.isUpdatable, resource.isDeletable, resource.isReadable
                        })
                })
        }).where({ ID: this.visibilityID });

        const elementVisibility: IApplicationVisibilities = await this.db.run(selectQuery);
        return elementVisibility;
    }

    private getAuthUpdateData(dependency: IElementDependencies, auth: IBackendAuthorizations, visibility: IApplicationVisibilities): IBackendAuthUpdate {
        let updateData: IBackendAuthUpdate = {
            ID: auth.ID
        };

        /* Create Authorization */
        updateData.managerCanCreate = (dependency.createAuth && visibility.managerCanSee) || false;
        updateData.userCanCreate = (dependency.createAuth && visibility.userCanSee && !this.restrictedEntities.includes(dependency.dependency)) || false;
        updateData.noneCanCreate = (dependency.createAuth && visibility.noneCanSee && !this.restrictedEntities.includes(dependency.dependency)) || false;

        /* Update Authorization */
        updateData.managerCanUpdate = (dependency.updateAuth && visibility.managerCanSee) || false;
        updateData.userCanUpdate = (dependency.updateAuth && visibility.userCanSee && !this.restrictedEntities.includes(dependency.dependency)) || false;
        updateData.noneCanUpdate = (dependency.updateAuth && visibility.noneCanSee && !this.restrictedEntities.includes(dependency.dependency)) || false;

        /* Delete Authorization */
        updateData.managerCanDelete = (dependency.deleteAuth && visibility.managerCanSee && !this.restrictedEntities.includes(dependency.dependency)) || false;
        updateData.userCanDelete = (dependency.deleteAuth && visibility.userCanSee && !this.restrictedEntities.includes(dependency.dependency)) || false;
        updateData.noneCanDelete = (dependency.deleteAuth && visibility.noneCanSee && !this.restrictedEntities.includes(dependency.dependency)) || false;

        /* Read Authorization */
        updateData.managerCanRead = (dependency.readAuth && visibility.managerCanSee) || false;
        updateData.userCanRead = (dependency.readAuth && visibility.userCanSee) || false;
        updateData.noneCanRead = (dependency.readAuth && visibility.noneCanSee) || false;

        for (const property of Object.keys(updateData)) {
            if (!updateData[property]) {
                delete updateData[property];
            }
        }

        return updateData;
    }

    private getAuthInsertData(dependency: IElementDependencies, visibility: IApplicationVisibilities): IBackendAuthInsert {
        const isCreatable = dependency.toApplicationResource.isCreatable;
        const isUpdatable = dependency.toApplicationResource.isUpdatable;
        const isDeletable = dependency.toApplicationResource.isDeletable;
        const isReadable = dependency.toApplicationResource.isReadable;

        let insertData: IBackendAuthInsert = {
            group: visibility.group,
            resourceName: dependency.dependency,
            adminCanCreate: isCreatable,
            adminCanUpdate: isUpdatable,
            adminCanDelete: isDeletable,
            adminCanRead: isReadable,
            managerCanCreate: isCreatable,
            managerCanUpdate: isUpdatable,
            managerCanDelete: isDeletable,
            managerCanRead: isReadable,
            userCanCreate: isCreatable,
            userCanUpdate: isUpdatable,
            userCanDelete: isDeletable,
            userCanRead: isReadable,
            noneCanCreate: isCreatable,
            noneCanUpdate: isUpdatable,
            noneCanDelete: isDeletable,
            noneCanRead: isReadable,
            isCreatable: dependency.toApplicationResource.isCreatable,
            isUpdatable: dependency.toApplicationResource.isUpdatable,
            isDeletable: dependency.toApplicationResource.isDeletable,
            isReadable: dependency.toApplicationResource.isReadable
        };

        /* Create Authorization */
        insertData.managerCanCreate = isCreatable && dependency.createAuth && visibility.managerCanSee;
        insertData.userCanCreate = isCreatable && dependency.createAuth && visibility.userCanSee && dependency.dependency !== "Personnels";
        insertData.noneCanCreate = isCreatable && dependency.createAuth && visibility.noneCanSee && dependency.dependency !== "Personnels";

        /* Update Authorization */
        insertData.managerCanUpdate = isUpdatable && dependency.updateAuth && visibility.managerCanSee;
        insertData.userCanUpdate = isUpdatable && dependency.updateAuth && visibility.userCanSee && dependency.dependency !== "Personnels";
        insertData.noneCanUpdate = isUpdatable && dependency.updateAuth && visibility.noneCanSee && dependency.dependency !== "Personnels";

        /* Delete Authorization */
        insertData.managerCanDelete = isDeletable && dependency.deleteAuth && visibility.managerCanSee && !this.restrictedEntities.includes(dependency.dependency);
        insertData.userCanDelete = isDeletable && dependency.deleteAuth && visibility.userCanSee && !this.restrictedEntities.includes(dependency.dependency);
        insertData.noneCanDelete = isDeletable && dependency.deleteAuth && visibility.noneCanSee && !this.restrictedEntities.includes(dependency.dependency);

        /* Read Authorization */
        insertData.managerCanRead = isReadable && dependency.readAuth && visibility.managerCanSee;
        insertData.userCanRead = isReadable && dependency.readAuth && visibility.userCanSee;
        insertData.noneCanRead = isReadable && dependency.readAuth && visibility.noneCanSee;

        return insertData;
    }
}