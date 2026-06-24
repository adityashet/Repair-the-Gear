import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

const MOCK_HISTORY = [
  {
    id: '1',
    date: '12 Oct 2023, 14:30',
    type: 'Mechanic',
    provider: 'Rahul Kumar',
    cost: '₹1,500',
    status: 'Completed',
  },
  {
    id: '2',
    date: '05 Sep 2023, 09:15',
    type: 'Tow',
    provider: 'City Towing Services',
    cost: '₹2,200',
    status: 'Completed',
  },
  {
    id: '3',
    date: '20 Aug 2023, 18:45',
    type: 'Mechanic',
    provider: 'Amit Sharma',
    cost: '₹800',
    status: 'Completed',
  },
];

export default function HistoryScreen() {
  const renderItem = ({ item }: { item: typeof MOCK_HISTORY[0] }) => (
    <View style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <View style={styles.typeContainer}>
          <Ionicons 
            name={item.type === 'Mechanic' ? 'build' : 'car'} 
            size={20} 
            color={item.type === 'Mechanic' ? '#1976D2' : '#F57C00'} 
          />
          <Text style={styles.typeText}>{item.type} Service</Text>
        </View>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.providerText}>{item.provider}</Text>
        <Text style={styles.costText}>{item.cost}</Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.receiptText}>View Receipt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service History</Text>
      <FlatList
        data={MOCK_HISTORY}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 60, // For safe area roughly
  },
  title: {
    ...theme.typography.title,
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  listContent: {
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.xxl,
  },
  historyCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    ...theme.typography.body,
    fontWeight: '600',
    marginLeft: 8,
  },
  dateText: {
    ...theme.typography.bodySecondary,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  providerText: {
    ...theme.typography.body,
  },
  costText: {
    ...theme.typography.header,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.m,
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: theme.colors.success,
    fontSize: 12,
    fontWeight: '600',
  },
  receiptText: {
    color: theme.colors.secondary,
    fontWeight: '600',
  },
});
