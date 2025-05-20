import { assert, describe, test, log } from "matchstick-as";
import { ethereum, Bytes } from "@graphprotocol/graph-ts";

describe("Decode transaction input", () => {
  test("Should decode string parameter correctly", () => {
    const rawTxString =
      "0xbb3e3159000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000047465737400000000000000000000000000000000000000000000000000000000";
    log.info("Raw tx string: {}", [rawTxString]);

    // Strip selector (first 4 bytes = 8 hex chars)
    const payloadHex = rawTxString.slice(10); // skip "0x" and selector
    const payload = Bytes.fromHexString("0x" + payloadHex);

    // Decode as string
    const decoded = ethereum.decode("string", payload);

    const result = decoded!.toString();
    log.info("Decoded string: {}", [result]);

    assert.stringEquals("test", result);
  });
});
