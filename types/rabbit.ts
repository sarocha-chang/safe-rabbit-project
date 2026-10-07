export type RabbitStatus =
  "available" | "adopted" | "sponsored" | "passed_away" | "resident";

export type RabbitGender = "male" | "female";

export interface Rabbit {
  id: string;
  name: string;
  gender: RabbitGender;
  ageMonth: number;
  neutered: boolean;
  story: string;
  medicalCondition: string;
  motto: string;
  breeds: string[];
  status: RabbitStatus;
  intakeDate: Date;
  adoptedDate: Date | null;
  coverImage: string;
  images: string[];
  isActive: boolean;
  createdByDemo?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
