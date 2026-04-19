import assert from "node:assert/strict";
import test from "node:test";
import type { ElementsPaymentReceipt } from "./payment-receipt";
import {
  elementsSlice,
  resetElementsOutcome,
  setElementsFailure,
  setElementsSuccess,
} from "./elementsSlice";

const sampleReceipt: ElementsPaymentReceipt = {
  productLabel: "Pro Plan",
  amountDisplay: "$29.00",
  paymentIntentId: "pi_test_123",
  paymentStatus: "succeeded",
};

test("elementsSlice sets succeeded outcome and receipt when setElementsSuccess is dispatched", () => {
  const nextState = elementsSlice.reducer(
    {
      clientSecret: null,
      elementsOutcome: "idle",
      elementsErrorMessage: null,
      elementsReceipt: null,
    },
    setElementsSuccess(sampleReceipt)
  );
  assert.equal(nextState.elementsOutcome, "succeeded");
  assert.equal(nextState.elementsErrorMessage, null);
  assert.deepEqual(nextState.elementsReceipt, sampleReceipt);
});

test("elementsSlice sets failed outcome and message when setElementsFailure is dispatched", () => {
  const nextState = elementsSlice.reducer(
    {
      clientSecret: null,
      elementsOutcome: "idle",
      elementsErrorMessage: null,
      elementsReceipt: sampleReceipt,
    },
    setElementsFailure("Card was declined")
  );
  assert.equal(nextState.elementsOutcome, "failed");
  assert.equal(nextState.elementsErrorMessage, "Card was declined");
  assert.equal(nextState.elementsReceipt, null);
});

test("elementsSlice resets outcome when resetElementsOutcome is dispatched", () => {
  const nextState = elementsSlice.reducer(
    {
      clientSecret: null,
      elementsOutcome: "failed",
      elementsErrorMessage: "Previous error",
      elementsReceipt: null,
    },
    resetElementsOutcome()
  );
  assert.equal(nextState.elementsOutcome, "idle");
  assert.equal(nextState.elementsErrorMessage, null);
  assert.equal(nextState.elementsReceipt, null);
});
