import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

type AdminHeaderProps = {
  title: string;
};

export default function AdminHeader({
  title,
}: AdminHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 58,
    backgroundColor: '#061B5E',
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginBottom: 18,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});