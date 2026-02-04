export declare enum AdminProfileType {
    FAMILY = "family",
    ELDER = "elder",
    CAREGIVER = "caregiver"
}
export declare class AdminProfileQueryDto {
    type: AdminProfileType;
    id: string;
}
