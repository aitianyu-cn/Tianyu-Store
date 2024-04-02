/**@format */

/**
 * A missing type of Tianyu Store to replace null value
 * when the state getter could not find a required value
 */
export class Missing {
    /** the error or missing message */
    message?: string;

    public constructor() {}
}
