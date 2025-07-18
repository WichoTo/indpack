// components/general/InputPorcentaje.tsx
import React from 'react';
import { NumericFormat, NumericFormatProps, NumberFormatValues } from 'react-number-format';

interface InputPorcentajeProps extends Omit<NumericFormatProps, 'onValueChange'> {
  onChange?: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const InputPorcentaje = React.forwardRef<HTMLInputElement, InputPorcentajeProps>(function InputPorcentaje(props, ref) {
  const { onChange, name, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      thousandSeparator={false}
      decimalSeparator="."
      decimalScale={2}
      fixedDecimalScale
      suffix=" %"
      allowNegative={false}
      allowLeadingZeros={false}
      isAllowed={({ floatValue }) => floatValue === undefined || floatValue <= 1000000}
      onValueChange={(values: NumberFormatValues) => {
        if (!onChange) return;
        onChange({
          target: {
            name,
            value: values.floatValue !== undefined ? values.floatValue.toString() : '',
          }
        });
      }}
    />
  );
});

export default InputPorcentaje;
