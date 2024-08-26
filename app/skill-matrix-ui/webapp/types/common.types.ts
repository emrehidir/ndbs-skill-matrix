import BaseController from "com/ndbs/skillmatrixui/controller/BaseController";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import { Model$RequestFailedEvent as RequestFailedEvent } from "sap/ui/model/Model";

export enum FormTypes {
    SMART,
    SIMPLE
}

export interface IPage {
    onODataRequestFail(event: RequestFailedEvent): void;
    onObjectMatched(event?: Route$PatternMatchedEvent): void;
}

export type PageController = IPage & BaseController;