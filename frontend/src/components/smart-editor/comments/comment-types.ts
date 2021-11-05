export interface INewComment {
  text: string;
  threadId?: string;
  klagebehandlingId: string;
}

export interface ICreateComment {
  callback: (threadId: string) => void;
  comment: INewComment;
}

// export interface ICommentsState {
//   busy: boolean;
//   error: string | null;
//   open: boolean;
//   showNewThread: boolean;
//   focusedThreadIds: string[];
//   selection: Selection;
//   threads: {
//     [key: string]: IThread;
//   };
// }

export interface IThread {
  id: string;
  comments: IComment[];
}

export interface IComment {
  id: string;
  created: string; // LocalDateTime
  author: IAuthor;
  text: string;
}

export interface IAuthor {
  id: string;
  name: string;
}
