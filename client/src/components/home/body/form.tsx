"use client";

import { RiddleProvider } from "@/context/riddle-context";
import { AnswerForm } from "./answer-form";
import AttemptedAnswers from "./attempted-answers";
import { RiddleDisplay } from "./riddle-display";

const Form = () => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <RiddleDisplay />
      <AnswerForm />
      <AttemptedAnswers />
    </div>
  );
};

export default function FormWrapper() {
  return (
    <RiddleProvider>
      <Form />
    </RiddleProvider>
  );
}
