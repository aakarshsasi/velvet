import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import useAnalytics from '../hooks/useAnalytics';

const { width } = Dimensions.get('window');

export default function AnalyticsDashboard() {
  const { user, isPremium } = useAuth();
  const analytics = useAnalytics();
  const [analyticsData, setAnalyticsData] = useState({
    totalSessions: 0,
    totalScreenViews: 0,
    totalEvents: 0,
    conversionRate: 0,
    topCategories: [],
    userJourney: [],
    dropOffPoints: [],
    premiumConversions: 0
  });

  useEffect(() => {
    // This would typically fetch from your analytics backend
    // For now, we'll show a placeholder structure
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = () => {
    // In a real implementation, this would fetch from your analytics API
    // For now, we'll show sample data
    setAnalyticsData({
      totalSessions: 1250,
      totalScreenViews: 8750,
      totalEvents: 15600,
      conversionRate: 12.5,
      topCategories: [
        { name: 'Mild Seduction', views: 450, conversion: 8.2 },
        { name: 'Foreplay', views: 380, conversion: 12.1 },
        { name: 'Roleplay', views: 320, conversion: 15.3 },
        { name: 'Sensory Play', views: 280, conversion: 9.8 },
        { name: 'Public Play', views: 250, conversion: 6.4 }
      ],
      userJourney: [
        { step: 'Welcome Screen', users: 1000, dropOff: 0 },
        { step: 'Onboarding Start', users: 850, dropOff: 15 },
        { step: 'Quiz Completion', users: 720, dropOff: 15.3 },
        { step: 'Profile Generated', users: 680, dropOff: 5.6 },
        { step: 'Signup', users: 450, dropOff: 33.8 },
        { step: 'Home Screen', users: 420, dropOff: 6.7 }
      ],
      dropOffPoints: [
        { screen: 'Signup Details', dropOffRate: 25.3, reason: 'Form complexity' },
        { screen: 'Payment Screen', dropOffRate: 18.7, reason: 'Payment method issues' },
        { screen: 'Onboarding Step 3', dropOffRate: 12.4, reason: 'Question sensitivity' }
      ],
      premiumConversions: 125
    });
  };

  const handleRefresh = () => {
    analytics.trackCustomEvent('analytics_dashboard_refresh', {
      user_id: user?.uid,
      is_premium: isPremium
    });
    loadAnalyticsData();
  };

  const handleExportData = () => {
    analytics.trackCustomEvent('analytics_data_export', {
      user_id: user?.uid,
      data_type: 'dashboard_summary'
    });
    Alert.alert('Export', 'Analytics data export feature coming soon!');
  };

  const StatCard = ({ title, value, subtitle, color = '#DC143C' }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const JourneyStep = ({ step, users, dropOff, isLast = false }) => (
    <View style={styles.journeyStep}>
      <View style={styles.stepIndicator}>
        <View style={[styles.stepDot, { backgroundColor: dropOff > 20 ? '#EF4444' : dropOff > 10 ? '#F59E0B' : '#10B981' }]} />
        {!isLast && <View style={styles.stepLine} />}
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepName}>{step}</Text>
        <Text style={styles.stepUsers}>{users.toLocaleString()} users</Text>
        {dropOff > 0 && (
          <Text style={[styles.stepDropOff, { color: dropOff > 20 ? '#EF4444' : dropOff > 10 ? '#F59E0B' : '#6B7280' }]}>
            {dropOff}% drop-off
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1A0000', '#330000']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Analytics Dashboard</Text>
        <Text style={styles.headerSubtitle}>User behavior insights</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleRefresh}>
            <Text style={styles.actionButtonText}>🔄 Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
            <Text style={styles.actionButtonText}>📊 Export</Text>
          </TouchableOpacity>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Sessions"
              value={analyticsData.totalSessions.toLocaleString()}
              subtitle="Last 30 days"
              color="#10B981"
            />
            <StatCard
              title="Screen Views"
              value={analyticsData.totalScreenViews.toLocaleString()}
              subtitle="All screens"
              color="#3B82F6"
            />
            <StatCard
              title="Total Events"
              value={analyticsData.totalEvents.toLocaleString()}
              subtitle="User interactions"
              color="#8B5CF6"
            />
            <StatCard
              title="Conversion Rate"
              value={`${analyticsData.conversionRate}%`}
              subtitle="Onboarding to signup"
              color="#F59E0B"
            />
          </View>
        </View>

        {/* Top Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Categories</Text>
          <View style={styles.categoriesList}>
            {analyticsData.topCategories.map((category, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryViews}>{category.views} views</Text>
                </View>
                <View style={styles.categoryStats}>
                  <Text style={styles.categoryConversion}>{category.conversion}%</Text>
                  <Text style={styles.categoryLabel}>conversion</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* User Journey */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Journey</Text>
          <View style={styles.journeyContainer}>
            {analyticsData.userJourney.map((step, index) => (
              <JourneyStep
                key={index}
                step={step.step}
                users={step.users}
                dropOff={step.dropOff}
                isLast={index === analyticsData.userJourney.length - 1}
              />
            ))}
          </View>
        </View>

        {/* Drop-off Points */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Critical Drop-off Points</Text>
          <View style={styles.dropOffList}>
            {analyticsData.dropOffPoints.map((point, index) => (
              <View key={index} style={styles.dropOffItem}>
                <View style={styles.dropOffHeader}>
                  <Text style={styles.dropOffScreen}>{point.screen}</Text>
                  <Text style={[styles.dropOffRate, { color: point.dropOffRate > 20 ? '#EF4444' : '#F59E0B' }]}>
                    {point.dropOffRate}%
                  </Text>
                </View>
                <Text style={styles.dropOffReason}>{point.reason}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Premium Conversions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium Conversions</Text>
          <View style={styles.premiumStats}>
            <StatCard
              title="Total Conversions"
              value={analyticsData.premiumConversions.toLocaleString()}
              subtitle="Premium upgrades"
              color="#DC143C"
            />
            <StatCard
              title="Conversion Rate"
              value="8.2%"
              subtitle="Free to premium"
              color="#F59E0B"
            />
          </View>
        </View>

        {/* Analytics Events Log */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Events</Text>
          <View style={styles.eventsLog}>
            <Text style={styles.eventItem}>📱 Welcome screen viewed - 1,250 times</Text>
            <Text style={styles.eventItem}>🎯 Onboarding completed - 720 times</Text>
            <Text style={styles.eventItem}>💳 Premium upgrade attempted - 150 times</Text>
            <Text style={styles.eventItem}>✅ Payment successful - 125 times</Text>
            <Text style={styles.eventItem}>🏠 Home screen viewed - 2,100 times</Text>
            <Text style={styles.eventItem}>🎴 Category explored - 3,400 times</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#CD5C5C',
  },
  content: {
    padding: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 12,
  },
  actionButton: {
    backgroundColor: 'rgba(220, 20, 60, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.5)',
  },
  actionButtonText: {
    color: '#DC143C',
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    width: (width - 52) / 2,
    minHeight: 80,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#CD5C5C',
    fontWeight: '600',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  categoriesList: {
    gap: 12,
  },
  categoryItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  categoryViews: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  categoryStats: {
    alignItems: 'flex-end',
  },
  categoryConversion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  categoryLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  journeyContainer: {
    gap: 16,
  },
  journeyStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepLine: {
    width: 2,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 4,
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
  },
  stepName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  stepUsers: {
    fontSize: 14,
    color: '#CD5C5C',
    marginBottom: 2,
  },
  stepDropOff: {
    fontSize: 12,
    fontWeight: '500',
  },
  dropOffList: {
    gap: 12,
  },
  dropOffItem: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  dropOffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dropOffScreen: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dropOffRate: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropOffReason: {
    fontSize: 14,
    color: '#FCA5A5',
  },
  premiumStats: {
    flexDirection: 'row',
    gap: 12,
  },
  eventsLog: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  eventItem: {
    fontSize: 14,
    color: '#CD5C5C',
    paddingVertical: 4,
  },
});
