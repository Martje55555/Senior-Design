#include <ArduinoJson.h>

#include <ESP8266WiFi.h>
// #include <FirebaseArduino.h>
#include <FirebaseESP8266.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#include <dht.h>
#include <Arduino_JSON.h>


#define dht_apin0 A0 // Analog Pin sensor is connected to
#define dht_apin1 A1 // Analog Pin sensor is connected to

// Set these to run example.
#define FIREBASE_HOST "sdtest-849e7-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "bcvvq4F10J2mjV48FOB05iMZodjffUY9ypHiHAIU"
#define WIFI_SSID "HERNANDEZ WIFI"
#define WIFI_PASSWORD "25000429"

const char *serverName = "http://f4f9438a395c2c.lhrtunnel.link/sensor_1";

dht DHT0, DHT1;

// Define the Firebase Data object
FirebaseData fbdo;

void setup()
{
    Serial.begin(9600);

    // connect to wifi.
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("connecting");
    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.print(".");
        delay(500);
    }
    Serial.println();
    Serial.print("connected: ");
    Serial.println(WiFi.localIP());

    Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}

void loop()
{
    DHT0.read11(dht_apin0); // reads data for first sensor

    // Check WiFi connection status
    if (WiFi.status() == WL_CONNECTED)
    {
        WiFiClient client;
        HTTPClient http;

        http.begin(client, serverName);

        StaticJsonBuffer<500> jsonBuffer; //to create json object

        // Create the root object
        JsonObject &root = jsonBuffer.createObject();

        root["temperature"] = DHT0.temperature; // Put Sensor value
        root["humidity"] = DHT0.humidity;

        http.addHeader("Content-Type", "application/json");

        char json_string[100];
        root.prettyPrintTo(json_string, sizeof(json_string));
        
        int httpResponseCode = http.POST(json_string);

        Serial.print("Response Code: ");
        Serial.println(httpResponseCode);

        // TEST SENSOR OUTPUT
        Serial.print("DHT Temperature VALUE - ");
        Serial.println(DHT0.temperature);

        http.end();
    }
    else
    {
        Serial.println("Not connected");
    }
    
    delay(10000);
}
