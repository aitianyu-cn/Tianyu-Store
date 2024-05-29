/**@format */

/**
 * Tianyu Store Hierarchy Checklist
 * additional component to provide a instance hierarchy description.
 * This checklist will describe that what store type can be stored into a parent instance.
 *
 * NOTE
 *  - Entity Type
 *      We suggest the entity type should be unified to prevent some unstable risk.
 *  - Structure
 *      The first level equuals to store root level. Only first level entity type can be stored into
 *      store root.
 *  - Value
 *      Each entity type could have a sub-instance list too, or the entity type is the end of hierarchy
 *      structure, the undefined type can be applied.
 *      If the sub-instances should not to have them sub-instance, the string can be applied or string array
 *      for multiple instances.
 */
export interface IStoreHierarchyChecklist {
    [entityType: string]: IStoreHierarchyChecklist | string[] | string | undefined;
}
