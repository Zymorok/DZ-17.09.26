import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { Todo } from '@/types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, text: string) => Promise<void>;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(todo.text);
  const [updating, setUpdating] = useState(false);

  const handleSave = async () => {
    const value = text.trim();

    if (!value) {
      setText(todo.text);
      setEditing(false);
      return;
    }

    try {
      setUpdating(true);
      if (value !== todo.text) {
        await onEdit(todo.id, value);
      }
      setEditing(false);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setText(todo.text);
    setEditing(false);
  };

  return (
    <View style={[styles.container, todo.completed && styles.completedContainer]}>
      <Pressable
        style={[styles.checkbox, todo.completed && styles.checkboxCompleted]}
        onPress={() => onToggle(todo.id, !todo.completed)}
        disabled={updating}
        accessibilityRole="checkbox"
        accessibilityLabel={`Змінити статус: ${todo.text}`}
        accessibilityState={{ checked: todo.completed }}
      >
        <Text style={styles.checkmark}>{todo.completed ? '✓' : ''}</Text>
      </Pressable>

      {editing ? (
        <TextInput
          style={styles.editInput}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSave}
          maxLength={120}
          autoFocus
          returnKeyType="done"
        />
      ) : (
        <Text style={[styles.text, todo.completed && styles.completedText]}>{todo.text}</Text>
      )}

      <View style={styles.actions}>
        {editing ? (
          <>
            <Pressable
              style={styles.actionButton}
              onPress={handleSave}
              disabled={updating}
              accessibilityRole="button"
              accessibilityLabel="Зберегти зміни"
            >
              <Text style={styles.actionText}>✓</Text>
            </Pressable>
            <Pressable
              style={styles.actionButton}
              onPress={handleCancel}
              disabled={updating}
              accessibilityRole="button"
              accessibilityLabel="Скасувати редагування"
            >
              <Text style={styles.actionText}>✕</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable
              style={styles.actionButton}
              onPress={() => setEditing(true)}
              accessibilityRole="button"
              accessibilityLabel={`Редагувати: ${todo.text}`}
            >
              <Text style={styles.actionText}>✏️</Text>
            </Pressable>
            <Pressable
              style={styles.actionButton}
              onPress={() => onDelete(todo.id)}
              accessibilityRole="button"
              accessibilityLabel={`Видалити: ${todo.text}`}
            >
              <Text style={styles.actionText}>🗑️</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 62,
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  completedContainer: {
    backgroundColor: '#EEF2FF',
  },
  checkbox: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#818CF8',
    borderWidth: 2,
    borderRadius: 8,
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  text: {
    flex: 1,
    color: '#1F2937',
    fontSize: 16,
    lineHeight: 22,
  },
  completedText: {
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  editInput: {
    flex: 1,
    height: 40,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    borderColor: '#818CF8',
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  actionText: {
    color: '#4F46E5',
    fontSize: 17,
    fontWeight: '700',
  },
});
