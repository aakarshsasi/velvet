import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Clipboard,
  Alert,
  Platform,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

// Debug log storage
const debugLogs = [];
const MAX_LOGS = 500;

// Override console methods to capture logs
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

let isCapturing = false;

export const startLogCapture = () => {
  if (isCapturing) return;
  isCapturing = true;

  console.log = (...args) => {
    captureLog('LOG', args);
    originalConsoleLog(...args);
  };

  console.error = (...args) => {
    captureLog('ERROR', args);
    originalConsoleError(...args);
  };

  console.warn = (...args) => {
    captureLog('WARN', args);
    originalConsoleWarn(...args);
  };

  console.log('🎯 Debug log capture started');
};

export const stopLogCapture = () => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  isCapturing = false;
};

const captureLog = (level, args) => {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const message = args
    .map((arg) => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch (e) {
          return String(arg);
        }
      }
      return String(arg);
    })
    .join(' ');

  debugLogs.push({
    timestamp,
    level,
    message,
  });

  // Keep only last MAX_LOGS entries
  if (debugLogs.length > MAX_LOGS) {
    debugLogs.shift();
  }
};

export const getDebugLogs = () => debugLogs;
export const clearDebugLogs = () => {
  debugLogs.length = 0;
};

const DebugConsole = () => {
  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState([]);
  const [tapCount, setTapCount] = useState(0);
  const [filterLevel, setFilterLevel] = useState('ALL'); // ALL, LOG, WARN, ERROR
  const scrollViewRef = useRef(null);
  const tapTimerRef = useRef(null);
  const { user } = useAuth();

  // Check if user is test account
  const isTestAccount = user?.email === 'meow@gmail.com' || __DEV__;

  useEffect(() => {
    if (isTestAccount) {
      startLogCapture();
    }
    return () => {
      if (isTestAccount) {
        stopLogCapture();
      }
    };
  }, [isTestAccount]);

  useEffect(() => {
    if (visible) {
      const interval = setInterval(() => {
        setLogs([...getDebugLogs()]);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [visible]);

  useEffect(() => {
    if (visible && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [logs, visible]);

  const handleScreenTap = () => {
    if (!isTestAccount) return;

    setTapCount((prev) => prev + 1);

    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    tapTimerRef.current = setTimeout(() => {
      if (tapCount >= 2) {
        // Triple tap detected
        setVisible(true);
        setLogs([...getDebugLogs()]);
      }
      setTapCount(0);
    }, 500);
  };

  const handleCopyLogs = () => {
    const filteredLogs = getFilteredLogs();
    const logText = filteredLogs
      .map((log) => `[${log.timestamp}] ${log.level}: ${log.message}`)
      .join('\n');

    Clipboard.setString(logText);
    Alert.alert('✅ Copied', 'Logs copied to clipboard');
  };

  const handleClearLogs = () => {
    clearDebugLogs();
    setLogs([]);
    Alert.alert('✅ Cleared', 'Debug logs cleared');
  };

  const getFilteredLogs = () => {
    if (filterLevel === 'ALL') return logs;
    return logs.filter((log) => log.level === filterLevel);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'ERROR':
        return '#FF6B6B';
      case 'WARN':
        return '#FFD93D';
      case 'LOG':
        return '#6BCF7F';
      default:
        return '#FFFFFF';
    }
  };

  if (!isTestAccount) {
    return (
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={handleScreenTap}
      />
    );
  }

  return (
    <>
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={handleScreenTap}
        pointerEvents="box-none"
      />

      <Modal
        visible={visible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>🐛 Debug Console</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterContainer}>
            {['ALL', 'LOG', 'WARN', 'ERROR'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.filterButton,
                  filterLevel === level && styles.filterButtonActive,
                ]}
                onPress={() => setFilterLevel(level)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filterLevel === level && styles.filterTextActive,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.logContainer}
            contentContainerStyle={styles.logContent}
          >
            {getFilteredLogs().map((log, index) => (
              <View key={index} style={styles.logEntry}>
                <Text style={styles.timestamp}>{log.timestamp}</Text>
                <Text style={[styles.level, { color: getLevelColor(log.level) }]}>
                  {log.level}
                </Text>
                <Text style={styles.message}>{log.message}</Text>
              </View>
            ))}
            {getFilteredLogs().length === 0 && (
              <Text style={styles.emptyText}>No logs yet...</Text>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCopyLogs}>
              <Text style={styles.actionButtonText}>📋 Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleClearLogs}>
              <Text style={styles.actionButtonText}>🗑️ Clear</Text>
            </TouchableOpacity>
            <Text style={styles.logCount}>
              {getFilteredLogs().length} / {logs.length} logs
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 15,
    backgroundColor: '#222222',
  },
  filterButtonActive: {
    backgroundColor: '#DC143C',
  },
  filterText: {
    color: '#999999',
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  logContainer: {
    flex: 1,
  },
  logContent: {
    padding: 10,
  },
  logEntry: {
    flexDirection: 'row',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#111111',
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#DC143C',
  },
  timestamp: {
    color: '#666666',
    fontSize: 10,
    marginRight: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  level: {
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 8,
    width: 50,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  message: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  emptyText: {
    color: '#666666',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    backgroundColor: '#111111',
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#DC143C',
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  logCount: {
    color: '#666666',
    fontSize: 12,
  },
});

export default DebugConsole;

