import request from "supertest";
import { app } from "../../server";
import { MockContext, Context, createMockContext } from "../../context";
import { authService } from "../../services/auth.service";


let mockCtx: MockContext;
let ctx: Context;


beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

describe("Auth Routes", () => {
 it.todo("should create a new user");
});
