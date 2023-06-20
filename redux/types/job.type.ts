import { JobInfo } from "@/types/Job";

export interface JobState {
  infoJob: JobInfo;
  listJobCompany: any;
  isLoading: boolean;
  error: "";
}
