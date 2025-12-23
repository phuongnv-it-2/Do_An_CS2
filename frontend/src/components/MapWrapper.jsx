import { forwardRef } from "react";
import VietNamMap from "../assets/VietNamMap.svg?react";

const VietNamMapWrapper = forwardRef((props, ref) => {
  return <VietNamMap ref={ref} {...props} />;
});

export default VietNamMapWrapper;
