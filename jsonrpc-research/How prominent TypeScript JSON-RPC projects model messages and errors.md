All research is complete and the key claims are verified against source. Here is the report.

---

# How prominent TypeScript JSON-RPC projects model messages and errors

Every project below was read from source at HEAD. I note where I could not verify a claim.

---

## 1. `vscode-jsonrpc` (microsoft/vscode-languageserver-node)

This is the reference answer to your exact question. It does precisely the split you describe, and it names the wire type explicitly.

**Message modeling — plain `interface`s, no classes.**
`jsonrpc/src/common/messages.ts:11-33, 138-157, 385-397`:

```ts
export interface Message {
	jsonrpc: string;
}
export interface RequestMessage extends Message {
	id: number | string | null;
	method: string;
	params?: any[] | object;
}
export interface ResponseMessage extends Message {
	id: number | string | null;
	result?: string | number | boolean | object | any[] | null;
	error?: ResponseErrorLiteral<any>;
}
export interface NotificationMessage extends Message {
	method: string;
	params?: any[] | object;
}
```

Note `ResponseMessage` has both `result?` and `error?` optional, so it is **not** a discriminated union. Exclusivity is a prose comment only.

**Discrimination on receive — namespace guards, hand-rolled duck-typing.**
`messages.ts:501-527` — a `namespace Message` merged onto the `interface Message`:

```ts
export namespace Message {
	export function isRequest(message: Message | undefined): message is RequestMessage {
		const candidate = <RequestMessage>message;
		return candidate && is.string(candidate.method) && (is.string(candidate.id) || is.number(candidate.id));
	}
	export function isNotification(message: Message | undefined): message is NotificationMessage {
		const candidate = <NotificationMessage>message;
		return candidate && is.string(candidate.method) && (<any>message).id === void 0;
	}
	export function isResponse(message: Message | undefined): message is ResponseMessage {
		const candidate = <ResponseMessage>message;
		return candidate && (candidate.result !== void 0 || !!candidate.error) && (is.string(candidate.id) || is.number(candidate.id) || candidate.id === null);
	}
}
```

These are real `x is T` predicates. They are consumed in `jsonrpc/src/common/connection.ts:701-715` and `762-766`:

```ts
if (Message.isRequest(message)) {
	queue.set(createRequestQueueKey(message.id), message);
} else if (Message.isResponse(message)) {
	...
```

**Error modeling — a class plus a separately named wire interface. This is the key evidence.**
`messages.ts:96-140`:

```ts
export interface ResponseErrorLiteral<D = void> {
	code: number;
	message: string;
	data?: D;
}

export class ResponseError<D = void> extends Error {
	public readonly code: number;
	public readonly data: D | undefined;

	constructor(code: number, message: string, data?: D) {
		super(message);
		this.code = is.number(code) ? code : ErrorCodes.UnknownErrorCode;
		this.data = data;
		Object.setPrototypeOf(this, ResponseError.prototype);
	}

	public toJson(): ResponseErrorLiteral<D> {
		const result: ResponseErrorLiteral<D> = { code: this.code, message: this.message };
		if (this.data !== undefined) { result.data = this.data; }
		return result;
	}
}
```

So: the class is `ResponseError`, the wire shape is `ResponseErrorLiteral`, and the conversion method is `toJson()`. The class does **not** declare `implements ResponseErrorLiteral<D>`; the relationship is structural only.

Naming note worth having: the LSP specification itself calls the wire shape `ResponseError` (an interface) — `microsoft/language-server-protocol` gh-pages `_specifications/lsp/3.17/specification.md:200-216` declares `interface ResponseError { code: integer; message: string; data?: LSPAny; }`, and `interface ResponseMessage` at `:177-192` has `error?: ResponseError`. The TS library therefore **renamed the spec's wire type to `…Literal`** so the good name could be the class.

Second naming note: `ResponseErrorLiteral` is **not** re-exported from the public barrel. `jsonrpc/src/common/api.ts:8-11, 38-41` exports `Message, RequestMessage, ResponseMessage, NotificationMessage, ResponseError, ErrorCodes` — no `ResponseErrorLiteral`. It reaches consumers only as the type of `ResponseMessage.error`.

**Asymmetry handling — it rehydrates the class on receive.**
`connection.ts:920-926`:

```ts
if (responseMessage.error) {
	const error = responseMessage.error;
	responsePromise.reject(new ResponseError(error.code, error.message, error.data));
} else if (responseMessage.result !== undefined) {
	responsePromise.resolve(responseMessage.result);
```

Send side, `connection.ts:818-837`:

```ts
if (resultOrError instanceof ResponseError) {
	message.error = (<ResponseError<any>>resultOrError).toJson();
} else {
	message.result = resultOrError === undefined ? null : resultOrError;
}
```

The rehydration is load-bearing, not cosmetic. `vscode-languageclient` does `instanceof` on a *received* error: `client/src/common/client.ts:1553` `else if (error instanceof ResponseError && error.data && error.data.retry)`, and `:2300` `if (error instanceof ResponseError) { ... error.code === ErrorCodes.PendingResponseRejected ... }`.

One limit: the rehydration always builds the **base** `ResponseError`. Subclass identity does not survive a round trip.

**Validation — none.** `jsonrpc/src/node/ril.ts:143-145` is a raw `JSON.parse(...)` whose result is handed to the `DataCallback(data: Message)`. No schema. The namespace guards are the only checks.

I found **no source comment** anywhere in `messages.ts` that explains the class-versus-literal split.

---

## 2. `json-rpc-2.0` (shogowada/json-rpc-2.0)

Same shape as vscode-jsonrpc, with better envelope types and a different conversion name.

**Message modeling — interfaces, and a real discriminated union.** `src/models.ts:9-30`:

```ts
export interface JSONRPCRequest {
  jsonrpc: JSONRPC;   // JSONRPC = "2.0" literal type
  method: string;
  params?: JSONRPCParams;
  id?: JSONRPCID;
}

export type JSONRPCResponse = JSONRPCSuccessResponse | JSONRPCErrorResponse;

export interface JSONRPCSuccessResponse {
  jsonrpc: JSONRPC;
  id: JSONRPCID;
  result: any;
  error?: undefined;
}
export interface JSONRPCErrorResponse {
  jsonrpc: JSONRPC;
  id: JSONRPCID;
  result?: undefined;
  error: JSONRPCError;
}
```

The `result?: undefined` / `error?: undefined` members are the trick that makes the union narrowable. There is no notification type — a notification is a request without `id`.

**Discrimination — exported predicate functions.** `src/models.ts:32-57`:

```ts
export const isJSONRPCRequest = (payload: any): payload is JSONRPCRequest => {
  return (
    payload.jsonrpc === JSONRPC &&
    payload.method !== undefined &&
    payload.result === undefined &&
    payload.error === undefined
  );
};
```

