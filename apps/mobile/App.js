import * as React from 'react';
import { View, Text, Button, Image, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export default function App() {
  const [image, setImage] = React.useState(null);
  const [location, setLocation] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState('Pothole');

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
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Report an Issue</Text>
      <Button title="Capture Photo" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 12 }} />}
      <Text style={{ marginTop: 12 }}>
        {location ? `Lat: ${location.latitude}, Lng: ${location.longitude}` : 'Getting location...'}
      </Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={{ borderWidth: 1, width: 240, marginTop: 12, padding: 8 }} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={{ borderWidth: 1, width: 240, marginTop: 8, padding: 8 }} />
      <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={{ borderWidth: 1, width: 240, marginTop: 8, padding: 8 }} />
      <Button title="Submit" onPress={async () => {
        try {
          const form = new FormData();
          if (image) {
            form.append('media', { uri: image, name: 'photo.jpg', type: 'image/jpeg' });
          }
          form.append('citizenId', 'demo-user');
          form.append('title', title || 'Untitled');
          form.append('description', description || '');
          form.append('category', category || 'Other');
          form.append('latitude', String(location?.latitude || 0));
          form.append('longitude', String(location?.longitude || 0));
          const resp = await fetch('http://10.0.2.2:4000/reports', { method: 'POST', body: form });
          if (!resp.ok) throw new Error('Failed');
          Alert.alert('Submitted', 'Your report has been submitted');
          setImage(null); setTitle(''); setDescription('');
        } catch (e) {
          Alert.alert('Error', 'Submission failed');
        }
      }} />
    </View>
  );
}


