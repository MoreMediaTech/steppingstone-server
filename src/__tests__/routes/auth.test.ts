import request from "supertest";
import app from "../../app";
import { MockContext, Context } from "../../context";
import { authService } from "../../v1/services/auth.service";

let mockCtx: MockContext;
let ctx: Context;

// beforeEach(() => {
//   mockCtx = createMockContext();
//   ctx = mockCtx as unknown as Context;
// });

describe("Auth Routes", () => {
  it.todo("should create a new user");
});
