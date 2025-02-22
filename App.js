;import { StyleSheet, Text, View } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import { requestForegroundPermissionsAsync,
watchPositionAsync,
Accuracy,
LocationAccuracy, 
LocationObject, 
getCurrentPositionAsync
} 
from 'expo-location';
import { useState, useEffect, useRef } from 'react';

export default function App() {
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);

  async function PermissaoLocalizacao(){
    try{
      const {status} = await requestForegroundPermissionsAsync();
      if(status === 'granted'){
        const localizacaoAtual = await getCurrentPositionAsync();
        await setLocation(localizacaoAtual);
  
        console.log("sua localização é: "+ JSON.stringify(localizacaoAtual, null, 2));
      }
    }catch(error){
      console.log("Erro ao obter permissão de localização: " + error);
    }
  }

  useEffect(()=>{
    PermissaoLocalizacao();
    let subscription;

    async function watchPosition(){
      try{
        subscription = await watchPositionAsync({
          accuracy: Accuracy.Highest,
          timeInterval: 1000,
          distanceInterval:1
        },(response)=>{
          console.log("Sua nova localização é: " + JSON.stringify(response, null, 2));
          setLocation(response);
          mapRef.current?.animateCamera({
            pitch:70,
            center: response.coords
          })
        });
      }catch(error){
        console.log("Erro ao obter localização: " + error);
      }
    }

    watchPosition();
    return () =>{
      if(subscription){
        subscription.remove();
      }
    }
  },[])

  return (
    <View style={styles.container}>
      {location?(
        <MapView ref={mapRef} style={styles.map} initialRegion={{ 
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}>
          <Marker coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }}/></MapView>
        ):(
          <Text>Carregando...</Text>
      )}
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