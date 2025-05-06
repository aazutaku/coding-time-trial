"use client";
import { useState, useEffect, useRef } from "react";

type Props = {
  template: string;
  disabled: boolean;
  onSubmit: (answer: string, elapsed: number) => void;
};
export function InputOverlay({ template, disabled, onSubmit }: Props) {
  const [value, setValue] = useState("");
  const [startTime] = useState(() => Date.now());
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled) {
      const elapsed = (Date.now() - startTime) / 1000;
      onSubmit(value, elapsed);
    }
  };
  return (
    <div
      style={{
        position: "absolute",
        top: 300,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder={template}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        style={{ width: 400, fontSize: 16 }}
      />
    </div>
  );
}
