import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, Alert, ActivityIndicator } from "react-native";
import { Image } from "expo-image";

const App = () => {
  const serverIP = "192.168.8.104"; // Replace with your ESP32's IP address
  const [moisture, setMoisture] = useState(null); // State to store soil moisture
  const [pumpState, setPumpState] = useState(null); // State to store pump state
  const [loading, setLoading] = useState(false); // State to manage loading

  // Function to fetch data from ESP32
  const fetchMoistureData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://${serverIP}`); // Fetch from ESP32
      if (response.ok) {
        const data = await response.json();
        setMoisture(data.moisturePercentage);
        setPumpState(data.pumpState ? "ON" : "OFF");
      } else {
        Alert.alert("Error", "Failed to fetch data from ESP32. Response not OK.");
      }
    } catch (error) {
      Alert.alert("Error", `Unable to connect to ESP32. ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to turn pump ON or OFF
  const controlPump = async (command) => {
    setLoading(true);
    try {
      const response = await fetch(`http://${serverIP}/?command=${command}`);
      if (response.ok) {
        const data = await response.json();
        setPumpState(data.pumpState ? "ON" : "OFF");
        Alert.alert("Success", `Pump turned ${command === "turn_on" ? "ON" : "OFF"}`);
      } else {
        Alert.alert("Error", "Failed to control the pump. Response not OK.");
      }
    } catch (error) {
      Alert.alert("Error", `Unable to send command to ESP32. ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const img = require('./assets/12.png');
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Soil Moisture Monitor</Text>
        <Text style={styles.subtitle}>Real-Time Monitoring & Control</Text>
      </View>

      <View style={styles.imgView}>
        <Image source={img} style={styles.img}/>
      </View>

      <View style={styles.content}>
        <Pressable style={styles.button} onPress={fetchMoistureData}>
          <Text style={styles.buttonText}>Get Soil Status</Text>
        </Pressable>

        {loading && <ActivityIndicator size="large" color="#2ECC71" style={styles.loader} />}

        {moisture !== null && (
          <View style={styles.result}>
            <Text style={styles.resultText}>🌱 Moisture: {moisture}%</Text>
            <Text style={styles.resultText}>💧 Pump State: {pumpState}</Text>
          </View>
        )}

        <View style={styles.control}>
          <Pressable style={styles.button} onPress={() => controlPump("turn_on")}>
            <Text style={styles.buttonText}>Water Now</Text>
          </Pressable>
          <Pressable style={styles.button1} onPress={() => controlPump("turn_off")}>
            <Text style={styles.buttonText}>Turn Off Water</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2e2317", // Dark background for greenhouse theme
    paddingHorizontal: 40,
    paddingTop: 120,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    color: "brown", // Soothing green for the greenhouse feel
    // textShadowColor: "rgba(169, 223, 191, 0.6)",
    // textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#CCCCCC", // Light gray for subtler contrast
    marginTop: 5,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#92745B", // Green color for buttons
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 2,
    borderColor: "#92745B", // Dark green border for depth
  },
  button1: {
    backgroundColor: "red", // Green color for buttons
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 2,
    borderColor: "red", // Dark green border for depth
  },
  buttonText: {
    color: "#FFFFFF", // White text for contrast
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  result: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "#333333", // Darker background for result card
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  resultText: {
    fontSize: 18,
    color: "#A9DFBF", // Green text for results
    marginVertical: 5,
  },
  control: {
    marginTop: 20,
  },
  loader: {
    marginVertical: 20,
  },
  img:{
    width:300,
    height:300,
  },
  imgView:{
    justifyContent:"center",
    alignItems:"center",
    paddingVertical:10,
  }
});

export default App;
