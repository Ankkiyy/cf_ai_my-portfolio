declare module "react-qr-scanner" {
  import { Component, type CSSProperties } from "react";

  export interface QrReaderProps {
    delay?: number | false;
    onError?: (error: unknown) => void;
    onScan?: (data: string | null) => void;
    style?: CSSProperties;
    constraints?: MediaTrackConstraints;
    className?: string;
    facingMode?: "environment" | "user";
    legacyMode?: boolean;
  }

  export default class QrReader extends Component<QrReaderProps> {}
}
