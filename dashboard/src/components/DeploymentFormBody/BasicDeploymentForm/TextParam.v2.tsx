import * as React from "react";
import { IBasicFormParam } from "shared/types";

export interface IStringParamProps {
  id: string;
  label: string;
  inputType?: string;
  param: IBasicFormParam;
  handleBasicFormParamChange: (
    param: IBasicFormParam,
  ) => (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

function TextParam({ id, param, label, inputType, handleBasicFormParamChange }: IStringParamProps) {
  const [value, setValue] = React.useState(param.value as any);
  let timeout: NodeJS.Timeout;
  const onChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setValue(e.currentTarget.value);
    // Gather changes before submitting
    clearTimeout(timeout);
    const func = handleBasicFormParamChange(param);
    // The reference to target get lost, so we need to keep a copy
    const targetCopy = {
      currentTarget: {
        value: e.currentTarget.value,
        type: e.currentTarget.type,
      },
    } as React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
    timeout = setTimeout(() => func(targetCopy), 500);
  };
  let input = (
    <input
      id={id}
      onChange={onChange}
      value={value}
      className="clr-input deployment-form-text-input"
      type={inputType ? inputType : "text"}
    />
  );
  if (inputType === "textarea") {
    input = <textarea id={id} onChange={onChange} value={value} />;
  } else if (param.enum != null && param.enum.length > 0) {
    input = (
      <select id={id} onChange={handleBasicFormParamChange(param)}>
        {param.enum.map(enumValue => (
          <option key={enumValue} selected={param.value === enumValue}>
            {enumValue}
          </option>
        ))}
      </select>
    );
  }
  return (
    <div>
      <label
        htmlFor={id}
        className="centered deployment-form-label deployment-form-label-text-param"
      >
        {label}
      </label>
      {input}
      {param.description && <span className="description">{param.description}</span>}
    </div>
  );
}

export default TextParam;
