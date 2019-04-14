/*
 * This Project is for temperature sensor
 */
package com.mycompany.temperaturesensor;

import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

/**
 * This class represents Temperature sensor We will use this class to generate
 * random temperature, which will be send to a MQTT broker. MQTT broker will
 * receive these temperature values on various topic and will publish to
 * subscriber
 *
 * @author Anshu Anand
 */
public class TemperatureSensor {

    /**
     * This variable holds temperature
     */
    private static int temperature;
    /**
     * This variable holds max possible value for Temperature
     */
    private static final int max = 100;
    /**
     * This variable holds minimum possible value for Temperature
     */
    private static final int min = 0;

    /**
     * This method is main method for this class. This method runs a time loop
     * every 5 seconds, which calls a method to generate the random temperature
     *
     * @param args
     */
    public static void main(String[] args) {

        //create a new java Timer object
        Timer timer = new Timer();

        //schedule the timer object to run for every 5 seconds
        timer.schedule(new TimerTask() {
            //override the default run method
            @Override
            public void run() {
                //call the sendData method which sends the temperature data every 5 seconds
                //We pass output of getTemperature method as argument to sendData method
                sendData(getTemperature());
            }
        }, 0, 5 * 1000);
    }

    /**
     * This method sends temperature data to Broker This method talks with MQTT
     * broker using Paho library
     *
     * @param temp
     */
    public static void sendData(int temp) {
        //extract topic from argument
        String topic = getTopic(temp);
        //create a timesatmp for message
        String timestamp = new Date().toString();
        //create a JSON message object , which will be send to MQTT broker.
        String content = "{\"Temperature\":" + "\"" + temp + "\"" + ",\"Timestamp\":" + "\"" + timestamp + "\"" + "}";

        int qos = 2;
        //set address of the Broker
        String broker = "tcp://localhost:1883";
        //create a client id
        String clientId = "TempSensor";
        //create memory persistence object
        MemoryPersistence persistence = new MemoryPersistence();

        try {
            //create a MQTT client object
            MqttClient sampleClient = new MqttClient(broker, clientId, persistence);
            MqttConnectOptions connOpts = new MqttConnectOptions();
            connOpts.setCleanSession(true);
            System.out.println("Connecting to broker: " + broker);
            //establish connection
            sampleClient.connect(connOpts);
            System.out.println("Connected");
            System.out.println("Publishing message: " + content);
            //set message for BROKER
            MqttMessage message = new MqttMessage(content.getBytes());
            message.setQos(qos);
            //publish the message to MQTT broker using java client
            sampleClient.publish(topic, message);
            System.out.println("Message published");
            //disconnect , till new connection is required
            sampleClient.disconnect();
            System.out.println("Disconnected");
            //System.exit(0);
        } catch (MqttException me) {
            //handle exceptions
            System.out.println("reason " + me.getReasonCode());
            System.out.println("msg " + me.getMessage());
            System.out.println("loc " + me.getLocalizedMessage());
            System.out.println("cause " + me.getCause());
            System.out.println("excep " + me);
            me.printStackTrace();
        }
    }

    /**
     * This method creates topic based on different temperature type
     *
     * @param temp
     * @return
     */
    public static String getTopic(int temp) {
        String topic = "";
        // read different temperature value and create topic with respe ct to that
        if (temp >= 0) {
            if (temp <= 45) {
                topic = "pittsburgh/temperatures/coldTemps";
            } else if (temp > 45 && temp <= 80) {
                topic = "pittsburgh/temperatures/niceTemps";
            } else if (temp > 80) {
                topic = "pittsburgh/temperatures/hotTemps";
            } else {
                topic = "pittsburgh/temperatures/other";
            }
        }
        return topic;
    }

    /**
     * This method returns random temperature
     *
     * @return
     */
    public static int getTemperature() {

        int range = (max - min) + 1;
        //genearte a random value for tempearture.
        int temp = (int) (Math.random() * range) + min;

        return temp;
    }

}
