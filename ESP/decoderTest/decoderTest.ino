#include <ArduinoJson.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#include <dht.h>
#include <Arduino_JSON.h>
#include <ESP8266WiFi.h>

#define WIFI_SSID "Alonso7"
#define WIFI_PASSWORD "figmaEngineer69"

const char *serverName = "http://0030e32a333f97.lhrtunnel.link/other_sensors/add";

#define D0 16
#define D1 5
#define D2 4
#define D3 0
#define D4 2
#define D5 14
#define D6 12
#define D7 13
#define D8 15

float dataStorage[8];
int hold;
int output_value0;
int sensor_pinA0 = A0;

void setup()
{
  // put your setup code here, to run once:
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

  pinMode(D0, OUTPUT); // sensor 0
  pinMode(D1, OUTPUT); //
  pinMode(D2, OUTPUT); // MSB
  
}

void printStorage(float arr[])
{
  for (int ndex = 0; ndex < 8; ndex++)
  {
    Serial.print(arr[ndex]);
    Serial.print(" ");
  }
}

// function to send non-dht via api
void dataToServer()
{
  Serial.println("Sending data to Server");

  if (WiFi.status() == WL_CONNECTED)
  {
    WiFiClient client;
    HTTPClient http;

    http.begin(client, serverName);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> doc; // to create json obj

    for (int i = 0; i < 8; i++)
    {
      if (i == 0)
      {
        doc["sensor_1"] = dataStorage[i];
      }
      else if (i == 1)
      {
        doc["sensor_2"] = dataStorage[i];
      }
      else if (i == 2)
      {
        doc["sensor_3"] = dataStorage[i];
      }
      else if (i == 3)
      {
        doc["sensor_4"] = dataStorage[i];
      }
      else if (i == 4)
      {
        doc["sensor_5"] = dataStorage[i];
      }
      else if (i == 5)
      {
        doc["sensor_6"] = dataStorage[i];
      }
      else if (i == 6)
      {
        doc["sensor_7"] = dataStorage[i];
      }
      else if (i == 7)
      {
        doc["sensor_8"] = dataStorage[i];
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
      "sensor_8" : value
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
  }
  else
  {
    Serial.println("Not connected");
  }
}

void sensorLoop()
{
  for (int i = 0; i < 8; i++)
  {
    digitalWrite(D0, LOW);
    digitalWrite(D1, LOW);
    digitalWrite(D2, LOW);

    int bitArray[3] = {0, 0, 0};

    hold = i;
    int j = 0;
    while (hold > 0)
    {
      bitArray[j] = hold % 2;
      hold = hold / 2;
      j++;
    }

    if (bitArray[2] == 1)
    {
      digitalWrite(D0, HIGH);
    }
    else
    {
      digitalWrite(D0, LOW);
    }
    if (bitArray[1] == 1)
    {
      digitalWrite(D1, HIGH);
    }
    else
    {
      digitalWrite(D1, LOW);
    }
    if (bitArray[0] == 1)
    {
      digitalWrite(D2, HIGH);
    }
    else
    {
      digitalWrite(D2, LOW);
    }

    for (int index = 2; index >= 0; index--)
    {
      Serial.print(bitArray[index]);
    }
    output_value0 = analogRead(sensor_pinA0);
    output_value0 = map(output_value0, 550, 0, 0, 100);
    dataStorage[i] = output_value0;
    Serial.println();
    printStorage(dataStorage);
    Serial.println();
    Serial.println();
    
    delay(2000);
    delay(20);
  }
}

void loop()
{
  // put your main code here, to run repeatedly:
  digitalWrite(D0, LOW);
  digitalWrite(D1, LOW);
  digitalWrite(D2, LOW);

  sensorLoop();
  dataToServer();
  delay(60000);
  Serial.println();
  Serial.println();
  Serial.println();
  Serial.println();
  Serial.println();
  Serial.println();
  Serial.println();
  Serial.println();
  Serial.println();
  Serial.println();
  Serial.println();
  Serial.println();
}
