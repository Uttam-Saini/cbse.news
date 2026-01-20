import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog
} from "lucide-react";

type WeatherIconProps = {
  condition: string;
  size?: number;
};

export default function WeatherIcon({ condition, size = 40 }: WeatherIconProps) {
  const normalized = condition.toLowerCase();

  if (normalized.includes("rain")) return <CloudRain size={size} />;
  if (normalized.includes("snow")) return <CloudSnow size={size} />;
  if (normalized.includes("thunder")) return <CloudLightning size={size} />;
  if (normalized.includes("fog") || normalized.includes("mist") || normalized.includes("haze"))
    return <CloudFog size={size} />;
  if (normalized.includes("cloud")) return <Cloud size={size} />;
  if (normalized.includes("clear")) return <Sun size={size} />;

  return <Cloud size={size} />;
}
