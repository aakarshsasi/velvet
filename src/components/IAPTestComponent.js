import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useIAP } from '../contexts/IAPContext';
import MockIAPService from '../services/MockIAPService';

export default function IAPTestComponent() {
  const {
    products,
    isLoading,
    isInitialized,
    purchaseProduct,
    restorePurchases,
    error,
  } = useIAP();

  const [testResults, setTestResults] = useState([]);
  const [simulateErrors, setSimulateErrors] = useState(false);
  const [simulateDelay, setSimulateDelay] = useState(true);

  const addTestResult = (message, type = 'info') => {
    setTestResults((prev) => [
      ...prev,
      {
        id: Date.now(),
        message,
        type,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const testPurchase = async (productId) => {
    try {
      addTestResult(`Attempting to purchase: ${productId}`, 'info');
      const result = await purchaseProduct(productId);
      addTestResult(`Purchase result: ${JSON.stringify(result)}`, 'success');
    } catch (error) {
      addTestResult(`Purchase error: ${error.message}`, 'error');
    }
  };

  const testRestore = async () => {
    try {
      addTestResult('Attempting to restore purchases...', 'info');
      const result = await restorePurchases();
      addTestResult(`Restore result: ${JSON.stringify(result)}`, 'success');
    } catch (error) {
      addTestResult(`Restore error: ${error.message}`, 'error');
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const toggleErrorSimulation = (value) => {
    setSimulateErrors(value);
    if (value) {
      MockIAPService.enableErrorSimulation();
      addTestResult('Error simulation enabled', 'info');
    } else {
      MockIAPService.disableErrorSimulation();
      addTestResult('Error simulation disabled', 'info');
    }
  };

  const toggleDelaySimulation = (value) => {
    setSimulateDelay(value);
    if (value) {
      MockIAPService.enableDelaySimulation();
      addTestResult('Delay simulation enabled', 'info');
    } else {
      MockIAPService.disableDelaySimulation();
      addTestResult('Delay simulation disabled', 'info');
    }
  };

  const clearAllPurchases = () => {
    MockIAPService.clearAllPurchases();
    addTestResult('All purchases cleared', 'info');
  };

  const showDebugInfo = () => {
    const debugInfo = MockIAPService.getDebugInfo();
    Alert.alert(
      'Debug Info',
      `Initialized: ${debugInfo.isInitialized}\n` +
        `Products: ${debugInfo.productsCount}\n` +
        `Purchases: ${debugInfo.purchasesCount}\n` +
        `Listeners: ${debugInfo.listenersCount}\n` +
        `Simulate Errors: ${debugInfo.simulateErrors}\n` +
        `Simulate Delay: ${debugInfo.simulateDelay}`,
      [{ text: 'OK' }]
    );
  };

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>IAP Test Component</Text>
        <Text style={styles.status}>Initializing IAP...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IAP Test Component</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.status}>
          Status: {isInitialized ? '✅ Initialized' : '❌ Not Initialized'}
        </Text>
        <Text style={styles.status}>
          Loading: {isLoading ? '⏳ Yes' : '✅ No'}
        </Text>
        <Text style={styles.status}>Products: {products.length} available</Text>
        {error && <Text style={styles.error}>Error: {error}</Text>}
      </View>

      <View style={styles.productsContainer}>
        <Text style={styles.sectionTitle}>Available Products:</Text>
        {products.map((product) => (
          <View key={product.productId} style={styles.productItem}>
            <Text style={styles.productName}>{product.title}</Text>
            <Text style={styles.productPrice}>{product.price}</Text>
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => testPurchase(product.productId)}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Test Purchase</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.restoreButton}
        onPress={testRestore}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Test Restore Purchases</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearButton} onPress={clearResults}>
        <Text style={styles.buttonText}>Clear Results</Text>
      </TouchableOpacity>

      {/* Mock Service Controls */}
      <View style={styles.mockControlsContainer}>
        <Text style={styles.sectionTitle}>Mock Service Controls:</Text>

        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Simulate Errors:</Text>
          <Switch
            value={simulateErrors}
            onValueChange={toggleErrorSimulation}
            trackColor={{ false: '#767577', true: '#DC143C' }}
            thumbColor={simulateErrors ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Simulate Delay:</Text>
          <Switch
            value={simulateDelay}
            onValueChange={toggleDelaySimulation}
            trackColor={{ false: '#767577', true: '#DC143C' }}
            thumbColor={simulateDelay ? '#fff' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.debugButton} onPress={showDebugInfo}>
          <Text style={styles.buttonText}>Show Debug Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.clearPurchasesButton}
          onPress={clearAllPurchases}
        >
          <Text style={styles.buttonText}>Clear All Purchases</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.sectionTitle}>Test Results:</Text>
        {testResults.map((result) => (
          <View
            key={result.id}
            style={[styles.resultItem, styles[`result${result.type}`]]}
          >
            <Text style={styles.resultTime}>{result.timestamp}</Text>
            <Text style={styles.resultMessage}>{result.message}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC143C',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  status: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
  error: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  productsContainer: {
    marginBottom: 20,
  },
  productItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  productPrice: {
    color: '#DC143C',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  testButton: {
    backgroundColor: '#DC143C',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  restoreButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#6B7280',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
  },
  resultItem: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  resultinfo: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  resultsuccess: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  resulterror: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  resultTime: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  resultMessage: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
  },
  mockControlsContainer: {
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  controlLabel: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  debugButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  clearPurchasesButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
});