Used at `src/server.ts:190`.

**Error modeling — class plus wire interface, and here the class declares `implements`.** `src/models.ts:58-99`:

```ts
export interface JSONRPCError {
  code: number;
  message: string;
  data?: any;
}

export class JSONRPCErrorException extends Error implements JSONRPCError {
  public code: number;
  public data?: any;

  constructor(message: string, code: number, data?: any) {
    super(message);
    // Manually set the prototype to fix TypeScript issue:
    // https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, JSONRPCErrorException.prototype);
    this.code = code;
    this.data = data;
  }

  toObject(): JSONRPCError {
    return createJSONRPCError(this.code, this.message, this.data);
  }
}
```

Wire type gets the good name `JSONRPCError`; the class is `JSONRPCErrorException`. Conversion method is `toObject()`. The `implements JSONRPCError` clause makes the class formally satisfy the wire shape.

**Asymmetry handling — rehydrate on receive, `instanceof` on send.**
`src/client.ts:147-153`:

```ts
return Promise.reject(
  new JSONRPCErrorException(
    response.error.message,
    response.error.code,
    response.error.data
  )
);
```

`src/server.ts:318-321`:

```ts
if (error instanceof JSONRPCErrorException) {
  code = error.code;
  data = error.data;
}
```

The `toObject()` method exists but the default server mapper does not call it — it reads the fields and calls `createJSONRPCError`.

**Validation** — hand-rolled predicates only.

---

## 3. MCP TypeScript SDK (modelcontextprotocol/typescript-sdk)

This project confronts your question head-on and **documents its answer**. Note the repo is now a monorepo; the paths below are on `main`. The last flat-layout release I checked was 1.30.0, which still named the class `McpError`.

**Message modeling — Zod-schema-derived types.**
`packages/core/src/schemas.ts:136-196`:

```ts
export const JSONRPCRequestSchema = z
    .object({ jsonrpc: z.literal(JSONRPC_VERSION), id: RequestIdSchema, ...RequestSchema.shape })
    .strict();
export const JSONRPCErrorResponseSchema = z
    .object({
        jsonrpc: z.literal(JSONRPC_VERSION),
        id: RequestIdSchema.optional(),
        error: z.object({ code: z.number().int(), message: z.string(), data: z.unknown().optional() })
    })
    .strict();
export const JSONRPCMessageSchema = z.union([
    JSONRPCRequestSchema, JSONRPCNotificationSchema, JSONRPCResultResponseSchema, JSONRPCErrorResponseSchema
]);
```

`packages/core-internal/src/types/types.ts:229-236`:

```ts
export type JSONRPCRequest = Infer<typeof JSONRPCRequestSchema>;
export type JSONRPCErrorResponse = Infer<typeof JSONRPCErrorResponseSchema>;
export type JSONRPCResponse = JSONRPCResultResponse | JSONRPCErrorResponse;
export type JSONRPCMessage = JSONRPCRequest | JSONRPCNotification | JSONRPCResultResponse | JSONRPCErrorResponse;
```

There is also a **second, hand-free copy of the envelope as plain interfaces**: `spec.types.<revision>.ts`, vendored verbatim from the spec's normative `schema.ts`. Its README (`packages/core-internal/src/types/README.md`) says they are "reference-only test oracles… not exported from any barrel and must never be imported by runtime code." In that file the wire error shape is `export interface Error { code: number; message: string; data?: unknown; }` — the spec shadows the global `Error` name.

**Discrimination — schema `safeParse` wrapped as predicates.**
`packages/core-internal/src/types/guards.ts:41-73`:

```ts
export function parseJSONRPCMessage(value: unknown): JSONRPCMessage {
    return JSONRPCMessageSchema.parse(value);
}
export const isJSONRPCRequest = (value: unknown): value is JSONRPCRequest => JSONRPCRequestSchema.safeParse(value).success;
export const isJSONRPCErrorResponse = (value: unknown): value is JSONRPCErrorResponse =>
    JSONRPCErrorResponseSchema.safeParse(value).success;
```

Dispatch at `packages/core-internal/src/shared/protocol.ts:803-813`:

```ts
if (isJSONRPCResultResponse(message) || isJSONRPCErrorResponse(message)) {
    this._onresponse(message);
} else if (isJSONRPCRequest(message)) {
    this._onrequest(message, extra);
} else if (isJSONRPCNotification(message)) {
    this._onnotification(message, extra);
} else {
    this._onerror(new Error(`Unknown message type: ${JSON.stringify(message)}`));
}
```

**Error modeling — two class hierarchies, split by whether the error crosses the wire.**
`packages/core-internal/src/types/errors.ts:11-56`:

```ts
/**
 * Protocol errors are JSON-RPC errors that cross the wire as error responses.
 * ...
 * `instanceof` on this class (and its subclasses) is brand-matched, so it works
 * across separately bundled copies of the SDK ...
 */
export class ProtocolError extends Error {
    static { Object.defineProperty(this, 'mcpBrand', { value: 'mcp.ProtocolError' }); }
    static override [Symbol.hasInstance](value: unknown): boolean { return brandedHasInstance(this, value); }
    static isInstance<T ...>(this: T, value: unknown): value is InstanceType<T> { ... }
    constructor(public readonly code: number, message: string, public readonly data?: unknown) { ... }
```

`packages/core-internal/src/errors/sdkErrors.ts:102-120`:

```ts
/**
 * SDK errors are local errors that never cross the wire.
 * They are distinct from {@linkcode ProtocolError} which represents JSON-RPC protocol errors
 * that are serialized and sent as error responses.
 */
export class SdkError extends Error {
```

There is **no separately named wire type for the error** and **no `toJson()`**. The wire object is built inline in `protocol.ts:1143-1152`, duck-typed off the thrown value:

```ts
const thrownCode = Number.isSafeInteger(error['code']) ? (error['code'] as number) : ProtocolErrorCode.InternalError;
const errorResponse: JSONRPCErrorResponse = {
    jsonrpc: '2.0', id: request.id,
    error: { code: codec.encodeErrorCode(thrownCode), message: error.message ?? 'Internal error',
             ...(error['data'] !== undefined && { data: error['data'] }) }
};
```

**Asymmetry handling — a rehydrate factory that restores the *right subclass*.**
`protocol.ts:1212-1217`:

```ts
if (isJSONRPCResultResponse(response)) {
    handler(response);
} else {
    const error = ProtocolError.fromError(response.error.code, response.error.message, response.error.data);
    handler(error);
}
```

`types/errors.ts:57-107` — `fromError` inspects `code` and the `data` shape and returns `UrlElicitationRequiredError`, `UnsupportedProtocolVersionError`, `ResourceNotFoundError`, `MissingRequiredClientCapabilityError`, or a base `ProtocolError`. This is strictly stronger than vscode-jsonrpc, which only restores the base class.

