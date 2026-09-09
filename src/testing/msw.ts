import { setupServer as setupMswServer } from "msw/node";
import type { RequestHandler } from "msw";

export function setupServer(defaultHandlers: RequestHandler[] = []) {
  const server = setupMswServer(...defaultHandlers);

  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  return server;
}
