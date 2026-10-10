import Constants from 'expo-constants';
import { Platform } from 'react-native';

import type { Todo } from '@/types';

function getBaseUrl() {
  if (Platform.OS === 'web') {
    return 'http://localhost:3000';
  }

  const host = Constants.expoConfig?.hostUri?.split(':')[0];

  if (host) {
    return `http://${host}:3000`;
  }

  return Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000';
}

const API_URL = `${getBaseUrl()}/todos`;

async function checkResponse(response: Response, message: string) {
  if (!response.ok) {
    throw new Error(`${message}: ${response.status}`);
  }
}

export async function getTodos(): Promise<Todo[]> {
  const response = await fetch(API_URL);
  await checkResponse(response, 'Помилка завантаження');
  return response.json();
}

export async function addTodo(text: string): Promise<Todo> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, completed: false, createdAt: Date.now() }),
  });
  await checkResponse(response, 'Помилка додавання');
  return response.json();
}

export async function toggleTodo(id: string, completed: boolean): Promise<Todo> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
  await checkResponse(response, 'Помилка оновлення статусу');
  return response.json();
}

export async function updateTodoText(id: string, text: string): Promise<Todo> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  await checkResponse(response, 'Помилка редагування');
  return response.json();
}

export async function deleteTodo(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  await checkResponse(response, 'Помилка видалення');
}
