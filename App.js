import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import { requestForegroundPermissionsAsync, LocationObject, getCurrentPositionAsync } from 'expo-location';
import { useState, useEffect, useRef } from 'react';

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);

  async function PermissaoLocalizacao(){
    const {garantia} = await requestForegroundPermissionsAsync();

    if(garantia){
      const localizacaoAtual = await getCurrentPositionAsync();
      await setLocation(localizacaoAtual);

      console.log("sua localização é: "+ localizacaoAtual);
    }
  }

  useEffect(()=>{
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval:1
    },(response)=>{
      console.log("Sua nova localização é: " + response);
      setLocation(response);
      mapRef.current?.animateCamera({
        pitch:70,
        center: response.coords
      })
    })
    PermissaoLocalizacao();
  },[])

  return (
    <View styles={styles.container}>
      {
        location && <MapView ref={mapRef} styles={styles.map} initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}>
          <Marker coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}></Marker>
        </MapView>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map:{
    flex: 1,
    width:"100%"
  }
});