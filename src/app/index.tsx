import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '@/components/Header';
import { TodoForm } from '@/components/TodoForm';
import { TodoList } from '@/components/TodoList';
import {
  addTodo,
  deleteTodo,
  getTodos,
  toggleTodo,
  updateTodoText,
} from '@/services/api';
import type { Todo } from '@/types';

export default function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadTodos = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');
      setTodos(await getTodos());
    } catch (requestError) {
      setError('Не вдалося з’єднатися із сервером. Запустіть json-server на порту 3000.');
      console.error('Не вдалося завантажити завдання:', requestError);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    getTodos()
      .then((data) => {
        if (active) {
          setTodos(data);
          setError('');
        }
      })
      .catch((requestError) => {
        if (active) {
          setError('Не вдалося з’єднатися із сервером. Запустіть json-server на порту 3000.');
        }
        console.error('Не вдалося завантажити завдання:', requestError);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleAdd = async (text: string) => {
    try {
      const todo = await addTodo(text);
      setTodos((current) => [...current, todo]);
    } catch (requestError) {
      console.error('Не вдалося додати завдання:', requestError);
      Alert.alert('Помилка', 'Не вдалося додати завдання.');
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      setTodos((current) =>
        current.map((todo) => (todo.id === id ? { ...todo, completed } : todo)),
      );
      await toggleTodo(id, completed);
    } catch (requestError) {
      console.error('Не вдалося змінити статус завдання:', requestError);
      await loadTodos();
      Alert.alert('Помилка', 'Не вдалося змінити статус завдання.');
    }
  };

  const handleEdit = async (id: string, text: string) => {
    try {
      const updatedTodo = await updateTodoText(id, text);
      setTodos((current) =>
        current.map((todo) => (todo.id === id ? updatedTodo : todo)),
      );
    } catch (requestError) {
      console.error('Не вдалося відредагувати завдання:', requestError);
      Alert.alert('Помилка', 'Не вдалося відредагувати завдання.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos((current) => current.filter((todo) => todo.id !== id));
    } catch (requestError) {
      console.error('Не вдалося видалити завдання:', requestError);
      Alert.alert('Помилка', 'Не вдалося видалити завдання.');
    }
  };

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.page}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Header totalCount={todos.length} completedCount={completedCount} />

          {error ? (
            <View style={styles.errorBox}>
              <View style={styles.errorContent}>
                <Text style={styles.errorTitle}>⚠️ Помилка з’єднання</Text>
                <Text style={styles.errorText}>{error}</Text>
              </View>
              <Pressable style={styles.retryButton} onPress={() => loadTodos()}>
                <Text style={styles.retryText}>Повторити</Text>
              </Pressable>
            </View>
          ) : null}

          <TodoForm onAdd={handleAdd} loading={loading} />

          {loading && todos.length === 0 ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text style={styles.loadingText}>Завантаження...</Text>
            </View>
          ) : (
            <View style={styles.listBox}>
              <TodoList
                todos={todos}
                refreshing={refreshing}
                onRefresh={() => loadTodos(true)}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEF2FF',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  card: {
    flex: 1,
    width: '100%',
    maxWidth: 620,
    backgroundColor: '#FFFFFF',
    borderColor: '#C7D2FE',
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    shadowColor: '#312E81',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 6,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    color: '#991B1B',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    lineHeight: 18,
  },
  retryButton: {
    backgroundColor: '#DC2626',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginLeft: 10,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 15,
    marginTop: 10,
  },
  listBox: {
    flex: 1,
  },
});