**And this is the one project that solves the `instanceof` identity problem itself.**
`packages/core-internal/src/errors/crossBundleBrand.ts:1-53`:

```
 * Cross-bundle `instanceof` support for the SDK error classes.
 *
 * `@modelcontextprotocol/client` and `@modelcontextprotocol/server` each bundle their
 * own copy of `core-internal`, so an error constructed by one package fails a
 * prototype-identity `instanceof` against the same class re-exported by the other —
 * exactly the check a dual-role process (gateway, host, in-process test) writes.
 *
 * Instead of prototype identity, branded classes stamp every instance with the brand
 * strings of its class chain under a registry symbol (`Symbol.for`, shared across
 * bundles and realms), and resolve `instanceof` via `Symbol.hasInstance` against the
 * brand set. ...
 * - Brands assert **identity, not shape**: brand strings are version-less ...
 * - A consumer re-bundling the SDK with property mangling (`mangle.props`) would
 *   break the brand statics; default esbuild/webpack/terser settings do not.
```

It cites prior art: Node's `stream.Writable`, undici's error hierarchy, gaxios, AWS SDK v3's `ServiceException`, and Zod v4.

**The documented rule** is in `docs/servers/errors.md`:

> Match these by `code` and `data` shape when peers may run pre-brand SDK copies or hand you plain wire shapes; on brand-aware releases `instanceof` also matches across separately bundled copies of the SDK. The same check is available as an explicit static guard — `ProtocolError.isInstance(err)`, `ResourceNotFoundError.isInstance(err)` — which narrows in TypeScript and reads the same brand.

**Validation — Zod, on every message.** This is the strictest of any project surveyed. `.strict()` on each envelope schema rejects unknown top-level keys.

---

## 4. viem (wevm/viem)

Your recollection is correct: viem has a real `RpcError` class hierarchy.

**Message modeling — `type` aliases, exclusive union.** `src/types/rpc.ts:108-145`:

```ts
type SuccessResult<result> = { method?: undefined; result: result; error?: undefined }
type ErrorResult<error>    = { method?: undefined; result?: undefined; error: error }
type Subscription<result, error> = { method: 'eth_subscription'; error?: undefined; result?: undefined; params: ... }

export type RpcRequest = { jsonrpc?: '2.0' | undefined; method: string; params?: any | undefined; id?: number | null | undefined }
export type RpcResponse<result = any, error = any> = { jsonrpc: `${number}`; id: number }
  & (SuccessResult<result> | ErrorResult<error> | Subscription<result, error>)
```

No notification type; viem is a client.

**Error modeling — 29 classes in one file, each paired with a name-tagged `type` alias.**
`src/errors/base.ts:35-45` and `src/errors/rpc.ts:36-60`:

```ts
export type BaseErrorType = BaseError & { name: 'BaseError' }
export class BaseError extends Error { details: string; shortMessage: string; version: string; ... walk(fn?): any }

export type RpcErrorType = RpcError & { name: 'RpcError' }
export class RpcError<code_ extends number = RpcErrorCode> extends BaseError {
  code: code_ | (number & {})
  constructor(cause: Error, { code, docsPath, metaMessages, name, shortMessage }: RpcErrorOptions<code_>) { ... }
}
```

Then `ProviderRpcError`, `ParseRpcError` (`static code = -32700 as const`), `InvalidRequestRpcError`, and so on — 29 `export class` declarations, each with an `export type X…ErrorType = X… & { name: 'X…' }` alias.

There is **no named wire type for the error object**. It appears only as an inline anonymous parameter type — `src/errors/request.ts:98-105`:

```ts
export class RpcRequestError extends BaseError {
  code: number
  data?: unknown
  constructor({ body, error, url }: { body: ...; error: { code: number; data?: unknown; message: string }; url: string }) {
```

No `toJson()` / `toLiteral()`.

**Asymmetry handling — a code-to-class mapping table on receive.**
`src/utils/buildRequest.ts:163-266`:

```ts
} catch (err_) {
  ...
  const err = err_ as unknown as RpcError<RpcErrorCode | ProviderRpcErrorCode>
  switch (err.code) {
    case ParseRpcError.code:          throw new ParseRpcError(err)
    case InvalidRequestRpcError.code: throw new InvalidRequestRpcError(err)
    case MethodNotFoundRpcError.code: throw new MethodNotFoundRpcError(err, { method: args.method })
    ...
    default:
      if (err_ instanceof BaseError) throw err_
      throw new UnknownRpcError(err as Error)
  }
}
```

**The interesting part: viem's documented recipe is not `instanceof`.**
`site/pages/docs/error-handling.mdx`:

