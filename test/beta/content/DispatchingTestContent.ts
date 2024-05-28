/** @format */

import { ITianyuStoreInterface } from "beta";
import { CreatePageStateAction, PageIndexChangeAction } from "./dispatching-test/action/PageStateActions";
import {
    CreateAction,
    CreateUserExternalConnectionAction,
    CreateUserExternalOperationAction,
    UserGetOptionAction,
    UserLifecycleAction,
    UserLogonAction,
} from "./dispatching-test/action/UserStateActions";
import { DestroyPageStateActionCreator } from "./dispatching-test/action/creator/PageStateActionCreator";
import { DestroyUserStateActionCreator } from "./dispatching-test/action/creator/UserStateActionCreator";
import { getCurrentPage } from "./dispatching-test/selector/PageStateSelector";
import {
    getConnectToken,
    getUser,
    getUserOperations,
    isUserLogon,
} from "./dispatching-test/selector/UserStateSelector";
import { ITestUserState } from "./DispatchingTestContent";
import { ITestPageState } from "./DispatchingTestContent";

export {
    type ITestUserState,
    type ITestPageState,
    USER_CONNECTION_EXTERNAL_OBJ,
    USER_OPTIONS_EXTERNAL_OBJ,
} from "./dispatching-test/Types";

export const TestUserStateInterface = {
    core: {
        creator: CreateAction,
        destroy: DestroyUserStateActionCreator,
    },
    action: {
        userLifecycleAction: UserLifecycleAction,
        userLogonAction: UserLogonAction,
        userGetOptionAction: UserGetOptionAction,
        CreateUserExternalConnectionAction: CreateUserExternalConnectionAction,
        CreateUserExternalOperationAction: CreateUserExternalOperationAction,
    },
    selector: {
        isUserLogon,
        getUser,
        getConnectToken,
        getUserOperations,
    },
};

export const TestPageStateInterface = {
    core: {
        creator: CreatePageStateAction,
        destroy: DestroyPageStateActionCreator,
    },
    action: {
        pageIndexChangeAction: PageIndexChangeAction,
    },
    selector: {
        getCurrentPage,
    },
};

export const TestUserStateStoreType = "user-state";
export const TestPageStateStoreType = "page-state";

TestUserStateInterface as ITianyuStoreInterface<ITestUserState>;
TestPageStateInterface as ITianyuStoreInterface<ITestPageState>;
