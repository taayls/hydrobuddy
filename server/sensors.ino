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

// DFRobot Libraries
#include "DFRobot_EC.h"
#include "DFRobot_PH.h"
#include <EEPROM.h>

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

// PH Constants
#define PH_PIN A0
DFRobot_PH ph;

// EC Constants
#define EC_PIN A1
DFRobot_EC ec;

// EC Variables
float ec_voltage, ecValue;

// PH Variables
float ph_voltage, phValue;

// DHT Variables
int chk;
float air_humidity;
float air_temp;

// Ultrasonic Variables
long duration;
int distance;

// Global Variables
float temperature;

// Setup OneWire Instance
OneWire oneWire(ONE_WIRE_PIN);
DallasTemperature sensors(&oneWire);

// Initialise DHT
DHT dht(DHTPIN, DHTTYPE);

void setup(void)
{
  Serial.begin(9600);

  sensors.begin();
  dht.begin();
  ph.begin();
  ec.begin();

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop(void)
{
  static unsigned long timepoint = millis();
  if(millis()-timepoint>1000U)
  {
    timepoint = millis();
    air_humidity = dht.readHumidity();
    air_temp = dht.readTemperature();
    sensors.requestTemperatures();

    temperature = sensors.getTempCByIndex(0);

    Serial.print("Humidity: ");
    Serial.println(air_humidity);
    Serial.print("Temperature: ");
    Serial.println(air_temp);
    Serial.print("pH: ");
    ph_voltage = analogRead(PH_PIN)/1024.0*5000;
    phValue = ph.readPH(ph_voltage,temperature);
    Serial.println(phValue, 2);
    Serial.print("EC: ");
    ec_voltage = analogRead(EC_PIN)/1024.0*5000;
    ecValue =  ec.readEC(ec_voltage,temperature);
    Serial.print(ecValue,2);
    Serial.print("Water Temperature: ");
    Serial.println(sensors.getTempCByIndex(0));

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

    ph.calibration(ph_voltage,temperature);
    ec.calibration(ec_voltage,temperature);
  }
}