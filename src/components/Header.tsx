import { StyleSheet, Text, View } from 'react-native';

interface HeaderProps {
  totalCount: number;
  completedCount: number;
}

export function Header({ totalCount, completedCount }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.icon}>📝</Text>
        <Text style={styles.title}>Мій список завдань</Text>
      </View>
      <Text style={styles.subtitle}>
        {totalCount > 0
          ? `Виконано ${completedCount} з ${totalCount}`
          : 'Додайте своє перше завдання'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 8,
    marginBottom: 18,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 32,
    marginRight: 10,
  },
  title: {
    color: '#1F2937',
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 15,
    marginTop: 8,
  },
});
