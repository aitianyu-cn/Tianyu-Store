/** @format */

import { createStore } from "beta/Store";
import {
    TestPageStateInterface,
    TestPageStateStoreType,
    TestUserStateInterface,
    TestUserStateStoreType,
} from "./DispatchingTestContent";

export const TianyuStore = createStore();

TianyuStore.registerInterface({
    [TestUserStateStoreType]: TestUserStateInterface,
    [TestPageStateStoreType]: TestPageStateInterface,
});

export const internalCache = {};
