import {
  AnswerAttempt as AnswerAttemptEvent,
  RiddleSet as RiddleSetEvent,
  Winner as WinnerEvent,
} from "../generated/OnchainRiddle/OnchainRiddle";
import { AnswerAttempt, RiddleSet, Winner } from "../generated/schema";
import { ethereum, Bytes } from "@graphprotocol/graph-ts";

export function handleAnswerAttempt(event: AnswerAttemptEvent): void {
  let entity = new AnswerAttempt(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  const answerRaw = event.transaction.input.toHexString();
  const payloadHex = answerRaw.slice(10);
  const payload = Bytes.fromHexString("0x" + payloadHex);
  const decoded = ethereum.decode("string", payload);
  const answerInput = decoded ? decoded.toString() : "";

  entity.answerRaw = answerRaw;
  entity.answerInput = answerInput;
  entity.user = event.params.user;
  entity.correct = event.params.correct;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRiddleSet(event: RiddleSetEvent): void {
  let entity = new RiddleSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.riddle = event.params.riddle;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleWinner(event: WinnerEvent): void {
  let entity = new Winner(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.user = event.params.user;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
