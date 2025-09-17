import * as React from 'react';
import { View, Text, Button, Image, TextInput, Alert } from 'react-native';
import { api } from './api';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export default function App() {
  const [image, setImage] = React.useState(null);
  const [location, setLocation] = React.useState(null);
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState('Pothole');
  const [phone, setPhone] = React.useState('9876543210');
  const [name, setName] = React.useState('Citizen');
  const [otp, setOtp] = React.useState('');
  const [token, setToken] = React.useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const pos = await Location.getCurrentPositionAsync({});
    setLocation(pos.coords);
  };

  React.useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Auth (OTP)</Text>
      <TextInput placeholder="Phone (IN)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={{ borderWidth: 1, width: 260, padding: 8, marginTop: 6 }} />
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={{ borderWidth: 1, width: 260, padding: 8, marginTop: 6 }} />
      <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
        <Button title="Send OTP" onPress={async () => {
          try {
            await api.register(phone, name);
            Alert.alert('OTP Sent', 'Check logs/SMS provider');
          } catch (e) { Alert.alert('Error', e.message); }
        }} />
        <Button title="Verify" onPress={async () => {
          try {
            const res = await api.verify(phone, otp);
            setToken(res.data.token);
            Alert.alert('Verified', 'You are logged in');
          } catch (e) { Alert.alert('Error', e.message); }
        }} />
      </View>
      <TextInput placeholder="Enter OTP" value={otp} onChangeText={setOtp} keyboardType="number-pad" style={{ borderWidth: 1, width: 260, padding: 8, marginTop: 6 }} />

      <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 20 }}>Report an Issue</Text>
      <Button title="Capture Photo" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 12 }} />}
      <Text style={{ marginTop: 12 }}>
        {location ? `Lat: ${location.latitude}, Lng: ${location.longitude}` : 'Getting location...'}
      </Text>
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={{ borderWidth: 1, width: 240, marginTop: 8, padding: 8 }} />
      <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={{ borderWidth: 1, width: 240, marginTop: 8, padding: 8 }} />
      <Button title="Submit" onPress={async () => {
        try {
          if (!token) { Alert.alert('Login required', 'Verify OTP first'); return; }
          const payload = {
            description: description || 'No description',
            category: category || 'Other',
            location: {
              lat: location?.latitude || 0,
              long: location?.longitude || 0
            },
            // For now, photoUrl is optional; integrate upload later
          };
          const res = await api.createReport(token, payload);
          Alert.alert('Submitted', 'Your report has been submitted');
          setImage(null); setDescription('');
        } catch (e) {
          Alert.alert('Error', e.message || 'Submission failed');
        }
      }} />
    </View>
  );
}


