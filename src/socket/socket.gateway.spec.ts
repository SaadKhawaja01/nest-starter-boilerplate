import { Test, TestingModule } from "@nestjs/testing";

import { SocketGateway } from "./socket.gateway";

describe("SocketGateway", () => {
  let gateway: SocketGateway;
  // let socket: Socket;

  // beforeAll(() => {
  //   const url = process.env.SOCKET_SERVER_URL || "http://localhost:3000";
  //   socket = io(url);
  // });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketGateway],
    }).compile();
    gateway = module.get<SocketGateway>(SocketGateway);
  });

  // afterAll(() => {
  //   socket.close();
  // });

  it("should be defined", () => {
    expect(gateway).toBeDefined();
  });

  // it("should handle websocket connection ", (done) => {
  //   socket.on("connect", () => {
  //     socket.emit("message", "Hello World");
  //   });
  //
  //   socket.on("subscribed", (message) => {
  //     expect(message).toBe("Hello World");
  //     done();
  //   });
  // });
});
