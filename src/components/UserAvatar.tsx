import React from 'react';
import { View, Text, Image, ViewStyle } from 'react-native';

interface UserAvatarProps {
  name?: string;
  imageUri?: string | null;
  size?: number;
  theme?: any;
}

const getInitials = (name?: string) => {
  if (!name || name.trim() === '') return '?';
  const parts = name.trim().split(/\s+/).filter(p => p.length > 0);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name, 
  imageUri, 
  size = 48,
  theme
}) => {
  const initials = getInitials(name);
  const fontSize = size * 0.4;
  
  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: '#1a1a1a', // Premium dark background
    borderWidth: Math.max(1, size * 0.03),
    borderColor: '#ff6b00', // Orange brand accent
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  if (imageUri) {
    return (
      <View style={containerStyle}>
        <Image 
          source={{ uri: imageUri }} 
          style={{ width: '100%', height: '100%' }} 
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Text style={{
        color: '#ff6b00',
        fontSize,
        fontWeight: 'bold',
        letterSpacing: 1,
      }}>
        {initials}
      </Text>
    </View>
  );
};
