export enum TodoListStatusEnum {
  PENDING = 0,
  COMPLETED = 1,
}

export interface TodoListItemState {
  id?: string
  todoName: string
  status: TodoListStatusEnum
}

export interface TodoFormState {
  todoContent: string
}
