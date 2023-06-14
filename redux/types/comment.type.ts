export interface CommentState {
  newComment: {
    data: any;
    isLoading: boolean;
    error: string;
  };
  comments: {
    data: any[];
    isLoading: boolean;
    error: string;
  };
}
