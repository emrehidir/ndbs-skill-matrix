import Filter from "sap/ui/model/Filter";
import BaseController from "com/ndbs/skillmatrixui/controller/BaseController";
import { Model$RequestFailedEvent as RequestFailedEvent } from "sap/ui/model/Model";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";

export interface IPage {
    onODataRequestFail(event: RequestFailedEvent): void;
    onObjectMatched(event?: Route$PatternMatchedEvent): void;
}

export type PageController = IPage & BaseController;

export enum DefaultMessages {
    NO_I18N_TEXT = "The message could not be displayed due to technical issues. Contact the administrator."
}

export enum Routes {
    APP="",
    HOMEPAGE = "RouteHomepage",
    JOB_DETAILS = "RouteJobDetails",
    PORTLETSOVERVIEW = "RoutePortletsOverview",
    PORTLETRESULTS = "RoutePortletResults",
    PORTLETRESULTDETAILS = "RoutePortletResultDetails",
    ADMINPANEL = "RouteAdminPanel",
    DIRECT_LINK = "RouteNoDirectLink"
}

export enum ApplicationGroups {
    HOMEPAGE = "Homepage",
    PORTLETSOVERVIEW = "PortletsOverview",
    PORTLETRESULTS = "PortletResults",
    PORTLETRESULTDETAILS = "PortletResultDetails",
    AdminPanel = "AdminPanel",
}

export interface IUserAPI {
    name: string;
    firstname: string;
    lastname: string;
    email: string;
}

export interface IBindingParams {
    filters: Filter[];
    parameters: {
        expand: string;
        numberOfExpandedLevels: number;
        [key: string]: any;
    };
    events: { [key: string]: Function };
}

export interface ISubmitChangeResponse<T> {
    __batchResponses: IBatchResponses<T>[];
}

export interface IBatchResponses<T> {
    __changeResponses?: IChangeResponses<T>[];
    response?: ISubmitResponse;
    $reported?: boolean;
    message?: string;
}

export interface IChangeResponses<T> {
    $reported?: boolean;
    _imported?: boolean;
    statusCode?: string;
    statusText?: string;
    headers?: object;
    data?: T;
    response?: ISubmitResponse;
}

export interface ISubmitResponse {
    statusCode?: string;
    body?: string;
    statusText?: string;
    headers?: object;
}