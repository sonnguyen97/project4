import * as uuid from 'uuid';

import { TodoItem } from '../../models/TodoItem';
import { TodoDB } from '../dataAccessDB/todoDB';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';

const todoDB = new TodoDB()

export async function getTodos(userId: string): Promise<TodoItem[]> {
  return todoDB.getTodosForUser(userId);
}

export async function getTodo(userId: string, todoId: string): Promise<TodoItem> {
  return todoDB.getTodo(userId, todoId);
}
export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const id = uuid.v4();

  return await todoDB.createTodo({
    id,
    userId,
    name: createTodoRequest.name,
    done: false,
    createdAt: new Date().toISOString(),
    dueDate: createTodoRequest.dueDate
  })
}
export async function updateTodo(userId: string, id: string, payload: UpdateTodoRequest) : Promise<void>{
  return todoDB.updateTodo(userId, id, payload);
}

export async function updateTodoAttachment(userId: string, id: string): Promise<void> {
  return todoDB.updateTodoAttachment(userId, id);
}

export async function deleteTodo(userId: string, id: string): Promise<void> {
  return todoDB.deleteTodo(userId, id);
}

export async function removeTodoAttachment(userId: string, id: string): Promise<void> {
  return todoDB.removeTodoAttachment(userId, id);
}

export async function todoExists(id: string): Promise<boolean> {
  return await todoDB.todoExists(id);
}
