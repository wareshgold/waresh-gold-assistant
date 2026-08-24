export type SignalStatus =
    | "ACTIVE"
    | "TP_HIT"
    | "SL_HIT"
    | "EXPIRED";

export function isTerminalStatus(status: SignalStatus): boolean {
    return (
        status === "TP_HIT" ||
        status === "SL_HIT" ||
        status === "EXPIRED"
    );
}
