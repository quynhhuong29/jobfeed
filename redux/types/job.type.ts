import { JobInfo } from "@/types/Job";

export interface JobState {
  infoJob: JobInfo;
  listJobCompany: any;
  latestJobPosts: JobInfo[];
  countJobsIndustry: {
    count: number;
    industry_info: any;
  }[];
  isLoading: boolean;
  error: "";
}