> Every module in viem exports an accompanying error type which you can use to strongly type your `catch` statements. These types come in the form of `<Module>ErrorType`… Unfortunately, [TypeScript doesn't have an abstraction for typed exceptions], so the most pragmatic & vanilla approach would be to explicitly cast error types in the `catch` statement.

```ts
} catch (e) {
  const error = e as GetBlockNumberErrorType
  if (error.name === 'InternalRpcError')
    error.code
  if (error.name === 'HttpRequestError') {
    error.headers
```

`RequestErrorType` (`buildRequest.ts:95-120`) is a union of ~26 `*ErrorType` aliases. So viem builds classes for construction, and then hands users a **string-tagged discriminated union over `name`** for narrowing. `instanceof` appears in viem's own internals (`err_ instanceof BaseError`, `error instanceof HttpRequestError`), never in the public guidance.

**Validation — none on the envelope.** `src/utils/rpc/http.ts` parses the body and pattern-matches `data.error?.code`/`data.error?.message` only to decide whether a non-2xx body still carries a usable JSON-RPC error.

---

## 5. `@open-rpc/client-js` / `@open-rpc/server-js`

**Envelope — all-optional interfaces, no discriminated union.** `open-rpc/client-js:src/Request.ts:16-53`:

```ts
export interface IJSONRPCError { code: number; message: string; data: any; }
export interface IJSONRPCResponse {
  jsonrpc: "2.0";
  id?: string | number;
  result?: any;
  error?: IJSONRPCError;
}
```

Because `result?` and `error?` are both optional, narrowing fails and the code uses casts: `src/transports/TransportRequestManager.ts:167,172` (`data as IJSONRPCResponse`).

**Discrimination — pending-id table plus a truthiness probe.** `TransportRequestManager.ts:135-142`:

```ts
private processResult(payload: any, prom: IRequestPromise) {
  if (payload.error) { const err = convertJSONToRPCError(payload); prom.reject(err); return; }
  prom.resolve(payload.result);
}
```

`isNotification` at `src/Request.ts:69-71` returns bare `boolean`, not `data is …`.

**Error — class plus wire interface. The class takes the good name.**
`src/Error.ts:5-17`:

```ts
export class JSONRPCError extends Error {
  public message: string; public code: number; public data?: unknown;
  constructor(message: string, code: number, data?: any) {
    super(message);
    this.message = message; this.code = code; this.data = data;
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain: see https://github.com/open-rpc/client-js/issues/209
  }
}
```

Wire shape is `IJSONRPCError`. No `toJson()`. Note `new.target.prototype` (not `JSONRPCError.prototype`) — this preserves subclass identity, unlike vscode-jsonrpc. There is a regression test for it, `src/Error.test.ts:17-20`: `expect(err instanceof JSONRPCError).toBe(true)`.

Only the class is exported from `src/index.ts:23`; `IJSONRPCError` is not.

**Asymmetry — an explicit rehydrate function.** `src/Error.ts:20-26`:

```ts
export const convertJSONToRPCError = (payload: any): JSONRPCError => {
  if (payload.error) { const { message, code, data } = payload.error; return new JSONRPCError(message, code, data); }
  return new JSONRPCError("Unknown error", ERR_UNKNOWN, payload);
};
```

The parameter is `any`, so the wire interface and the class are never connected by a type.

**The sibling package proves the ecosystem is inconsistent.** `@open-rpc/server-js:src/error.ts:1-11` has a duplicate `JSONRPCError` class with a bare `super()` and **no** `setPrototypeOf` — the bug `client-js` fixed. It names the wire shape differently again: `JSONRPCErrorObject` in `src/transports/server-transport.ts:10-21`. Class-to-wire is inline `instanceof`, `src/router.ts:86-93`:

```ts
if (e instanceof JSONRPCError) { return { error: { code: e.code, message: e.message, data: e.data } }; }
return { error: { code: 6969, message: "unknown error" } };
```

`@open-rpc/meta-schema:index.d.ts:267-272` gives the same shape a third name, `ErrorObject`.

**Validation — a three-way `!== undefined` probe** (`TransportRequestManager.ts:121-132`), which does not check `jsonrpc: "2.0"`. `@open-rpc/server-js` JSON-Schema-validates method *params* against the OpenRPC document (`src/router.ts:68-80`), never the envelope.

---

## 6. `jayson` (tedeh/jayson)

**No error class exists anywhere in jayson.** I verified this independently against `index.d.ts` on `master`.

**Envelope — versioned interfaces, result and error split.** `index.d.ts:105-150`:

```ts
export interface JSONRPCVersionTwoRequest { jsonrpc: string; method: string; params: RequestParamsLike; id?: JSONRPCIDLike | null; }
export interface JSONRPCVersionTwoResponseWithResult { jsonrpc: string; result: any; id: JSONRPCIDLike | null; }
export interface JSONRPCVersionTwoResponseWithError { jsonrpc: string; error: JSONRPCError; id: JSONRPCIDLike | null; }
export type JSONRPCVersionTwoResponse = JSONRPCVersionTwoResponseWithResult | JSONRPCVersionTwoResponseWithError;
```

`jsonrpc: string`, not `'2.0'` — no literal type, so the union does not discriminate on it. The runtime does check it (`lib/utils.js:396`).

**Discrimination — the `Utils.Request.isX()` namespace pattern you asked about, but the types are useless.** `index.d.ts:82-93`:

```ts
type UtilsRequest = {
  isBatch(request:any): boolean;
  isNotification(request:any): boolean;
  isValidVersionTwoRequest(request:any): boolean;
  isValidRequest(request:any, version?:number): boolean;
}
type UtilsResponse = {
  isValidError(error:any, version?:number): boolean;
  isValidResponse(response:any, version?:number): boolean;
}
```

Every return type is `boolean`, never `x is T`. The runtime checks are thorough (`lib/utils.js:361-500`, including a real mutual-exclusivity check on `result`/`error` at `:489-493`).

**Error — the wire interface is the only representation, and it takes the good name.** `index.d.ts:97-103`:

```ts
export interface JSONRPCError { code: number; message: string; data?: object; }
export type JSONRPCErrorLike = Error | JSONRPCError;
```

Errors come from a factory returning a plain object — `lib/server/index.js:205-219`, typed `error(code?, message?, data?): JSONRPCError` at `index.d.ts:259`.

**Asymmetry — sidestepped by a union, then normalized at runtime.** `JSONRPCCallbackTypeSugared` (`index.d.ts:162-164`) gives transport failure (`err: Error`) and protocol failure (`error: JSONRPCErrorLike`) **separate callback slots**. And a thrown value that is not already a valid wire error is *replaced*, not converted — `lib/server/index.js:329-340`:

```js
if(utils.Response.isValidError(error, self.options.version)) { respond(error); return; }
// got an invalid error
if(error) { respond(self.error(Server.errors.INTERNAL_ERROR)); return; }
```

Also of note: even `Client` and `Server` are not `declare class` — they are `interface` + `declare const` with a synthesized `ConstructorOf<>` type (`index.d.ts:10, 372-387`), the standard idiom for hand-written typings over JS.

---

## 7. ethers.js v6 — the deliberate anti-class design

Verified against `src.ts/` on `master` and the shipped 6.17.0 tarball: **there is no error class in ethers.** Grepping `lib.commonjs` for `extends Error` returns only `errors.d.ts:85: export interface EthersError<…> extends Error`.

**Envelope — `type` aliases, and the two response types are disjoint.** `src.ts/providers/provider-jsonrpc.ts:88-142`:

```ts
export type JsonRpcPayload = { id: number; method: string; params: Array<any> | Record<string, any>; jsonrpc: "2.0"; };
export type JsonRpcResult  = { id: number; result: any; };
export type JsonRpcError   = { id: number; error: { code: number; message?: string; data?: any } };
```

The response types omit `jsonrpc` entirely — ethers never checks it on receive. Because the two are disjoint (one has `result`, one has `error`), `in`-narrowing works.

**Discrimination — `"error" in resp`, real narrowing, no casts.** `provider-jsonrpc.ts:569-576`:

```ts
// The response is an error
if ("error" in resp) {
    reject(this.getRpcError(payload, resp));
    continue;
}
// All good; send the result
resolve(resp.result);
```

**Error modeling — `interface … extends Error`, a `makeError` factory, and an `isError()` guard.**
`src.ts/utils/errors.ts:1-9`:

```
 *  All errors in ethers include properties to ensure they are both
 *  human-readable (i.e. ``.message``) and machine-readable (i.e. ``.code``).
 *
 *  The [[isError]] function can be used to check the error ``code`` and
 *  provide a type guard for the properties present on that error interface.
```

`errors.ts:160-183, 589-616, 639-641, 660-710`:

```ts
export interface EthersError<T extends ErrorCode = ErrorCode> extends Error {
    code: ErrorCode; shortMessage: string; info?: Record<string, any>; error?: Error;
}
export type CodedEthersError<T> =
    T extends "SERVER_ERROR" ? ServerError:
    T extends "CALL_EXCEPTION" ? CallExceptionError: ... never;

export function isError<K extends ErrorCode, T extends CodedEthersError<K>>(error: any, code: K): error is T {
    return (error && (<EthersError>error).code === code);
}

export function makeError<K extends ErrorCode, T extends CodedEthersError<K>>(message: string, code: K, info?: ErrorInfo<T>): T {
    ...
    switch (code) {
        case "INVALID_ARGUMENT": error = new TypeError(message); break;
        case "NUMERIC_FAULT": case "BUFFER_OVERRUN": error = new RangeError(message); break;
        default: error = new Error(message);
    }
    defineProperties<EthersError>(<EthersError>error, { code });
    if (info) { Object.assign(error, info); }
    return <T>error;
}
```

`makeError` returns a **native** `Error` / `TypeError` / `RangeError` decorated with `code`, then cast. Picking the native subclass per code is a capability a class hierarchy gives up.

**Asymmetry — a large one-way normalizer, and the wire object is kept as data.**
`provider-jsonrpc.ts:988-1087`:

```ts
/**
 *  Returns an ethers-style Error for the given JSON-RPC error
 *  %%payload%%, coalescing the various strings and error shapes
 *  that different nodes return, coercing them into a machine-readable
 *  standardized error.
 */
getRpcError(payload: JsonRpcPayload, _error: JsonRpcError): Error {
```

Wire type in, native `Error` out. The raw wire object is preserved under `info: { payload, error }` rather than converted into the ethers error. Notably the wire `code` is never read — dispatch is `payload.method` plus regex over `error.message`.

**Validation — none.** `provider-jsonrpc.ts:1266-1278` returns `response.bodyJson` with the declared type `Array<JsonRpcResult>` as an unchecked assertion (which is even wrong — errors come back through the same path).

---

## 8. Theia `@theia/core` `message-rpc` — the clearest "rebuild on receive"

Two corrections to my brief, both verified: on current `master` `@theia/core` has **no** `vscode-jsonrpc` dependency, and the wire format is msgpack with numeric tags, **not** JSON-RPC 2.0. I include it because it is the cleanest solution to your exact problem.

**Envelope — a `const enum`-tagged discriminated union of interfaces.**
`packages/core/src/common/message-rpc/rpc-message-encoder.ts:30-69`:

```ts
export type RpcMessage = RequestMessage | ReplyMessage | ReplyErrMessage | CancelMessage | NotificationMessage;

export const enum RpcMessageType { Request = 1, Notification = 2, Reply = 3, ReplyErr = 4, Cancel = 5 }

export interface RequestMessage  { type: RpcMessageType.Request; id: number; method: string; args: any[]; }
export interface ReplyErrMessage { type: RpcMessageType.ReplyErr; id: number; err: any; }
```

`const enum` erases to literal numbers, so the tag costs nothing at runtime.

**Discrimination — a plain `switch` on the tag.** `message-rpc/rpc-protocol.ts:96-127`.

**Error — a class and a wire interface, side by side in one file.** `rpc-message-encoder.ts:71-87`:

```ts
export interface SerializedError {
    readonly $isError: true;
    readonly name: string;
    readonly message: string;
    readonly stack: string;
}

/**
 * A special error that can be returned in case a request
 * has failed. Provides additional information i.e. an error code
 * and additional error data.
 */
export class ResponseError extends Error {
    constructor(readonly code: number, message: string, readonly data: any) { super(message); }
}
```

No `toJson()` on the class — serialization lives in a codec extension.

**Asymmetry — it rebuilds the class, and to do so it puts an extra boolean on the wire.**
`rpc-message-encoder.ts:171-190`:

```ts
export function registerMsgPackExtensions(): void {
    MsgPackExtensionManager.getInstance().registerExtensions({
        class: Error,
        tag: 1,
        serialize: (error: any) => {
            const { code, data, message, name } = error;
            const stack = error.stacktrace ?? error.stack;
            const isResponseError = error instanceof ResponseError;
            return { code, data, message, name, stack, isResponseError };
        },
        deserialize: data => {
            const error = data.isResponseError ? new ResponseError(data.code, data.message, data.data) : new Error(data.message);
            error.name = data.name;
            error.stack = data.stack;
            return error;
        }
    });
}
```

`instanceof` runs only on the **send** side; the receive side reads the boolean flag. That `isResponseError: boolean` exists precisely because class identity cannot survive serialization.

Caveat: `SerializedError` is declared and exported but is referenced nowhere in the `message-rpc` folder and is not in `message-rpc/index.ts`'s export list. I could not confirm any consumer repo-wide (GitHub code search needs auth), so it may be vestigial.

Bonus from the same repo — `packages/plugin-ext/src/common/rpc-protocol.ts:65-76` deliberately avoids a class so the value survives serialization:

```ts
export interface ConnectionClosedError extends Error { code: 'RPC_PROTOCOL_CLOSED' }
export namespace ConnectionClosedError {
    const code: ConnectionClosedError['code'] = 'RPC_PROTOCOL_CLOSED';
    export function create(message: string = 'connection is closed'): ConnectionClosedError {
        return Object.assign(new Error(message), { code });
    }
    export function is(error: unknown): error is ConnectionClosedError {
        return isObject(error) && 'code' in error && (error as ConnectionClosedError).code === code;
    }
}
```

**Validation — none.** `parse(buffer)` is a straight `this.decode(buffer)` cast (`rpc-message-encoder.ts:166-168`); a bad `type` falls through both switches to a `console.warn`.

---

## 9. MetaMask — `@metamask/rpc-errors` + `@metamask/utils` + `json-rpc-engine`

Your hypothesis holds exactly, and the source **imports the wire type under an alias** to keep the two apart. I verified `classes.ts` directly.

**Envelope — superstruct schemas plus `Infer<>`.** `MetaMask/utils:src/json.ts:306-343, 452-492`:

```ts
export const JsonRpcErrorStruct = object({ code: integer(), message: string(), data: exactOptional(JsonStruct), stack: exactOptional(string()) });
export type JsonRpcError = OptionalField<Infer<typeof JsonRpcErrorStruct>, 'data'>;
export const JsonRpcRequestStruct = object({ id: JsonRpcIdStruct, jsonrpc: JsonRpcVersionStruct, method: string(), params: exactOptional(JsonRpcParamsStruct) });
export const JsonRpcNotificationStruct = object({ jsonrpc: JsonRpcVersionStruct, method: string(), params: exactOptional(JsonRpcParamsStruct) });
export const JsonRpcResponseStruct = union([JsonRpcSuccessStruct, JsonRpcFailureStruct]);
```

**Discrimination — generated `is(value, Struct)` predicates, each with a throwing `assertIsJsonRpc*` twin** (`json.ts:377-632`). Live use at `MetaMask/core:packages/json-rpc-engine/src/JsonRpcEngine.ts:442-446`.

**Error — the class and the wire type share the identifier, so the class file aliases one of them.**
`MetaMask/rpc-errors:src/classes.ts:1-11, 19-21, 57-84`:

```ts
import type {
  Json,
  JsonRpcError as SerializedJsonRpcError,
} from '@metamask/utils';
...
export type { SerializedJsonRpcError };

export class JsonRpcError<Data extends OptionalDataWithOptionalCause> extends Error {
  public cause?: unknown;
  public code: number;
  public data?: Data;
  ...
  /**
   * Get the error as JSON-serializable object.
   *
   * @returns A plain object with all public class properties.
   */
  serialize(): SerializedJsonRpcError {
    const serialized: SerializedJsonRpcError = { code: this.code, message: this.message };
    ...
    return serialized;
  }
```

So: class `JsonRpcError` (in `rpc-errors`), wire type `JsonRpcError` (in `utils`), re-exported as `SerializedJsonRpcError`. Conversion method is `serialize()` and its return type *is* the wire type.

**Asymmetry — class to wire only, and the check is duck-typed on `.serialize`, not `instanceof`.**
`MetaMask/rpc-errors:src/utils.ts:138-168`:

```ts
// If an error specifies a `serialize` function, we call it and return the result.
if (error && typeof error === 'object' && 'serialize' in error && typeof error.serialize === 'function') {
  return error.serialize();
}

if (isJsonRpcError(error)) {
  return error;
}

// If the error does not match the JsonRpcError type, use the fallback error, but try to include the original error as `cause`.
```

There is **no rehydration**. An incoming wire error passes through untouched. The engine calls `serializeError` at the boundary — `JsonRpcEngine.ts:472-476`, `v2/JsonRpcServer.ts:193-202` — and never reconstructs a class. The class and wire object coexist only in a callback type: `JsonRpcEngine.ts:20` `export type JsonRpcEngineCallbackError = Error | SerializedJsonRpcError | null;`.

**Validation — superstruct as the source of truth, with cheap hand-rolled checks on the hot path** (`JsonRpcEngine.ts:410-441`, `v2/JsonRpcServer.ts:208-215`).

---

## 10. tRPC (trpc/trpc, ~37k stars) — three named things, and a documented `instanceof` failure

Cites the spec directly: `rpc/codes.ts:3` `// reference: https://www.jsonrpc.org/specification`.

**Envelope — interfaces inside a `namespace`, extended by app-level interfaces.**
`packages/server/src/unstable-core-do-not-import/rpc/envelopes.ts:18-47, 80-83`:

```ts
export namespace JSONRPC2 {
  export type RequestId = number | string | null;
  export interface BaseEnvelope { id?: RequestId; jsonrpc?: '2.0'; }
  export interface BaseRequest<TMethod extends string = string> extends BaseEnvelope { method: TMethod; }
  export interface ResultResponse<TResult = unknown> extends BaseEnvelope { result: TResult; }
  export interface ErrorResponse<TError extends TRPCErrorShape = TRPCErrorShape> extends BaseEnvelope { error: TError; }
}
export type TRPCResponse<TData = unknown, TError extends TRPCErrorShape = TRPCErrorShape> =
  TRPCErrorResponse<TError> | TRPCSuccessResponse<TData>;
```

`jsonrpc?: '2.0'` is optional; tRPC tolerates its absence.

**Discrimination — `in`-operator, then converted to an internal tagged union.**
`packages/client/src/links/wsLink/wsClient/wsClient.ts:326-334`:

```ts
const incomingMessage = this.encoder.decode(data) as TRPCClientIncomingMessage;
if ('method' in incomingMessage) { this.handleIncomingRequest(incomingMessage); return; }
this.handleResponseMessage(incomingMessage);
```

`packages/server/src/unstable-core-do-not-import/transformer.ts:135-155` converts `'error' in response` into `{ ok: false, error } | { ok: true, result }` with `as const`, so all downstream code narrows on `.ok`.

**Error — three named things.**
- Wire interface `TRPCErrorShape<TData>` — `rpc/envelopes.ts:9-13`.
- Server class `TRPCError extends Error` — `error/TRPCError.ts:65-86`; its `code` is a **string key** (`'UNAUTHORIZED'`), never the number.
- Client class `TRPCClientError<T> extends Error implements TRPCClientErrorBase<...>` — `packages/client/src/TRPCClientError.ts:47-55`, which holds the wire shape as a field: `public readonly shape`.

No `toJson()` on any of them. Class-to-wire is a **free function**, `error/getErrorShape.ts:11-35`, deliberately so that `config.errorFormatter` can intercept it — a method could not be overridden per router.

**Asymmetry — rebuilds into a *different* class, using a structural guard for the wire check.**
`TRPCClientError.ts:28-35, 87-117`:

```ts
function isTRPCErrorResponse(obj: unknown): obj is TRPCErrorResponse<any> {
  return isObject(obj) && isObject(obj['error']) &&
    typeof obj['error']['code'] === 'number' && typeof obj['error']['message'] === 'string';
}
...
public static from(...) {
  if (isTRPCClientError(cause)) { ... return cause; }
  if (isTRPCErrorResponse(cause)) { return new TRPCClientError(cause.error.message, { ...opts, result: cause, cause: opts.cause }); }
  return new TRPCClientError(getMessageFromUnknownError(cause, 'Unknown error'), { ...opts, cause: cause as any });
}
```

`instanceof` is reserved for its own class, hardened with `Object.setPrototypeOf(this, TRPCClientError.prototype)` (`:84`).

**And here is the quotable `instanceof` failure, verified directly** — `error/TRPCError.ts:43-50`:

```ts
export function getTRPCErrorFromUnknown(cause: unknown): TRPCError {
  if (cause instanceof TRPCError) {
    return cause;
  }
  if (cause instanceof Error && cause.name === 'TRPCError') {
    // https://github.com/trpc/trpc/pull/4848
    return cause as TRPCError;
  }
```

A name-based fallback for when `instanceof` fails across duplicate package copies — the same failure mode MCP solved with brands.

**Validation — hand-rolled `asserts` functions** (`rpc/parseTRPCMessage.ts:7-88`), plus a post-transform re-check (`transformer.ts:182-192`).

---

## 11. Two smaller confirming data points

**`fgnass/typed-rpc`** — envelope is plain interfaces with the error shape **inline and unnamed**; `src/types.ts:12-18`:

```ts
export interface JsonRpcErrorResponse extends BaseJsonRpcResponse {
  error: { code: number; message: string; data?: any };
}
export type JsonRpcResponse = JsonRpcSuccessResponse | JsonRpcErrorResponse;
```

Class `RpcError extends Error` with `Object.setPrototypeOf(this, RpcError.prototype)` and the TS handbook link in a comment (`src/client.ts:46-57`). Client rehydrates: `src/client.ts:136-138` `if ("error" in res) { const { code, message, data } = res.error; throw new RpcError(message, code, data); }`. The **server never uses the class** — it duck-types via overridable `getErrorCode`/`getErrorMessage`/`getErrorData` extractors (`src/server.ts:45-67, 152-162`).

**`gadget-inc/json-rpc-utils`** — wire interface `JSONRPCError`, class `JSONRPCRemoteError`, and it *explicitly avoids `instanceof`* with a boolean brand (`src/models.ts:74-88`):

```ts
export class JSONRPCRemoteError extends Error {
  isJSONRPCRemoteError = true;
  constructor(message: string, readonly code: number, readonly response?: JSONRPCResponse, readonly data?: any) { super(message); }
}
export const isJSONRPCRemoteError = (error: any): error is JSONRPCRemoteError => {
  return error && "isJSONRPCRemoteError" in error && error.isJSONRPCRemoteError;
};
```

Client rehydrates at `src/client.ts:58-63`.

**`BlackGlory/json-rpc-types`** — a types-only package. All `interface`, `JsonRpcResponse<T> = JsonRpcSuccess<T> | JsonRpcError<T>` union, wire error object named `JsonRpcErrorObject<T>`, and a full set of `isJsonRpcX(val: unknown): val is X` predicates plus `isntJsonRpcX` negations built on `Exclude<>`. No classes at all.

---

# Synthesis

## Q1. What is the prevailing convention for the message envelope?

**Plain interfaces or type aliases plus type guards. Unanimously.** Not one of the 13 projects I read models a request, notification, or response as a class. The mechanisms split four ways:

| Mechanism | Projects |
|---|---|
| Namespace guards (`Message.isRequest()`) | vscode-jsonrpc, jayson (`Utils.Request.*`) |
| Standalone predicate functions | json-rpc-2.0, json-rpc-types, MCP, MetaMask, typed-rpc, json-rpc-utils |
| `in`-operator / property probe, no named guard | ethers, tRPC, viem, open-rpc/client-js |
| Literal/enum tag + `switch` | Theia (`const enum RpcMessageType`), MCP (`resultType` internally) |

Two design details separate the good from the bad. First, `jsonrpc: '2.0'` as a **literal** type — json-rpc-2.0, MCP, tRPC, viem's request, and json-rpc-types do this; vscode-jsonrpc (`jsonrpc: string`) and jayson (`jsonrpc: string`) do not. Second, **exclusivity of `result` and `error`**. Projects that write `result?: undefined` / `error?: undefined` (json-rpc-2.0) or two disjoint types (ethers, jayson, tRPC, MCP, json-rpc-types) get free `in`-narrowing. Projects with both members merely optional (vscode-jsonrpc's `ResponseMessage`, `@open-rpc/client-js`'s `IJSONRPCResponse`) cannot narrow and fall back to `as` casts.

Only two projects validate the envelope against a schema: **MCP (Zod, `.strict()`, on every message)** and **MetaMask (superstruct)**. Everyone else hand-rolls, and vscode-jsonrpc, Theia, ethers, and typescript-language-server do not validate at all.

## Q2. Is it common and accepted to mix — plain types for the envelope, a class for the error?

**Yes. It is the single most common arrangement, and every project that does it names the two shapes distinctly.** Nine of the projects I read do exactly this. The naming is where they differ, and there are three schools:

| Project | Wire-shape type | Class | Conversion |
|---|---|---|---|
| **vscode-jsonrpc** | `ResponseErrorLiteral<D>` (interface) | `ResponseError<D>` | `toJson(): ResponseErrorLiteral<D>` |
| **json-rpc-2.0** | `JSONRPCError` (interface) | `JSONRPCErrorException` (`implements JSONRPCError`) | `toObject(): JSONRPCError` |
| **MetaMask** | `JsonRpcError` in `@metamask/utils`, imported as `SerializedJsonRpcError` | `JsonRpcError` in `@metamask/rpc-errors` | `serialize(): SerializedJsonRpcError` |
| **tRPC** | `TRPCErrorShape<TData>` (interface) | `TRPCError` (server), `TRPCClientError` (client) | free function `getErrorShape()` |
| **Theia** | `SerializedError` (interface, possibly vestigial) | `ResponseError` | external msgpack codec extension |
| **@open-rpc/client-js** | `IJSONRPCError` (not exported) | `JSONRPCError` | none |
| **json-rpc-utils** | `JSONRPCError` (interface) | `JSONRPCRemoteError` | none |
| **MCP** | inline in the Zod schema; spec anchor calls it `Error` | `ProtocolError` (+ `SdkError` for local) | none — inline literal |
| **viem** | inline anonymous, unnamed | `RpcError` + 28 subclasses | none |

Three naming schools, then:

1. **Suffix the wire type** so the class keeps the good name: `…Literal` (vscode-jsonrpc), `Serialized…` (MetaMask, Theia), `…Shape` (tRPC), `…Object` (@open-rpc/server-js, json-rpc-types). Note that `ResponseErrorLiteral` is unique to vscode-jsonrpc — a web search for the identifier turns up no other adopter. `Serialized…` and `…Shape` are the more portable idioms.
2. **Suffix the class** so the wire type keeps the good name: `…Exception` (json-rpc-2.0), `…RemoteError` (json-rpc-utils), `ProtocolError` (MCP).
3. **Do not name the wire shape at all** — leave it inline. viem and MCP do this; typed-rpc too. This is viable when nothing ever needs to *hold* a bare wire error.

Two projects reject the class entirely and should inform your decision:

- **ethers v6** uses `interface EthersError extends Error` plus a `makeError()` factory and an `isError(err, code)` predicate. `errors.ts:1-9` documents the intent. The factory returns a native `Error`/`TypeError`/`RangeError` per code — a genuine capability that a single class hierarchy forfeits.
- **jayson** has no error class at all. Its wire interface `JSONRPCError` is the only representation, and the class/plain-object asymmetry surfaces instead as `type JSONRPCErrorLike = Error | JSONRPCError` and as **separate callback slots** for transport failure versus protocol failure.

And one project has classes yet does not recommend `instanceof`: **viem** pairs each of its 29 error classes with `export type XErrorType = X & { name: 'X' }` and documents narrowing by `error.name === 'InternalRpcError'` over the `RequestErrorType` union. Classes for construction, string tags for narrowing.

## Q3. Do any projects rebuild class instances on receive?

**Yes — six of them, and it is the majority behavior for the error object.** But **none** rebuilds the message envelope. The envelope stays a plain object everywhere, in every project.

| Project | Rehydrates the error? | Where | Notes |
|---|---|---|---|
| **vscode-jsonrpc** | yes | `connection.ts:924` `new ResponseError(error.code, error.message, error.data)` | restores the base class only; subclass identity lost |
| **MCP** | yes | `protocol.ts:1215` `ProtocolError.fromError(...)` | restores the correct **subclass** by inspecting `code` and `data` shape |
| **json-rpc-2.0** | yes | `client.ts:149` `new JSONRPCErrorException(...)` | |
| **@open-rpc/client-js** | yes | `Error.ts:20-26` `convertJSONToRPCError(payload: any)` | parameter typed `any` — the two shapes are never linked by a type |
| **Theia** | yes | `rpc-message-encoder.ts:184` `new ResponseError(data.code, data.message, data.data)` | requires an **explicit `isResponseError: boolean` on the wire** |
| **typed-rpc** / **json-rpc-utils** | yes | `client.ts:138` / `client.ts:58` | |
| **viem** | yes, differently | `buildRequest.ts:171-266` `switch (err.code) { case ParseRpcError.code: throw new ParseRpcError(err) ... }` | a code-to-class mapping table |
| **ethers** | no — it *normalizes* | `provider-jsonrpc.ts:994` `getRpcError(payload, _error): Error` | the wire object is **kept as data** under `info: { payload, error }`, not converted into |
| **tRPC** | yes, into a *different* class | `TRPCClientError.from` | server throws `TRPCError`, client receives `TRPCClientError` |
| **MetaMask** | **no** | `utils.ts:153-155` `if (isJsonRpcError(error)) { return error; }` | class-to-wire only; a received wire error passes through untouched |
| **jayson** | n/a — no class | `lib/server/index.js:336-339` | an invalid thrown error is **replaced** by `-32603`, not converted |

**Do they say why?** Only three explain themselves in source, and their reasons converge.

MCP is the most explicit. `crossBundleBrand.ts:1-13`:

> `@modelcontextprotocol/client` and `@modelcontextprotocol/server` each bundle their own copy of `core-internal`, so an error constructed by one package fails a prototype-identity `instanceof` against the same class re-exported by the other — exactly the check a dual-role process (gateway, host, in-process test) writes.
>
> Instead of prototype identity, branded classes stamp every instance with the brand strings of its class chain under a registry symbol (`Symbol.for`, shared across bundles and realms), and resolve `instanceof` via `Symbol.hasInstance` against the brand set.

Theia's answer is a wire flag instead of a brand. `instanceof ResponseError` runs on the **send** side only (`rpc-message-encoder.ts:181`); the receive side reads `data.isResponseError` (`:184`). The boolean exists exactly because class identity cannot cross a serialization boundary.

tRPC's answer is a name fallback. `TRPCError.ts:47-49`:

```ts
if (cause instanceof Error && cause.name === 'TRPCError') {
  // https://github.com/trpc/trpc/pull/4848
  return cause as TRPCError;
}
```

MetaMask sidesteps `instanceof` altogether by duck-typing the method: `'serialize' in error && typeof error.serialize === 'function'` (`utils.ts:143-151`).

The consistent conclusion across the ecosystem: **`instanceof` is treated as unreliable across a serialization *or a package* boundary.** Every project either rehydrates so that `instanceof` holds locally (vscode-jsonrpc, MCP, json-rpc-2.0, viem, tRPC), replaces `instanceof` with a brand, a boolean, a name, or a duck-type (MCP, Theia, tRPC, MetaMask, json-rpc-utils, ethers, viem's public docs), or avoids the class entirely (ethers, jayson, json-rpc-types).

## What I could not verify

- **No project states its rationale for the class-versus-interface choice for the *error* type.** vscode-jsonrpc's `messages.ts` has no comment on the `ResponseError` / `ResponseErrorLiteral` split, and the commit history for that file (last 100 commits) shows no relevant message. ethers documents *how* `isError` works but never says why it chose interfaces. The rationale comments that do exist (MCP, Theia, tRPC, `@open-rpc/client-js:src/Error.ts:15`) are all about `instanceof` reliability, never about the modeling choice itself.
- **Theia's `SerializedError`** is declared and exported but referenced nowhere in the `message-rpc` folder and absent from its `index.ts` barrel. GitHub's code-search API requires auth here, so I could not confirm whether any consumer uses it. Treat it as possibly dead.
- **Deno has no TypeScript JSON-RPC evidence.** A full recursive tree of `denoland/std` (2,973 paths) has zero matches for `jsonrpc|json_rpc|lsp|rpc`. `denoland/deno`'s `cli/lsp` is 31 Rust files.

## The most directly applicable precedent

If you want the closest match to the tension you named — plain types for the envelope, a class for the error, and `instanceof` that is exact on both sides — the pairing to copy is **vscode-jsonrpc's naming with MCP's mechanics**:

- Envelope: plain interfaces with a literal `jsonrpc: '2.0'` and mutually exclusive `result?: undefined` / `error?: undefined` members, plus `x is T` predicates.
- Error: a class with a **distinctly named** wire interface beside it (`Serialized…` or `…Shape` travel better than `…Literal`), a `serialize()`/`toJson()` whose return type *is* the wire interface, and a `fromError`-style factory on the receive path.
- `instanceof`: a `Symbol.for` brand plus a `Symbol.hasInstance` override and a static `isInstance` guard, if your package can be bundled more than once in a process. MCP's `crossBundleBrand.ts` documents the whole contract, including the failure modes (property mangling, pre-brand peers, version-less brand identity).

Sources: [vscode-languageserver-node](https://github.com/microsoft/vscode-languageserver-node), [language-server-protocol spec](https://github.com/microsoft/language-server-protocol), [shogowada/json-rpc-2.0](https://github.com/shogowada/json-rpc-2.0), [modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk), [wevm/viem](https://github.com/wevm/viem), [open-rpc/client-js](https://github.com/open-rpc/client-js), [tedeh/jayson](https://github.com/tedeh/jayson), [ethers-io/ethers.js](https://github.com/ethers-io/ethers.js), [eclipse-theia/theia](https://github.com/eclipse-theia/theia), [MetaMask/rpc-errors](https://github.com/MetaMask/rpc-errors), [trpc/trpc](https://github.com/trpc/trpc), [fgnass/typed-rpc](https://github.com/fgnass/typed-rpc), [gadget-inc/json-rpc-utils](https://github.com/gadget-inc/json-rpc-utils), [BlackGlory/json-rpc-types](https://github.com/BlackGlory/json-rpc-types), [typescript-language-server](https://github.com/typescript-language-server/typescript-language-server), [denoland/std](https://github.com/denoland/std).
