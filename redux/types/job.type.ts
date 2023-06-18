import { JobInfo } from "@/types/Job";

export interface JobState {
  infoJob: JobInfo;
  isLoading: boolean;
  error: "";
}
