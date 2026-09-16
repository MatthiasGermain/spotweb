"use client";

export default function IbanInput({ defaultValue }: { defaultValue: string }) {
  return (
    <input
      type="text"
      name="iban"
      className="iban-input"
      defaultValue={defaultValue}
      placeholder="FR76 3000 6000 0112 3456 7890 189"
      onInput={(e) => {
        const input = e.currentTarget;
        const v = input.value.replace(/\s+/g, "").toUpperCase();
        input.value = (v.match(/.{1,4}/g) ?? []).join(" ");
      }}
    />
  );
}
