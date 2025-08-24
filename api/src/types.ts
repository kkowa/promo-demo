export type Status =
  | "DRAFT"
  | "SUBMITTED"
  | "MANAGER_REVIEW"
  | "RETURNED"
  | "MANAGER_APPROVED";

export interface Application {
  _id?: string;
  employeeId: string;
  managerId: string;
  status: Status;
  fields: {
    currentLevel: string;
    targetLevel: string;
    justification: string;
    attachments?: string[];
  };
  eligibility?: {
    tenureDays: number;
    certCount: number;
    meetsTenureRule: boolean;
    meetsCertRule: boolean;
  };
  comments?: { by: string; when: string; text: string }[];
  submittedAt?: string;
}
