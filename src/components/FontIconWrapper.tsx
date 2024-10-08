import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface FontIconWrapperProps {
  icon: any,
  size?: any,
  className?: any,
  spinPulse?: any
}

export default function FontIconWrapper(props: FontIconWrapperProps) {
  return <FontAwesomeIcon {...props} />;
}
