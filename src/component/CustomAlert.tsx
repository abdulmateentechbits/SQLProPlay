import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
} from 'react-native-reanimated';

export const CustomAlert = ({ visible, onDismiss, alertText }) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Start animation when alert becomes visible
    if (visible) {
        withTiming(opacity.value, {
        duration: 500,
        easing: Easing.ease
      });
    }
  }, [visible, opacity]);

  const animatedStyles = useAnimatedStyle({
    op
  })

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.alertContainer}>
        <Text style={[styles.alertText, { opacity: opacity.value }]}>
          {alertText}
        </Text>
        <TouchableOpacity onPress={onDismiss} style={styles.button}>
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    alertContainer: {
      // Style properties for the alert container
    },
    alertText: {
      // Style properties for the alert text
    },
    button: {
      // Style properties for the button
    },
    buttonText: {
      // Style properties for the button text
    },
  });

