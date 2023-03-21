import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Geolib from "geolib";

export default function App() {
  const [location, setLocation] = useState("");
  const [distances, setDistances] = useState("");

  const getDistance = (start, end) => {
    return Geolib.getDistance(start, end);
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let { coords } = await Location.getCurrentPositionAsync({});
    setLocation(coords);

    let distances = atmLocations.map((location) => {
      return {
        name: location?.name,
        distance: getDistance(coords, {
          latitude: location?.latitude,
          longitude: location?.longitude,
        }),
      };
    });

    setDistances(distances);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const atmLocations = [
    { name: "ATM 1", latitude: 37.78925, longitude: -122.4324 },
    { name: "ATM 2", latitude: 37.78893, longitude: -122.4346 },
    { name: "ATM 3", latitude: 37.78727, longitude: -122.4352 },
    // Add more ATM locations as needed
  ];

  console.log(distances);
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: location?.latitude,
        longitude: location?.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Marker
        coordinate={{
          latitude: location?.latitude,
          longitude: location?.longitude,
        }}
        title="Your Location"
        pinColor="blue"
      />
      {atmLocations.map((location) => (
        <React.Fragment key={location?.name}>
          <Marker
            coordinate={{
              latitude: location?.latitude,
              longitude: location?.longitude,
            }}
            title={location.name}
            pinColor="green"
          />
          <MapView.Polyline
            coordinates={[
              {
                latitude: location?.latitude,
                longitude: location?.longitude,
              },
              // {
              //   latitude: distances.find((d) => d.name === location === null ? "" : location?.name)?.distance.latitude,
              //   longitude: distances.find((d) => d.name === location === null ? "" : location?.name)?.distance.longitude,
              // },
            ]}
            strokeColor="red"
            strokeWidth={3}
          />
        </React.Fragment>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

// import React, { useState, useEffect } from "react";
// import { StyleSheet, Text, View } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import * as Location from "expo-location";
// import Geolib from "geolib";

// export default function App() {
//   const [location, setLocation] = useState(null);
//   const [distances, setDistances] = useState(null);

//   const getDistance = (start, end) => {
//     return Geolib.getDistance(start, end);
//   };

//   const getCurrentLocation = async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== "granted") {
//       console.log("Permission to access location was denied");
//       return;
//     }

//     let { coords } = await Location.getCurrentPositionAsync({});
//     setLocation(coords);

//     let distances = atmLocations.map((location) => {
//       return {
//         name: location?.name,
//         distance: getDistance(coords, {
//           latitude: location?.latitude,
//           longitude: location?.longitude,
//         }),
//       };
//     });

//     setDistances(distances);
//   };

//   // const [atms, setAtms] = useState([]);
//   // const [location, setLocation] = useState(null);

//   // const getCurrentLocation = async () => {
//   //   let { status } = await Location.requestForegroundPermissionsAsync();
//   //   if (status !== "granted") {
//   //     console.log("Permission to access location was denied");
//   //     return;
//   //   }

//   //   let { coords } = await Location.getCurrentPositionAsync({});
//   //   setLocation(coords);
//   // };

//   // const getCurrentLocation2 = async () => {
//   //   let { status } = await Location.requestForegroundPermissionsAsync();
//   //   if (status !== "granted") {
//   //     console.log("Permission to access location was denied");
//   //     return;
//   //   }

//   //   let { coords } = await Location.getCurrentPositionAsync({});
//   //   setLocation(coords);

//   //   let address = await Location.reverseGeocodeAsync(coords);
//   //   console.log(address);
//   // };

//   useEffect(() => {

//     getCurrentLocation();
//   }, []);

//   // useEffect(() => {
//   //   fetch("https://api.myjson.com/bins/tl0bp")
//   //     .then((response) => response.json())
//   //     .then((data) => setAtms(data));
//   // }, []);

//   const atmLocations = [
//     { name: "ATM 1", latitude: 37.78925, longitude: -122.4324 },
//     { name: "ATM 2", latitude: 37.78893, longitude: -122.4346 },
//     { name: "ATM 3", latitude: 37.78727, longitude: -122.4352 },
//     // Add more ATM locations as needed
//   ];

//   return (

//     <MapView
//   style={styles.map}
//   initialRegion={{
//     latitude: location?.latitude,
//     longitude: location?.longitude,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   }}
// >
//   <Marker
//     coordinate={{
//       latitude: location?.latitude,
//       longitude: location?.longitude,
//     }}
//     title="Your Location"
//     pinColor="blue"
//   />
//   {atmLocations.map((location) => (
//     <React.Fragment key={location?.name}>
//       <Marker
//         coordinate={{
//           latitude: location?.latitude,
//           longitude: location?.longitude,
//         }}
//         title={location.name}
//         pinColor="green"
//       />
//       <MapView.Polyline
//         coordinates={[
//           {
//             latitude: location?.latitude,
//             longitude: location?.longitude,
//           },
//           {
//             latitude: distances.find((d) => d.name === location?.name)
//               .distance.latitude,
//             longitude: distances.find((d) => d.name === location?.name)
//               .distance.longitude,
//           },
//         ]}
//         strokeColor="red"
//         strokeWidth={3}
//       />
//     </React.Fragment>
//   ))}
// </MapView>

//     // <View style={styles.container}>
//     //   <MapView
//     //     style={styles.map}
//     //     pinColor="red"
//     //     initialRegion={{
//     //       latitude: 37.78825,
//     //       longitude: -122.4324,
//     //       latitudeDelta: 0.0922,
//     //       longitudeDelta: 0.0421,
//     //     }}
//     //   >
//     //     {atmLocations.map((location) => (
//     //       <Marker
//     //         key={location.name}
//     //         coordinate={{
//     //           latitude: location.latitude,
//     //           longitude: location.longitude,
//     //         }}
//     //         title={location.name}
//     //       />
//     //     ))}
//     //     {/* {atms.map((atm) => (
//     //       <Marker
//     //         key={atm.id}
//     //         coordinate={{
//     //           latitude: atm.lat,
//     //           longitude: atm.lng,
//     //         }}
//     //         title={atm.name}
//     //         description={atm.address}
//     //       />
//     //     ))} */}
//     //   </MapView>
//     // </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   map: {
//     width: "100%",
//     height: "100%",
//   },
// });

// // Email: perry123@mailinator.com
// // Password: vm4Jt9GBVcHUc2bc

// // import { StatusBar } from 'expo-status-bar';
// // import { StyleSheet, Text, View } from 'react-native';

// // export default function App() {
// //   return (
// //     <View style={styles.container}>
// //       <Text>Open up App.js to start working on your app!</Text>
// //       <StatusBar style="auto" />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#fff',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// // });
