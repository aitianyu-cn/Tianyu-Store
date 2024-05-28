/** @format */

import { ActionFactor } from "beta/store/ActionFactor";
import { ITestUserState } from "../../Types";

export const CreateUserStateActioCreator = ActionFactor.makeCreateStoreAction<ITestUserState>();

export const DestroyUserStateActionCreator = ActionFactor.makeDestroyStoreAction();

export const UserLifecycleCreateActionCreator = ActionFactor.makeActionCreator<ITestUserState>();
export const UserLifecycleDestroyActionCreator = ActionFactor.makeActionCreator<ITestUserState>();

export const CreateUserExternalConnectionActionCreator = ActionFactor.makeActionCreator();
export const CreateUserExternalOperationActionCreator = ActionFactor.makeActionCreator();

export const RemoveUserExternalConnectionActionCreator = ActionFactor.makeActionCreator();
export const RemoveUserExternalOperationActionCreator = ActionFactor.makeActionCreator();

export const UserLogonActionCreator = ActionFactor.makeActionCreator<
    ITestUserState,
    {
        user: string;
    }
>();

export const UserGetOptionActionCreator = ActionFactor.makeActionCreator<ITestUserState>();
