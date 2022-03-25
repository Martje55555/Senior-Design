int espPin16 = 16;
int espPin5 = 5;
int espPin4 = 4;
int espPin0 = 0;

int bitArray[3] = {0, 0, 0};
float dataStorage[8];
int hold;

void dataCollection(){
    for(int i = 0; i < 7; i++){
        digitalWrite16(espPin16, LOW);
        digitalWrite16(espPin5, LOW);
        digitalWrite16(espPin4, LOW);

        hold = i;
        int j = 0;
        while(hold > 0){
            bitArray[j] = hold % 2;
            hold = hold / 2;
            j++;
        }

        if(bitArray[0] == 1) digitalWrite16(espPin16, HIGH);
        if(bitArray[1] == 1) digitalWrite5(espPin5, HIGH);
        if(bitArray[2] == 1) digitalWrite4(espPin4, HIGH);

        digitalStorage[i] = digitalRead(espPin0);
    }

    //dataStorageToJSON();
    //JSONToServer();
}