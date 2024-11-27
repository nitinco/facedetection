import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function camera() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [faces, setFaces] = useState([]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'front' ? 'back' : 'front'));
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log(photo); // This will log the captured image data
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  };

  const handleFacesDetected = ({ faces }: { faces: FaceDetector.FaceFeature[] }) => {
    setFaces(faces);
    console.log(faces);
  };

  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef}
        style={styles.camera} 
        facing={facing}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
          runClassifications: FaceDetector.FaceDetectorClassifications.all,
          minDetectionInterval: 100,
          tracking: true,
        }}
      >
        {faces.map((face, index) => (
          <View
            key={index}
            style={{
              position: 'absolute',
              backgroundColor: 'transparent',
              borderColor: 'yellow',
              borderWidth: 2,
              left: face.bounds.origin.x,
              top: face.bounds.origin.y,
              width: face.bounds.size.width,
              height: face.bounds.size.height,
              borderRadius: 5,
            }}
          />
        ))}
      </CameraView>
      <TouchableOpacity style={styles.button} onPress={takePicture}>
      <View style={styles.buttonContainer}>
          
            {/* <Text style={styles.text}>o</Text> */}
          
        </View>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 40,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    marginTop:50,
    height:300,
    width:300,
    borderRadius:200
  },
  buttonContainer: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: 'yellow',
    borderWidth: 3,
    borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
  },
});
