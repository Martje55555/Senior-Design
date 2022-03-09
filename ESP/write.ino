#include <ESP8266WiFi.h>
// #include <FirebaseArduino.h>
#include <FirebaseESP8266.h>
#include <dht.h>

#define dht_apin0 A0 // Analog Pin sensor is connected to
#define dht_apin1 A1 // Analog Pin sensor is connected to

// Set these to run example.
#define FIREBASE_HOST "sdtest-849e7-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "bcvvq4F10J2mjV48FOB05iMZodjffUY9ypHiHAIU"
#define WIFI_SSID "Alonso7"
#define WIFI_PASSWORD "rayados10"

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

    Serial.print("DHT Temperature VALUE - ");
    Serial.println(DHT0.temperature);

    // FirebaseData temp;
    // if(Firebase.getJSON(temp, "/humidity/")) {
    //     continue;
    // }

    // int counter = 0;
    // for(auto i : temp["sensor_1"]) {
    //     counter += 1;
    // }

    //Serial.print("temperature: ");
    // get value
    // if (Firebase.getJSON(fbdo, "/temperature/1")) {
    //     Serial.println(fbdo.jsonString());
    // }
    // else {
    //     Serial.println(fbdo.errorReason());
    // }

    // Serial.print("humidity: ");
    // // get value
    // if (Firebase.getJSON(fbdo, "/humidity/1")) {
    //     Serial.println(fbdo);
    // }
    // else {
    //     Serial.println(fbdo.errorReason());
    // }

    FirebaseJson json;
    // FirebaseJson json2;

    //     1
    // date	"3/6/22"
    // time	"4:16:40 PM"
    // value	"60.0"

    // json2.set("child_of_002", 123.456);

    json.set(2);
    Firebase.pushJson(fbdo, "/temperature/sensor_1", json);

    json.set("value", DHT0.temperature);

    if (Firebase.pushJSON(fbdo, "/temperature/sensor_1/2"+, json))
    {
        Serial.println(fbdo.dataPath());

        Serial.println(fbdo.pushName());
    }
    else
    {
        Serial.println(fbdo.errorReason());
    }

    json.set("date", "3/9/22");

    if (Firebase.pushJSON(fbdo, "/temperature/sensor_1/2"+, json))
    {
        Serial.println(fbdo.dataPath());

        Serial.println(fbdo.pushName());
    }
    else
    {
        Serial.println(fbdo.errorReason());
    }

    json.set("time", "1324");

    if (Firebase.pushJSON(fbdo, "/temperature/sensor_1/2"+, json))
    {
        Serial.println(fbdo.dataPath());

        Serial.println(fbdo.pushName());
    }
    else
    {
        Serial.println(fbdo.errorReason());
    }

    delay(10000);

}
