import amqp, { Connection, Channel, ChannelModel } from "amqplib";

class RabbitMQConnection {
  connection!: ChannelModel;
  channels: Map<string, Channel> = new Map();
  private connected!: boolean;

  async connect(queue: string) {
    if (this.connected && this.channels.has(queue)) return;
    try {
      this.connection = await amqp.connect(
        `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
      );
      this.connected = true;
      const channel: Channel = await this.connection.createChannel();
      channel.prefetch(1);
      channel.assertQueue(queue, {
        durable: true,
      });
      this.channels.set(queue, channel);
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong while connecting to RabbitMQ.");
    }
  }

  async sendToQueue(queue: string, message: string) {
    try {
      if (!this.channels.has(queue)) {
        await this.connect(queue);
      }
      this.channels.get(queue)?.assertQueue(queue, {
        durable: true,
      });
      this.channels.get(queue)?.sendToQueue(queue, Buffer.from(message), {
        persistent: true,
      });
      console.log("message sent");
    } catch (error) {
      console.error(error);
      throw new Error(
        "Something went wrong while sending the image details to the queue."
      );
    }
  }

  async consume(
    queue: string,
    handleAction: (
      message: Buffer,
      channel: Channel
    ) => Promise<boolean | undefined>
  ) {
    try {
      if (!this.channels.has(queue)) {
        await this.connect(queue);
      }
      await this.channels.get(queue)?.consume(
        queue,
        async (message) => {
          if (!message) {
            console.error("Message not received");
            return;
          }
          const shouldAck = await handleAction(
            message.content,
            this.channels.get(queue)!
          );
          if (shouldAck) {
            this.channels.get(queue)?.ack(message);
            console.log(
              "Acknowledgment successful with delivery tag: ",
              message.fields.deliveryTag
            );
          }
        },
        {
          noAck: false,
        }
      );
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong while receiving messages.");
    }
  }
}

const mqConnection = new RabbitMQConnection();
export default mqConnection;
