interface RangeSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

const RangeSlider = (props: RangeSliderProps) => {
  const onInput = (event: any) => {
    props.onChange(event.target.value);
  };

  return (
    <input
      type="range"
      className="accent-[#1db954] w-full"
      max={props.max}
      min={props.min}
      value={props.value}
      onChange={onInput}
    />
  );
};

export default RangeSlider;
