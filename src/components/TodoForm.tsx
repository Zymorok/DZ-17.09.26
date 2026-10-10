import { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface TodoFormProps {
  onAdd: (text: string) => Promise<void>;
  loading: boolean;
}

export function TodoForm({ onAdd, loading }: TodoFormProps) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const value = text.trim();

    if (!value || submitting || loading) {
      return;
    }

    try {
      setSubmitting(true);
      await onAdd(value);
      setText('');
      Keyboard.dismiss();
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = !text.trim() || submitting || loading;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSubmit}
        placeholder="Що потрібно зробити?"
        placeholderTextColor="#9CA3AF"
        maxLength={120}
        returnKeyType="done"
        editable={!loading && !submitting}
      />
      <Pressable
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel="Додати завдання"
      >
        <Text style={styles.buttonText}>{submitting ? 'Додаємо...' : 'Додати'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginLeft: 10,
  },
  buttonDisabled: {
    backgroundColor: '#A5B4FC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
