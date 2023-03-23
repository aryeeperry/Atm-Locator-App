import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getATMLocations = () => {
    // Replace with your own data of ATM locations
    const ATMs = [
      { id: 1, latitude: 37.785834, longitude: -122.406417, title: "ATM 1" },
      { id: 2, latitude: 37.780656, longitude: -122.390272, title: "ATM 2" },
      { id: 3, latitude: 37.775502, longitude: -122.415213, title: "ATM 3" },
      { id: 4, latitude: 37.788917, longitude: -122.411936, title: "ATM 4" },
    ];

    setMarkers(ATMs);
    setIsLoading(false);
  };

  const getDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180); // deg2rad below
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      0.5 -
      Math.cos((lat2 * Math.PI) / 180) / 2 +
      (Math.cos((lat1 * Math.PI) / 180) * (1 - Math.cos(dLat))) / 2 +
      (Math.cos((lat2 * Math.PI) / 180) * (1 - Math.cos(dLon))) / 2;

    return R * 2 * Math.asin(Math.sqrt(a));
  }, []);

  const getRouteCoordinates = useCallback(async (destination) => {
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({});
    const origin = { latitude, longitude };

    const {
      coords: { latitude: destLat, longitude: destLng },
    } = destination;
    const destinationCoords = { latitude: destLat, longitude: destLng };

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=walking&key=YOUR_API_KEY`
    );

    const data = await response.json();

    const points = data.routes[0].overview_polyline.points;
    const decodedPoints = decodePolyline(points);

    setRouteCoordinates([...decodedPoints, destinationCoords, origin]);
  }, []);

  const decodePolyline = (polyline) => {
    const points = [];

    for (let i = 0; i < polyline.length; i += 2) {
      const latitude = (polyline.charCodeAt(i) - 63) / 1e5;
      const longitude = (polyline.charCodeAt(i + 1) - 63) / 1e5;
      points.push({
        latitude: points[points.length - 1].latitude + latitude,
        longitude: points[points.length - 1].longitude + longitude,
      });
    }

    return points;
  };

  const handleMarkerPress = useCallback(
    (marker) => {
      setSelectedMarker(marker);
      getRouteCoordinates(marker);
    },
    [getRouteCoordinates]
  );

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
      } else {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        setRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    };

    requestLocationPermission();
    getATMLocations();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <SafeAreaView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="green" />
        </SafeAreaView>
      ) : (
        <>
          {location && (
            <MapView style={styles.map} region={region}>
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="You are here"
              />
              {markers.map((marker) => (
                <Marker
                  key={marker.id}
                  coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                  }}
                  title={marker.title}
                  onPress={() => handleMarkerPress(marker)}
                  pinColor={
                    selectedMarker && selectedMarker.id === marker.id
                      ? "red"
                      : "blue"
                  }
                />
              ))}
              {routeCoordinates && (
                <Polyline
                  coordinates={routeCoordinates}
                  strokeWidth={2}
                  strokeColor="red"
                />
              )}
            </MapView>
          )}
          {selectedMarker && (
            <View style={styles.bottomSheet}>
              <Text style={styles.title}>{selectedMarker.title}</Text>
              <Text>{`Distance: ${getDistance(
                location.coords.latitude,
                location.coords.longitude,
                selectedMarker.latitude,
                selectedMarker.longitude
              ).toFixed(2)} km`}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
});

// import React, { useState, useEffect } from "react";
// import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
// import MapView, { Marker, Polyline } from "react-native-maps";
// import * as Location from "expo-location";

// const App = () => {
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);
//   const [atmLocations, setAtmLocations] = useState([]);
//   const [selectedAtm, setSelectedAtm] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [routeCoordinates, setRouteCoordinates] = useState([]);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         setErrorMsg("Permission to access location was denied");
//         return;
//       }

//       let currentLocation = await Location.getCurrentPositionAsync({});
//       setLocation(currentLocation.coords);

//       const atmLocations = [
//         {
//           name: "Bank of America",
//           location: { latitude: 37.78925, longitude: -122.4324 },
//         },
//         {
//           name: "Chase Bank",
//           location: { latitude: 37.78895, longitude: -122.4347 },
//         },
//         {
//           name: "Wells Fargo",
//           location: { latitude: 37.7921, longitude: -122.4325 },
//         },
//       ];
//       setAtmLocations(atmLocations);
//       setLoading(false);
//     })();
//   }, []);

//   const handleMarkerPress = (location) => {
//     setSelectedAtm(location);
//     setRouteCoordinates([
//       {
//         latitude: location.location.latitude,
//         longitude: location.location.longitude,
//       },
//       {
//         latitude: location.location.latitude + 0.002,
//         longitude: location.location.longitude + 0.002,
//       },
//     ]);
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         region={
//           location
//             ? {
//                 latitude: location.latitude,
//                 longitude: location.longitude,
//                 latitudeDelta: 0.0922,
//                 longitudeDelta: 0.0421,
//               }
//             : null
//         }
//       >
//         {location && (
//           <Marker
//             coordinate={{
//               latitude: location.latitude,
//               longitude: location.longitude,
//             }}
//           />
//         )}
//         {atmLocations.map((location, index) => (
//           <Marker
//             key={index}
//             coordinate={location.location}
//             title={location.name}
//             onPress={() => handleMarkerPress(location)}
//           />
//         ))}
//         {routeCoordinates.length > 0 && (
//           <Polyline
//             coordinates={routeCoordinates}
//             strokeWidth={2}
//             strokeColor="red"
//           />
//         )}
//       </MapView>
//       {selectedAtm && (
//         <View style={styles.bottomSheet}>
//           <Text style={styles.bottomSheetTitle}>{selectedAtm.name}</Text>
//           {location && (
//             <Text style={styles.bottomSheetSubtitle}>
//               Distance to ATM:{" "}
//               {calculateDistance(
//                 location.latitude,
//                 location.longitude,
//                 selectedAtm.location.latitude,
//                 selectedAtm.location.longitude
//               ).toFixed(2)}{" "}
//               km
//             </Text>
//           )}
//         </View>
//       )}
//     </View>
//   );
// };

// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371;
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(toRad(lat1)) *
//       Math.cos(toRad(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const d = R * c;
//   return d;
// };

// const toRad = (value) => {
//   return (value * Math.PI) / 180;
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   map: {
//     flex: 1,
//     width: "100%",
//   },
//   bottomSheet: {
//     backgroundColor: "#fff",
//     padding: 16,
//     width: "100%",
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 100,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     borderWidth: 1,
//     borderColor: "#d3d3d3",
//   },
//   bottomSheetTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
//   bottomSheetSubtitle: {
//     fontSize: 16,
//   },
//   loadingContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

// export default App;
