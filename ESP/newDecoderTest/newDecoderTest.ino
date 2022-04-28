#include <ArduinoJson.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#include <dht.h>
#include <Arduino_JSON.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

#define WIFI_SSID "Alonso7"
#define WIFI_PASSWORD "rayados10"

String serverName = "http://9933bf7d06a4b7.lhrtunnel.link";

#define D0 16 // A selection
#define D1 5  // B selection
#define D2 4  // C selection
#define D3 0  // D selection
#define D4 2  // DHT11 Input
  
float dataStorage[11]; //Data array
int hold;              //used for binary conversion
int output_value0;     //
int sensor_pinA0 = A0; //Analog input

ESP8266WebServer server(80);

dht DHT0;              //DHT11 struct thing

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  // connect to wifi.
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());

  pinMode(D0, OUTPUT); // LSB
  pinMode(D1, OUTPUT); // 
  pinMode(D2, OUTPUT); // 
  pinMode(D3, OUTPUT); // MSB
  pinMode(D4, INPUT);  // DHT11 Input

  server.on("/sendData", sensorLoop);
  server.begin(); 
}

void printStorage(float arr[]) {
  for (int ndex = 0; ndex < 11; ndex++) {
    Serial.print(arr[ndex]);
    Serial.print(" ");
  }
}

// function to send non-dht via api
void dataToServer() {
  Serial.println("Sending data to Server");
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    String dht_endpoint = serverName + "/other_sensors/add";

    http.begin(client, dht_endpoint);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> doc; // to create json obj
    StaticJsonDocument<200> second_doc; // to create json obj   

    for (int i = 0; i < 11; i++) {
      if (i == 0) {
        doc["sensor_1"] = dataStorage[i];
      }
      else if (i == 1) {
        doc["sensor_2"] = dataStorage[i];
      }
      else if (i == 2) {
        doc["sensor_3"] = dataStorage[i];
      }
      else if (i == 3) {
        doc["sensor_4"] = dataStorage[i];
      }
      else if (i == 4) {
        doc["sensor_5"] = dataStorage[i];
      }
      else if (i == 5) {
        doc["sensor_6"] = dataStorage[i];
      }
      else if (i == 6) {
        doc["sensor_7"] = dataStorage[i];
      }
      else if (i == 7) {
        doc["sensor_8"] = dataStorage[i];
      }
      else if (i == 8) {
        doc["sensor_9"] = dataStorage[i];
      }
      else if (i == 9) {
        second_doc["temperature"] = dataStorage[i];
      }
      else if (i == 10) {
        second_doc["humidity"] = dataStorage[i];
      }
    }
    // result of doc should be this
    /*
    {
      "sensor_1" : value,
      "sensor_2" : value,
      "sensor_3" : value,
      "sensor_4" : value,
      "sensor_5" : value,
      "sensor_6" : value,
      "sensor_7" : value,
      "sensor_8" : value,
      "sensor_9" : value,
      "temperature" : value,
      "humidity" : value
    }
    */

    // char json_string[100];
    // root.prettyPrintTo(json_string, sizeof(json_string));
    String jsonOutput;
    serializeJson(doc, jsonOutput);
    int httpResponseCode = http.POST(String(jsonOutput));
    Serial.print("Response Code: ");
    Serial.println(httpResponseCode);

    http.end();

    // WiFiClient client;
    // HTTPClient http;

    String fc28_endpoint = serverName + "/sensor_1";

    http.begin(client, fc28_endpoint);
    http.addHeader("Content-Type", "application/json");

    String secondJsonOutput;
    serializeJson(second_doc, secondJsonOutput);
    int secondHttpResponseCode = http.POST(String(secondJsonOutput));
    Serial.print("Response Code 2: ");
    Serial.println(secondHttpResponseCode);

    http.end();
    server.send(200, "text/plain", "Successful."); 
  }
  else {
    Serial.println("Not connected");
  }
}

void sensorLoop() {
  for (int i = 0; i < 9; i++) {
    digitalWrite(D0, LOW);
    digitalWrite(D1, LOW);
    digitalWrite(D2, LOW);
    digitalWrite(D3, LOW);

    int bitArray[4] = {0, 0, 0, 0};

    hold = i;
    int j = 3;
    while (hold > 0) {
      bitArray[j] = hold % 2;
      hold = hold / 2;
      j--;
    }

    if (bitArray[3] == 1) {
      digitalWrite(D0, HIGH);
    }
    
    if (bitArray[2] == 1) {
      digitalWrite(D1, HIGH);
    }
    
    if (bitArray[1] == 1) {
      digitalWrite(D2, HIGH);
    }

    if (bitArray[0] == 1) {
      digitalWrite(D3, HIGH);
    }

    for (int index = 3; index >= 0; index--) {
      Serial.print(bitArray[index]);
    }
    
    delay(200);
    output_value0 = analogRead(sensor_pinA0);
    output_value0 = map(output_value0, 550, 0, 0, 100);
    dataStorage[i] = output_value0;
    Serial.println();
    printStorage(dataStorage);
    Serial.println();
    Serial.println();
    delay(1000);
  }

  digitalWrite(D0, HIGH);// Select DHT11
  digitalWrite(D1, LOW);
  digitalWrite(D2, LOW);
  digitalWrite(D3, HIGH);
    
  //**************************************Sensor 10 (DHT11)*************************************************************

  DHT0.read11(D4); //...................................................Reads data from DHT11 sensor.
  Serial.print(DHT0.temperature); //....................................TEST: To see if temperature was grabbed from sensor.
  
  dataStorage[9] = DHT0.temperature; //.................................Stores the temperature value into element 10 in array for DHT11
  Serial.println();
  printStorage(dataStorage); //.........................................Prints the value in element 10 in array for DHT11. ONLY Temperature was stored. (prints all array, too)
  Serial.println();
  Serial.println();
  delay(1000); //.......................................................2 Second DELAY

  //....................................................................Sensor 10 (DHT-11 for humidity read)
  dataStorage[10] = DHT0.humidity; //...................................Stores the humidity value into element 11 in array for DHT11
  Serial.println();
  printStorage(dataStorage); //.........................................Prints the value in element 11 in array for DHT11. ONLY humidity was stored. (prints all array, too
  Serial.println();
  Serial.println();
  delay(1000); //.......................................................2 second DELAY

  digitalWrite(D0, LOW); //Unselect
  digitalWrite(D1, HIGH);
  digitalWrite(D2, LOW);
  digitalWrite(D3, HIGH);

  dataToServer();
}


void loop()
{
  server.handleClient();
  //sensorLoop(); 
  //dataToServer();
  //delay(5000);
}
