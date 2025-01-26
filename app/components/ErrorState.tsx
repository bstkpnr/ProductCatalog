import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorStateModalProps {
  visible: boolean;          
  message: string;           
  onRetry?: () => void;     
  onRequestClose?: () => void; 
}

export const ErrorState: React.FC<ErrorStateModalProps> = ({
  visible,
  message,
  onRetry,
  onRequestClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <TouchableOpacity style={styles.backdrop} onPress={onRequestClose}>
        <TouchableOpacity style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <Ionicons name="alert-circle" size={48} color="#F44336" />
          <Text style={styles.message}>{message}</Text>

          {onRetry && (
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <Ionicons name="refresh" size={20} color="#FFF" style={styles.retryIcon} />
              <Text style={styles.retryText}>Tekrar Dene</Text>
            </TouchableOpacity>
          )}

          {onRequestClose && (
            <TouchableOpacity style={styles.closeButton} onPress={onRequestClose}>
              <Text style={styles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryIcon: {
    marginRight: 8,
  },
  retryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#777',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
