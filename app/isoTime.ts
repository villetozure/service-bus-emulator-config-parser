/**
 * Parses an ISO 8601 duration and returns the total duration in milliseconds.
 * @param isoDuration ISO 8601 duration string (e.g., "PT5M", "P1D")
 * @returns Duration in milliseconds
 */
export function getIsoTime(isoDuration: string): number {
  const regex =
    /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;

  const match = regex.exec(isoDuration);
  if (!match) {
    throw new Error(`Invalid ISO 8601 duration format: ${isoDuration}`);
  }

  const days = parseInt(match[1] || "0", 10);
  const hours = parseInt(match[2] || "0", 10);
  const minutes = parseInt(match[3] || "0", 10);
  const seconds = parseFloat(match[4] || "0");

  // Convert to milliseconds
  const totalMilliseconds =
    days * 24 * 60 * 60 * 1000 +
    hours * 60 * 60 * 1000 +
    minutes * 60 * 1000 +
    seconds * 1000;

  return totalMilliseconds;
}

/**
 * Converts a duration string to an ISO 8601 duration format, clamping it within min and max duration.
 * @param durationStr Duration in "D.HH:MM:SS" or "HH:MM:SS" format
 * @param maxDuration Maximum duration in milliseconds
 * @param minDuration Minimum duration in milliseconds
 * @returns ISO 8601 duration string
 */
export function durationToIso(
  durationStr: string,
  maxDuration: number,
  minDuration: number
): string {
  const parseDuration = (duration: string) => {
    let days = 0;
    let time = duration;

    // Split duration into days and time
    if (duration.includes(".")) {
      const parts = duration.split(".");
      days = parseInt(parts[0], 10);
      time = parts[1];
    }

    const [hours, minutes, seconds] = time.split(":").map(Number);
    return {
      days,
      hours: hours || 0,
      minutes: minutes || 0,
      seconds: seconds || 0,
    };
  };

  const clampDuration = (ms: number, max: number, min: number) =>
    Math.min(Math.max(ms, min), max);

  const convertToMilliseconds = ({
    days,
    hours,
    minutes,
    seconds,
  }: ReturnType<typeof parseDuration>) =>
    days * 24 * 60 * 60 * 1000 +
    hours * 60 * 60 * 1000 +
    minutes * 60 * 1000 +
    seconds * 1000;

  const toIsoFormat = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let isoFormat = "P";
    if (days > 0) isoFormat += `${days}D`;
    if (hours || minutes || seconds) {
      isoFormat += "T";
      if (hours > 0) isoFormat += `${hours}H`;
      if (minutes > 0) isoFormat += `${minutes}M`;
      if (seconds > 0) isoFormat += `${seconds}S`;
    }

    return isoFormat;
  };

  const parsedDuration = parseDuration(durationStr);
  const durationMs = convertToMilliseconds(parsedDuration);
  const clampedDurationMs = clampDuration(durationMs, maxDuration, minDuration);

  return toIsoFormat(clampedDurationMs);
}
