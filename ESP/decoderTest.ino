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

void loop() {
  for(int i = 0; i < 8; i++){
      digitalWrite(D0, LOW);            //Rest outputs to off
      digitalWrite(D1, LOW);
      digitalWrite(D2, LOW);

      int bitArray[3] = {0, 0, 0};      //Initializes and resets bitArray

      hold = i;                         //Converts i to binary and stores in bitArray
      int j = 0;
      while(hold > 0){
          bitArray[j] = hold % 2;
          hold = hold / 2;
          j++;
      }

      if(bitArray[2] == 1) {            //Turns on sensors according to bitArray
        digitalWrite(D0, HIGH);
      }
      if(bitArray[1] == 1) {
        digitalWrite(D1, HIGH);
      }
      if(bitArray[0] == 1) {
        digitalWrite(D2, HIGH);
      }


      for(int index = 2; index >= 0; index--) {//Outputs current on sensor to the serial port
        Serial.print(bitArray[index]);
      }

      output_value0 = analogRead(sensor_pinA0);//Reads from the current on sensor and stores it in dataStorage
      output_value0 = map(output_value0,550,0,0,100);
      dataStorage[i] = output_value0;
      Serial.println();
      Serial.print(dataStorage[i]);
      Serial.println();

      delay(2000);
  }

  //dataStorageToJSON();
  //JSONToServer();
}