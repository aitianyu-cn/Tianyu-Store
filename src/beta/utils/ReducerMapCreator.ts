/**@format */

import { Reducer } from "../types/Reducer";
import { Selector } from "../types/Selector";
import { IStoreStub } from "../types/Stub";

export function reducerMapCreator(stub: IStoreStub): Map<string, Selector | Reducer> {}
