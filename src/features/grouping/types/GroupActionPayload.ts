import { Group } from "./Group";

export type GroupCreationPayload = Omit<Group, "id" | "childrenIDs" | "parentID">
