// #
// # Editor     : Tayls
// # Date       : 23/02/2020
// # E-Mail : tayls@protonmail.com

// # Product name: HydroBuddy Sensors
// # Version     : 1.0
// # Description:
// # Sensor data feedback for HydroBuddy system from Arduino over serial.

// DHT Libraries
#include <DHT.h>
#include <Adafruit_Sensor.h>

// 1 Wire Libraries
#include <OneWire.h>
#include <DallasTemperature.h>

// 1 Wire Constants
#define ONE_WIRE_PIN 4

// DHT Constants
#define DHTPIN 7
#define DHTTYPE DHT22

// Ultrasonic Constants
const int trigPin = 9;
const int echoPin = 10;

// EC Constants
byte ECsensorPin = A1;
const byte ECnumReadings = 20;
unsigned int ECAnalogSampleInterval = 25;
unsigned int ECreadings[ECnumReadings];
byte index = 0;
unsigned long ECAnalogValueTotal = 0;
unsigned int ECAnalogAverage = 0, ECaverageVoltage = 0;
unsigned long ECAnalogSampleTime;
float ECcurrent;

// PH Constants
#define SensorPin A0
#define Offset 0.00
#define LED 13
#define samplingInterval 20
#define printInterval 800
#define ArrayLength 40

// DHT Variables
int chk;
float hum;
float temp;
float ec_temp;

// PH Variables
int pHArray[ArrayLength];
int pHArrayIndex = 0;

// Ultrasonic Variables
long duration;
int distance;

// Setup OneWire Instance
OneWire oneWire(ONE_WIRE_PIN);
DallasTemperature sensors(&oneWire);

// Initialise DHT
DHT dht(DHTPIN, DHTTYPE);

void setup(void)
{
  pinMode(LED, OUTPUT);
  Serial.begin(9600);

  sensors.begin();
  dht.begin();

  for (byte thisReading = 0; thisReading < ECnumReadings; thisReading++)
    ECreadings[thisReading] = 0;

  ECAnalogSampleTime = millis();

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop(void)
{
  static unsigned long samplingTime = millis();
  static unsigned long printTime = millis();
  static float pHValue, voltage;

  if (millis() - ECAnalogSampleTime >= ECAnalogSampleInterval)
  {
    ECAnalogSampleTime = millis();
    ECAnalogValueTotal = ECAnalogValueTotal - ECreadings[index];
    ECreadings[index] = analogRead(ECsensorPin);
    ECAnalogValueTotal = ECAnalogValueTotal + ECreadings[index];
    index = index + 1;
    if (index >= ECnumReadings)
      index = 0;
    ECAnalogAverage = ECAnalogValueTotal / ECnumReadings;
  }

  if (millis() - samplingTime > samplingInterval)
  {
    pHArray[pHArrayIndex++] = analogRead(SensorPin);
    if (pHArrayIndex == ArrayLength)pHArrayIndex = 0;
    voltage = averagearray(pHArray, ArrayLength) * 5.0 / 1024;
    pHValue = 3.5 * voltage + Offset;
    samplingTime = millis();
  }

  if (millis() - printTime > printInterval)
  {
    // Get Temp/Humidty to output below
    hum = dht.readHumidity();
    temp = dht.readTemperature();


    Serial.print("Humidity: ");
    Serial.println(hum);
    Serial.print("Temperature: ");
    Serial.println(temp);
    Serial.print("Voltage: ");
    Serial.println(voltage, 2);
    Serial.print("pH: ");
    Serial.println(pHValue, 2);

    sensors.requestTemperatures();
    ec_temp = sensors.getTempCByIndex(0);

    Serial.print("EC:");
    float TempCoefficient = 1.0 + 0.0185 * (ec_temp - 25.0);
    float CoefficientVoltage = (float)ECaverageVoltage / TempCoefficient;
    if (CoefficientVoltage < 150)Serial.println("Sensor not in solution!");
    else if (CoefficientVoltage > 3300)Serial.println("Solution out of range!");
      else
      {
        if (CoefficientVoltage <= 448)ECcurrent = 6.84 * CoefficientVoltage - 64.32;
          else if (CoefficientVoltage <= 1457)ECcurrent = 6.98 * CoefficientVoltage - 127;
          else ECcurrent = 5.3 * CoefficientVoltage + 2278;
          ECcurrent /= 1000;
          Serial.print(ECcurrent, 2);
        }

    Serial.print("Temperature Bucket 1: ");
    Serial.println(sensors.getTempCByIndex(0));
    Serial.print("Temperature Bucket 2: ");
    Serial.println(sensors.getTempCByIndex(1));
    Serial.print("Temperature Bucket 3: ");
    Serial.println(sensors.getTempCByIndex(2));
    Serial.print("Temperature Bucket 4: ");
    Serial.println(sensors.getTempCByIndex(3));
    Serial.print("Temperature Bucket 5: ");
    Serial.println(sensors.getTempCByIndex(4));

    // Clear trigPin
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    // Set trigPin HIGH for 10ms
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    // Read echoPin, returns sound wave travel time in ms
    duration = pulseIn(echoPin, HIGH);
    // Calculate distance from water in cm
    distance = duration * 0.034 / 2;

    Serial.print("Distance: ");
    Serial.println(distance);

    digitalWrite(LED, digitalRead(LED) ^ 1);
    printTime = millis();
  }
}

double averagearray(int* arr, int number) {
  int i;
  int max, min;
  double avg;
  long amount = 0;
  if (number <= 0) {
    Serial.println("Error with number for the array!/n");
    return 0;
  }
  if (number < 5) {
    for (i = 0; i < number; i++) {
      amount += arr[i];
    }
    avg = amount / number;
    return avg;
  } else {
    if (arr[0] < arr[1]) {
      min = arr[0]; max = arr[1];
    }
    else {
      min = arr[1]; max = arr[0];
    }
    for (i = 2; i < number; i++) {
      if (arr[i] < min) {
        amount += min;
        min = arr[i];
      } else {
        if (arr[i] > max) {
          amount += max;
          max = arr[i];
        } else {
          amount += arr[i];
        }
      }
    }
    avg = (double)amount / (number - 2);
  }
  return avg;
}