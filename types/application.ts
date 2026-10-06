export type ApplicationType = "adopt" | "sponsor";

export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface ApplicationInput {
  rabbitId: string;
  rabbitName: string;
  applicationType: ApplicationType;
  fullName: string;
  occupation: string;
  phone: string;
  email: string;
  introduction: string;
  housingType: string;
  keepIndoor: "yes" | "no";
  hasAirCon: "yes" | "no";
  acceptCosts: boolean;
  canVisitVet: boolean;
}

export interface Application extends ApplicationInput {
  id: string;
  status: ApplicationStatus;
  createdAt: Date;
  reviewedAt: Date | null;
  autoRejected?: boolean;
}
