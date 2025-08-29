// tests/health.spec.ts (running mocha with tsx loader)
import request from "supertest";
import { expect } from "chai";
import createApp from "../src/app.js";
import { describe, before, it } from "mocha";

// fake deps that resolve immediately
const fakeGetDb = async () =>
  ({
    command: async () => ({ ok: 1 }),
  } as any);

const fakeMountSwagger = async () => {
  /* no-op */
};

describe("GET /health", () => {
  let app: any;

  before(async () => {
    app = await createApp({ getDb: fakeGetDb, mountSwagger: fakeMountSwagger });
  });

  it("returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ ok: true });
  });
});
