import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import type { Todo } from '@/types';

import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, text: string) => Promise<void>;
}

export function TodoList({
  todos,
  refreshing,
  onRefresh,
  onToggle,
  onDelete,
  onEdit,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyIcon}>✅</Text>
        <Text style={styles.emptyTitle}>Список порожній</Text>
        <Text style={styles.emptyText}>Додайте нове завдання вище</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={todos}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TodoItem
          todo={item}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 8,
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 42,
    marginBottom: 10,
  },
  emptyTitle: {
    color: '#374151',
    fontSize: 19,
    fontWeight: '700',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 15,
    marginTop: 5,
  },
});
