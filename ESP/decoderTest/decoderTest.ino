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

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(D0, OUTPUT); //sensor 0
  pinMode(D1, OUTPUT); //
  pinMode(D2, OUTPUT); //MSB
}

void printStorage(float arr[]) {
  for(int ndex = 0; ndex < 8; ndex++) {
    Serial.print(arr[ndex]); 
    Serial.print(" ");
  }
}

void dataToServer(){
  Serial.println("Sending data to Server");
}

void sensorLoop(){
  for(int i = 0; i < 8; i++){
      digitalWrite(D0, LOW);
      digitalWrite(D1, LOW);
      digitalWrite(D2, LOW);
      
      int bitArray[3] = {0, 0, 0};

      hold = i;
      int j = 0;
      while(hold > 0){
          bitArray[j] = hold % 2;
          hold = hold / 2;
          j++;
      }

      if(bitArray[2] == 1) {
        digitalWrite(D0, HIGH);
      }
      else {
        digitalWrite(D0, LOW);
      }
      if(bitArray[1] == 1) {
        digitalWrite(D1, HIGH);
      }
      else {
        digitalWrite(D1, LOW);
      }
      if(bitArray[0] == 1) {
        digitalWrite(D2, HIGH);
      }
      else {
        digitalWrite(D2, LOW);
      }

      delay(2000);
      for(int index = 2; index >= 0; index--) {
        Serial.print(bitArray[index]);
      }
      output_value0 = analogRead(sensor_pinA0);
      output_value0 = map(output_value0,550,0,0,100);
      dataStorage[i] = output_value0;
      Serial.println();
      Serial.println();
      printStorage(dataStorage);
      Serial.println();
      
      delay(20);
  }
  }
void loop() {
  //put your main code here, to run repeatedly:
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
